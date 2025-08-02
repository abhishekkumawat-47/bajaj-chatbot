"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Paperclip, Mic, Send, X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, LogOut, History } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.",
      sender: "user",
      timestamp: new Date(),
    },
    {
      id: "2",
      content:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit. Pretium tellus duis convallis tempus leo eu aenean. Iaculis massa nisl malesuada lacinia integer nunc posuere. Conubia nostra inceptos himenaeos orci varius natoque penatibus. Nulla molestie mattis scelerisque maximus eget fermentum odio. Blandit quis suspendisse aliquet nisl sodales consequat magna. Ligula congue sollicitudin erat viverra ac tincidunt nam. Velit aliquam imperdiet mollis nullam volutpat porttitor ullamcorper. Dui felis venenatis ultrices proin libero feugiat tristique. Cubilia curae hac habitasse platea dictumst lorem ipsum. Sem placerat in id cursus mi pretium tellus. Fringilla lacus nec metus bibendum egestas iaculis massa. Taciti sociosqu ad litora torquent per conubia nostra. Ridiculus mus donec rhoncus eros lobortis nulla molestie. Mauris pharetra vestibulum fusce dictum risus blandit quis. Finibus facilisis dapibus etiam.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Replace this with your actual chatbot API endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "Sorry, I couldn't process your request.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, I'm having trouble connecting right now. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const LoadingDots = () => (
    <motion.div
      className="flex space-x-1 items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-white rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.div>
  );

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
        }}
      />

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-slate-800/95 backdrop-blur-md border-l border-slate-600/50 z-50 flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-600/50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-400">
                  <img
                    src="/placeholder.svg?height=48&width=48"
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-medium">Aditya Agarwal</h3>
                  <p className="text-slate-400 text-sm">@aditya_agarwal</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full w-8 h-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    console.log("Account info clicked");
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-slate-200 hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
                >
                  <User className="h-5 w-5" />
                  <span>Account Info</span>
                </button>

                <button
                  onClick={() => {
                    console.log("Settings clicked");
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-slate-200 hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={() => {
                    console.log("Chat history clicked");
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-slate-200 hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
                >
                  <History className="h-5 w-5" />
                  <span>Chat History</span>
                </button>
              </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="p-6 border-t border-slate-600/50">
              <button
                onClick={() => {
                  console.log("Logout clicked");
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-600/20 rounded-lg transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-start p-4 sm:p-6 lg:p-8">
        <div className="text-white">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-thin tracking-[0.2em] leading-tight">
            POLICY
          </h1>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-thin tracking-[0.2em] leading-tight">
            SAHAYAK
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:bg-slate-700/50 rounded-full w-auto h-auto p-0"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden border-2 border-purple-400 shadow-lg">
              <img
                src="/placeholder.svg?height=64&width=64"
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </Button>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="absolute inset-0 pt-24 sm:pt-28 lg:pt-32 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.3) transparent",
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            width: 6px;
          }
          div::-webkit-scrollbar-track {
            background: transparent;
          }
          div::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
          }
        `}</style>

        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start space-x-2 sm:space-x-3 max-w-[85%] sm:max-w-3xl ${
                    message.sender === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  {message.sender === "bot" && (
                    <motion.div
                      className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 mt-1"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.1,
                        duration: 0.4,
                        ease: "easeOut",
                      }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-full transform rotate-45"></div>
                          <div className="absolute top-0.5 left-0.5 sm:top-1 sm:left-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <motion.div
                    className={`px-4 py-3 sm:px-6 sm:py-4 rounded-2xl sm:rounded-3xl ${
                      message.sender === "user"
                        ? "bg-slate-600/80 backdrop-blur-sm text-white ml-auto shadow-lg"
                        : "bg-transparent text-white"
                    }`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.2 }}
                  >
                    <p className="text-xs sm:text-sm leading-relaxed">
                      {message.content}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Message */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <motion.div
                    className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 mt-1"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-full transform rotate-45"></div>
                        <div className="absolute top-0.5 left-0.5 sm:top-1 sm:left-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </motion.div>
                  <div className="px-4 py-3 sm:px-6 sm:py-4 rounded-2xl sm:rounded-3xl bg-transparent">
                    <LoadingDots />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-slate-800/90 backdrop-blur-md rounded-full border border-slate-600/50 p-2 flex items-center space-x-2 sm:space-x-3 shadow-2xl"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent border-none text-white placeholder-slate-400 focus:ring-0 focus:outline-none text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              variant="ghost"
              size="sm"
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50 disabled:opacity-50 transition-all duration-200"
            >
              {inputValue.trim() ? (
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
