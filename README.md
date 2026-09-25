# 🤖 Persistence Chatbot

<p align="center">
  <b>A full-stack AI chatbot built with LangGraph, FastAPI, PostgreSQL, React, and Hugging Face.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-API-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/LangGraph-Agent%20Workflow-1C3C3C?style=for-the-badge" alt="LangGraph">
  <img src="https://img.shields.io/badge/PostgreSQL-Persistent%20Memory-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-UI-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Hugging%20Face-LLM-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black" alt="Hugging Face">
</p>

---

## ✨ Overview

**Persistence Chatbot** is a full-stack conversational AI application designed around **persistent conversation state**.

Instead of keeping chat history only in application memory, the chatbot uses **LangGraph with PostgreSQL checkpoint persistence**, allowing conversations to remain available across requests and backend restarts.

The project combines:

- 🧠 **LangGraph** for stateful chatbot workflows
- ⚡ **FastAPI** for the backend API
- 💾 **PostgreSQL** for persistent LangGraph checkpoints
- 🤗 **Hugging Face** for the language model
- ⚛️ **React** for the frontend
- 🎨 **Tailwind CSS** for the interface
- 🔗 **React Context / Store Context** for frontend state management
- ☁️ **Render** for deployment

> **Core idea:** Build a chatbot that treats conversation state as persistent application data rather than temporary in-memory state.

---

## 🏗️ Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                         React Frontend                       │
│                                                              │
│  Chat UI  •  Sidebar  •  Conversations  •  Store Context    │
│                    •  Tailwind CSS                           │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               │ HTTP / REST
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                       FastAPI Backend                        │
│                                                              │
│  API Routes  •  Request Validation  •  CORS  •  Chat Logic  │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                         LangGraph                            │
│                                                              │
│          Stateful Chat Workflow + Thread Management          │
└───────────────┬───────────────────────────────┬──────────────┘
                │                               │
                ▼                               ▼
┌──────────────────────────┐       ┌───────────────────────────┐
│      Hugging Face        │       │       PostgreSQL           │
│                          │       │                           │
│       LLM / Inference    │       │  LangGraph Checkpoints    │
└──────────────────────────┘       │  Persistent Conversation │
                                   │          State             │
                                   └───────────────────────────┘
```

### 🔄 Request Flow

```text
User sends message
        ↓
React frontend
        ↓
FastAPI endpoint
        ↓
LangGraph workflow
        ↓
Load checkpoint using thread_id
        ↓
Hugging Face LLM
        ↓
Generate response
        ↓
Save updated state to PostgreSQL
        ↓
Return response to React
        ↓
Display message
```

---

## 🚀 Features

### 💬 Stateful Conversations

Each conversation can be associated with a unique `thread_id`, allowing LangGraph to retrieve the corresponding conversation state from PostgreSQL.

### 💾 Persistent Memory

The application uses PostgreSQL-backed LangGraph checkpointing instead of relying on an in-memory saver.

This means conversation state can survive:

- Backend restarts
- New API requests
- Deployment restarts
- Multiple conversation threads

### 🧵 Thread-Based Chat History

Different conversations can be separated using thread identifiers.

Conceptually:

```text
thread_id = "conversation_123"
             ↓
PostgreSQL checkpoint
             ↓
Previous conversation state
             ↓
New user message
             ↓
Updated state
```

### ⚡ FastAPI Backend

The backend exposes the chatbot functionality through a lightweight API layer with:

- Request validation
- CORS configuration
- JSON responses
- LangGraph integration
- PostgreSQL connectivity

### 🎨 Modern React UI

The frontend is component-based and separates responsibilities across UI components and application state.

Example structure:

```text
frontend/
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── ...
│   └── App.*
├── package.json
└── ...
```

### 🎯 Tailwind CSS

The interface is styled with Tailwind CSS to provide a modern, responsive chatbot experience without relying on a large custom CSS layer.

### 🤗 Hugging Face LLM

The backend uses Hugging Face inference to connect the chatbot workflow to an LLM.

The model can be changed through the backend configuration without redesigning the overall application architecture.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Styling | Tailwind CSS |
| Frontend State | React Context / Store Context |
| Backend | FastAPI |
| Workflow | LangGraph |
| LLM | Hugging Face |
| Database | PostgreSQL |
| Persistence | LangGraph PostgreSQL Checkpointer |
| Language | Python + JavaScript |
| Deployment | Render |

---

## 📁 Project Structure

```text
Persistence_Chatbot/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── .gitignore
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── ...
│   │   └── ...
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/aryan-chaudhary23/Persistence_Chatbot.git
cd Persistence_Chatbot
```

---

# 🐍 Backend Setup

### 2. Create a virtual environment

```bash
python -m venv .venv
```

Activate it on Windows:

```powershell
.venv\Scripts\activate
```

On macOS/Linux:

```bash
source .venv/bin/activate
```

### 3. Install dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file inside the backend directory:

```env
HF_TOKEN=your_huggingface_token
DATABASE_URL=your_postgresql_connection_string
```

> Never commit API keys, database passwords, or other secrets to GitHub.

### 5. Start the backend

From the `backend` directory:

```bash
uvicorn app:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

# ⚛️ Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

If your frontend uses a different start command, use the command defined in `frontend/package.json`.

---

## 🗄️ Persistence with PostgreSQL

One of the main design decisions in this project is using a **PostgreSQL-backed checkpointer** instead of an in-memory saver.

### Traditional in-memory approach

```text
Application
    ↓
MemorySaver
    ↓
RAM
```

If the backend process restarts:

```text
RAM → Lost
Conversation state → Lost
```

### This project's approach

```text
Application
    ↓
LangGraph
    ↓
PostgreSQL Checkpointer
    ↓
Persistent Database
```

After a restart:

```text
Application starts
       ↓
Connect to PostgreSQL
       ↓
Load checkpoint for thread_id
       ↓
Continue conversation
```

This makes PostgreSQL an important part of the chatbot's persistence layer.

---

## 🧵 Why `thread_id` Matters

LangGraph can use a thread identifier to associate messages and workflow state with a particular conversation.

For example:

```python
config = {
    "configurable": {
        "thread_id": "user-conversation-001"
    }
}
```

A different thread can represent a different conversation:

```text
thread_id: conversation-001
    └── Chat history A

thread_id: conversation-002
    └── Chat history B

thread_id: conversation-003
    └── Chat history C
```

This allows the application to support multiple independent conversations.

---

## 🔐 Environment Variables

The application expects sensitive configuration to be supplied through environment variables.

Typical configuration:

```env
HF_TOKEN=...
DATABASE_URL=...
```

For production deployments, configure these variables through the hosting provider rather than committing `.env` to the repository.

---

## ☁️ Deployment

The project is designed to be deployed as separate frontend and backend services.

### Backend

The FastAPI backend can be deployed on **Render**.

Typical start command:

```bash
uvicorn app:app --host 0.0.0.0 --port $PORT
```

Configure production environment variables:

```env
HF_TOKEN=...
DATABASE_URL=...
```

### Frontend

The React frontend can be deployed separately as a static web application.

After deployment, update the frontend API configuration so requests point to the deployed FastAPI backend rather than the local development server.

---

## 🔮 Future Scope

The current architecture provides a foundation for several future improvements.

### 🔐 Authentication

Add user authentication and authorization so conversations can belong to individual users.

Possible flow:

```text
User
 ↓
Authentication
 ↓
User ID
 ↓
Thread ID
 ↓
PostgreSQL
```

This would allow each user to access only their own conversations.

### 🌊 Streaming Responses

Add token-by-token response streaming instead of waiting for the complete LLM response.

Current:

```text
User → Backend → LLM → Complete Response → UI
```

Future:

```text
User
 ↓
Backend
 ↓
LLM
 ↓
Token 1 ─────→ UI
Token 2 ─────→ UI
Token 3 ─────→ UI
Token 4 ─────→ UI
...
```

This can make the chatbot feel significantly more responsive.

### 🧠 More Advanced LangGraph Workflows

The workflow can later be extended with:

- Tool calling
- Retrieval-Augmented Generation (RAG)
- Web search
- Multiple agents
- Conditional routing
- Human-in-the-loop workflows
- Long-term user preferences

### 📊 Conversation Management

Potential additions include:

- Rename conversations
- Delete conversations
- Search chat history
- Conversation timestamps
- User-specific chat history
- Conversation export

---

## 🧩 Design Principles

This project was built around a few key principles:

**1. Persistent state**

Conversation state should not disappear when the backend restarts.

**2. Separation of concerns**

```text
React
  ↓
FastAPI
  ↓
LangGraph
  ↓
LLM + PostgreSQL
```

Each layer has a clear responsibility.

**3. Thread-based state**

Conversations are isolated through LangGraph thread identifiers.

**4. Environment-based configuration**

Secrets and deployment-specific configuration are kept outside the source code.

**5. Component-driven frontend**

The React interface is split into reusable components instead of placing the entire UI in a single component.

---

## 🧪 Development

Run the backend locally:

```bash
cd backend
uvicorn app:app --reload
```

Run the frontend locally:

```bash
cd frontend
npm run dev
```

Then open the frontend URL shown by the development server.

---

## 📌 What I Learned

Building this project helped explore the integration of several production-oriented technologies:

- Designing stateful LangGraph workflows
- Using PostgreSQL for persistent LangGraph checkpoints
- Building REST APIs with FastAPI
- Connecting LLM inference through Hugging Face
- Managing frontend state with React Context
- Structuring a component-based React application
- Styling interfaces with Tailwind CSS
- Connecting frontend and backend services
- Deploying a full-stack AI application on Render
- Managing environment variables and production configuration

---

## 👨‍💻 Author

**Aryan Chaudhary**

Full-Stack Developer • AI/ML Enthusiast

- GitHub: [@aryan-chaudhary23](https://github.com/aryan-chaudhary23)

---

## ⭐ Support

If you find the project interesting, consider giving the repository a ⭐ on GitHub.

---

<p align="center">
  Built with ❤️ using React, FastAPI, LangGraph, PostgreSQL & Hugging Face
</p>
