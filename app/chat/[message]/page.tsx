"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useChat } from "../../context/ChatContext";



const ChatMessage = React.lazy(
  () =>
    Promise.resolve({
      default: ({ message, isUser, timestamp }: { message: string; isUser: boolean; timestamp: Date }) => (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
          <div className={`max-w-[80%] p-4 rounded-2xl ${
            isUser 
              ? 'bg-[color:var(--color-surface)] border-2 border-[color:var(--color-text-muted)] text-[color:var(--color-text)]' 
              : 'bg-[color:var(--color-surface)] border-2 border-[color:var(--color-text-muted)] text-[color:var(--color-text)]'
          }`}>
            <div className="bonbon-regular text-sm sm:text-base leading-relaxed">
              <div className="font-semibold mb-1 text-[color:var(--color-text-muted)]">
                {isUser ? 'You' : 'Bajaj Bot'}
              </div>
              <div>{message}</div>
              <div className="text-xs text-[color:var(--color-text-muted)] mt-2 opacity-70">
                {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      ),
    })
);

const TypingIndicator = () => (
  <div className="flex justify-start mb-4">
    <div className="bg-[color:var(--color-surface)] border-2 border-[color:var(--color-text-muted)] p-4 rounded-2xl">
      <div className="flex items-center space-x-2">
        <span className="text-[color:var(--color-text-muted)] text-sm bonbon-regular">Bajaj Bot is typing</span>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-[color:var(--color-text-muted)] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[color:var(--color-text-muted)] rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-2 h-2 bg-[color:var(--color-text-muted)] rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>
    </div>
  </div>
);

const Page = () => {
  
  const { chatHistory, setChatHistory } = useChat();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  // On mount, if last message has no Gemini reply, fetch it
  useEffect(() => {
    if (
      chatHistory.length > 0 &&
      !chatHistory[chatHistory.length - 1].geminiReply &&
      !loading
    ) {
      (async () => {
        setLoading(true);
        const lastMsg = chatHistory[chatHistory.length - 1].userMsg;
        const res = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: lastMsg }),
        });
        const data = await res.json();
        setChatHistory((prev) => {
          const last = prev[prev.length - 1];
          return [
            ...prev.slice(0, -1),
            {
              ...last,
              geminiReply: data.reply,
              replyTimestamp: new Date(),
            },
          ];
        });
        setLoading(false);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const userMessage = input.trim();
    const userTimestamp = new Date();
    setChatHistory((prev) => [
      ...prev,
      { userMsg: userMessage, timestamp: userTimestamp }
    ]);
    setInput("");
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setChatHistory((prev) => {
        const last = prev[prev.length - 1];
        return [
          ...prev.slice(0, -1),
          {
            ...last,
            geminiReply: data.reply,
            replyTimestamp: new Date(),
          },
        ];
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen bg-[color:var(--color-background)] bg-[radial-gradient(#313045_2px,var(--color-background)_2px)] bg-[size:20px_20px] flex flex-col">
      {/* Header */}
      <div className="bg-[color:var(--color-surface)] border-b-2 border-[color:var(--color-text-muted)] p-4 sticky top-0 z-10">
        <h1 className="text-2xl sm:text-3xl bonbon-regular font-bold text-glow text-[color:var(--color-text)] text-center">
          Bajaj Bot
        </h1>
        <p className="text-center text-sm text-[color:var(--color-text-muted)] mt-1">
          AI Assistant
        </p>
      </div>

      {/* Chat Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 pb-20"
        style={{ 
          height: 'calc(100vh - 120px)',
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--color-text-muted) transparent'
        }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Welcome Message */}
          {(!chatHistory || chatHistory.length === 0) && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="text-xl sm:text-2xl bonbon-regular font-bold text-[color:var(--color-text)] mb-2">
                Welcome to Bajaj Bot!
              </h2>
              <p className="text-[color:var(--color-text-muted)] text-sm sm:text-base">
                Start a conversation by sending a message
              </p>
            </div>
          )}

          {/* Chat Messages */}
          <Suspense fallback={
            <div className="flex justify-center items-center py-8">
              <div className="text-[color:var(--color-text-muted)] bonbon-regular">Loading chat...</div>
            </div>
          }>
            {chatHistory && chatHistory.map((chat: {
              userMsg: string;
              geminiReply?: string;
              timestamp?: Date;
              replyTimestamp?: Date;
            }, index: number) => (
              <div key={index}>
                {/* User Message */}
                <ChatMessage 
                  message={chat.userMsg} 
                  isUser={true}
                  timestamp={chat.timestamp || new Date()}
                />
                {/* Bot Reply */}
                {chat.geminiReply && (
                  <ChatMessage 
                    message={chat.geminiReply} 
                    isUser={false}
                    timestamp={chat.replyTimestamp || new Date()}
                  />
                )}
              </div>
            ))}
            {/* Typing Indicator */}
            {loading && <TypingIndicator />}
          </Suspense>
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-[color:var(--color-surface)] border-t-2 border-[color:var(--color-text-muted)] p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bonbon-regular bg-transparent text-[color:var(--color-text)] placeholder-[color:var(--color-text-muted)] resize-none outline-none border-none leading-relaxed font-medium text-sm sm:text-base min-h-[48px] max-h-32 sm:max-h-40 overflow-y-auto"
            placeholder="Type your message..."
            rows={2}
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--color-text-muted) transparent'
            }}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-[color:var(--color-text-muted)] hover:bg-[color:var(--color-text)] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <span className="material-icons text-[color:var(--color-background)]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;



