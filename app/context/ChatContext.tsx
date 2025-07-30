"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextType {
  userMsg: string;
  geminiReply: string;
  setUserMsg: (msg: string) => void;
  setGeminiReply: (reply: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [userMsg, setUserMsg] = useState("");
  const [geminiReply, setGeminiReply] = useState("");

  return (
    <ChatContext.Provider value={{ userMsg, geminiReply, setUserMsg, setGeminiReply }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
}
