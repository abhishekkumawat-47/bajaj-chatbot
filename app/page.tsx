"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useChat } from "./context/ChatContext";
import { Send } from "lucide-react";


export default function Home() {

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setChatHistory } = useChat();

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  function getUniqueId(length = 12) {
    return Math.random().toString(36).substring(2, 2 + length);
  }

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const userMessage = input.trim();
    const userTimestamp = new Date();
    // Set chat history with user message only, Gemini reply will be fetched on chat page
    setChatHistory([
      { userMsg: userMessage, timestamp: userTimestamp }
    ]);
    const words = userMessage.split(/\s+/).slice(0, 3).join(" ");
    const slug = slugify(words.slice(0, 10));
    const uniqueId = getUniqueId();
    const url = `/chat/${slug}-${uniqueId}`;
    router.push(url);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen w-screen bg-[color:var(--color-background)]">
          <div className="text-3xl bonbon-regular animate-pulse">Loading Gemini response...</div>
        </div>
      ) : (
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-[color:var(--color-text-muted)] bg-[radial-gradient(#313045_2px,var(--color-background)_2px)] bg-[size:20px_20px]">
          <div className="flex flex-col gap-10 h-screen w-full items-center justify-center">
            <h1 className="text-5xl bonbon-regular font-bold text-glow">
              Bajaj Bot
            </h1>
            <div className="w-full text-lg max-w-4xl mx-auto px-4 py-3 bg-[color:var(--color-surface)]  border-2 border-[color:var(--color-text-muted)] rounded-xl shadow-lg drop-shadow-[0_0_10px_rgba(119,130,246,0.3)]">
              <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bonbon-regular bg-transparent text-[color:var(--color-text)] placeholder-[color:var(--color-text-muted)] resize-none outline-none border-none leading-relaxed font-medium text-sm sm:text-base min-h-[72px] max-h-32 sm:max-h-40 overflow-y-auto"
              placeholder="My dog name is vinod singh rathore..."
              rows={3}
              style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--color-text-muted) transparent'
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-[color:var(--color-text-muted)] hover:bg-[color:var(--color-text)] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5 text-[color:var(--color-background)]" />
            </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
