import { createContext, useContext, useState } from "react";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [threads, setThreads] = useState([]);
  const [currentThread, setCurrentThread] = useState(null);
  const [messages, setMessages] = useState([]);

  // Fetch threads from backend
  const fetchThreads = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/threads");

      if (!response.ok) {
        throw new Error("Failed to fetch threads");
      }

      const data = await response.json();

      setThreads(data);
      return data
    } catch (error) {
      console.error("Error fetching threads:", error);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/threads/${threadId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete thread");
      }
    } catch (error) {
      console.error("Error deleting thread:", error);
    }
  };

  const fetchMessages = async (threadId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/threads/${threadId}/messages`);
      const data = await response.json();
      setMessages(data);
      console.log("Fetched messages for thread:", threadId, data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        threads,
        setThreads,

        currentThread,
        setCurrentThread,

        messages,
        setMessages,

        fetchThreads,
        deleteThread,
        fetchMessages,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  return useContext(StoreContext);
};