"use client";
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

export type ChatMessageType = {
  userMsg: string;
  geminiReply?: string;
  timestamp?: Date;
  replyTimestamp?: Date;
};

export interface ChatContextType {
  chatHistory: ChatMessageType[];
  setChatHistory: Dispatch<SetStateAction<ChatMessageType[]>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([]);
  return (
    <ChatContext.Provider value={{ chatHistory, setChatHistory }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
}
