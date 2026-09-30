import sys
from dotenv import load_dotenv
load_dotenv()
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.messages import BaseMessage, HumanMessage
from langgraph.graph.message import add_messages
from langgraph.checkpoint.postgres import PostgresSaver
import os
import psycopg
from fastapi import FastAPI, Path, HTTPException, Query
from fastapi.responses import JSONResponse
import json
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_core.tools import tool
import requests

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

search_tool = DuckDuckGoSearchRun(region="us-en")
@tool
def calculator(first_num:float, second_num: float, operation:str) -> dict:
    """ 
    Perform a basic arithmetic operation on two numbers.
    Supported operations are: add, subtract, multiply, divide.
    """
    try:
        if operation == "add":
            result = first_num + second_num
        elif operation == "subtract":
            result = first_num - second_num
        elif operation == "multiply":
            result = first_num * second_num
        elif operation == "divide":
            if second_num == 0:
                raise ValueError("Cannot divide by zero.")
            result = first_num / second_num
        else:
            raise ValueError(f"Unsupported operation: {operation}")
        
        return {"first_num": first_num, "second_num": second_num, "operation": operation, "result": result}
    except Exception as e:
        return {"error": str(e)}

@tool
def get_stock_price(symbol: str) -> dict:
    """
    Fetch the current stock price for a given symbol (e.g. 'AAPL', 'TSLA').
    using Alpha Vantage with API key from environment variable ALPHA_VANTAGE_API_KEY.
    """
    try:
        url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={os.getenv('ALPHA_VANTAGE_API_KEY')}"
        r= requests.get(url)
        return r.json()
    except Exception as e:
        return {"error": str(e)}

tools = [calculator, get_stock_price,search_tool]

llm = HuggingFaceEndpoint(
    repo_id="openai/gpt-oss-20b",
    task="conversational",
    temperature=0.3,
    max_new_tokens=4096,
)
llm2=ChatHuggingFace(llm=llm)

model = llm2.bind_tools(tools)
llm_with_tools  = model.bind_tools(tools)

class Convo(TypedDict):

    messages: Annotated[list[BaseMessage], add_messages]


def run_model(state: Convo):

    response = model.invoke(state["messages"])
    return {'messages': [response]}

def chat_node(state: Convo):
    """LLM node that may answer or request a tool call. It will return a message with the tool call if needed."""
    messages = state["messages"]
    response = llm_with_tools.invoke(messages)
    return {'messages': [response]}
tool_node = ToolNode(tools)

graph = StateGraph(Convo)
graph.add_node("chat_node", chat_node)
graph.add_node("tools", tool_node)
graph.add_edge(START, "chat_node")
graph.add_conditional_edges("chat_node",tools_condition)
graph.add_edge("tools", "chat_node")

DATABASE_URL = os.getenv("DATABASE_URL")
checkpointer_context = PostgresSaver.from_conn_string(DATABASE_URL)
checkpointer = checkpointer_context.__enter__()
checkpointer.setup()

workflow = graph.compile(
    checkpointer=checkpointer
)

summary_th_id = str("s_td_1")


def create_thread(title="New Chat"):
    with psycopg.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO threads (title)
                VALUES (%s)
                RETURNING thread_id;
                """,
                (title,)
            )

            thread_id = cur.fetchone()[0]

    return str(thread_id)

def save_message(thread_id, role, content):
    with psycopg.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO messages (thread_id, role, content)
                VALUES (%s, %s, %s);
                """,
                (thread_id, role, content)
            )

def get_threads():
    with psycopg.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT *
                FROM threads
                """
            )

            rows=cur.fetchall()
            threads = []

            for row in rows:
                threads.append({
                    "thread_id": str(row[0]),
                    "title": row[1],
                    "created_at": row[2].isoformat() if row[2] else None,
                    "updated_at": row[3].isoformat() if row[3] else None,
                })
        return threads

def delete_thread(thread_id):
    with psycopg.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                DELETE FROM threads
                WHERE thread_id = %s
                """,
                (thread_id,)
            )

def get_messages(thread_id):
    with psycopg.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, thread_id, role, content, created_at
                FROM messages
                WHERE thread_id = %s
                ORDER BY created_at ASC
                """,
                (thread_id,)
            )

            rows = cur.fetchall()
            messages = []

            for row in rows:
                messages.append({
                    "id": row[0],
                    "thread_id": str(row[1]),
                    "role": row[2],
                    "content": row[3],
                    "created_at": row[4].isoformat() if row[4] else None,
                })

            return messages

@app.get("/threads")
def read_threads():
    return get_threads()

@app.get("/threads/{thread_id}/messages")
def read_messages(thread_id: str = Path(..., description="The ID of the thread to retrieve messages from")):
    return get_messages(thread_id)

@app.delete("/threads/{thread_id}")
def delete_thread_endpoint(thread_id: str = Path(..., description="The ID of the thread to delete")):
    delete_thread(thread_id)
    return JSONResponse(content={"status": "Thread deleted successfully"})

class OldChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    thread_id: str = Field(..., min_length=1)

class NewChatRequest(BaseModel):
    message: str = Field(..., min_length=1)

@app.post("/old_chat")
def old_chat( request: OldChatRequest):
    message = request.message
    thread_id = request.thread_id
    save_message(thread_id, "user", message)
    config = {
    "configurable": {
        "thread_id": thread_id,
        "recursion_limit": 5
    }
    }
    result = workflow.invoke({"messages": [HumanMessage(content=message)]},config=config)
    assistant_message = result["messages"][-1].content
    save_message(thread_id, "assistant", assistant_message)
    return JSONResponse(content={"assistant_message": assistant_message})

@app.post("/new_chat")
def new_chat(request: NewChatRequest):
    message = request.message
    create_summary_prompt = f"""
    Generate a short, meaningful title for a new chat conversation.

    User message:
    {message}

    Rules:
    - Maximum 5 words.
    - Return only the title.
    - Do not include quotation marks.
    - Do not include explanations.
    """
    result = model.invoke([HumanMessage(content=create_summary_prompt)])
    title = str(result.content).strip().strip('"')

    # Fallback if the model returns an empty title
    if not title:
        title = message[:20]
    thread_id = create_thread(title)  # Use the generated title as the thread name
    save_message(thread_id, "user", message)
    config = {
    "configurable": {
        "thread_id": thread_id,
        "recursion_limit": 5
    }
    }
    result = workflow.invoke({"messages": [HumanMessage(content=message)]},config=config)
    assistant_message = result["messages"][-1].content
    save_message(thread_id, "assistant", assistant_message)
    return JSONResponse(content={"assistant_message": assistant_message, "thread_id": thread_id})

@app.get("/health")
def health_check():
    return JSONResponse(content={"status": "healthy"})