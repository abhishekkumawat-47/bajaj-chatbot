
"use client";
import React, { Suspense } from "react";
import { useChat } from "../../context/ChatContext";

const ChatMessage = React.lazy(
  () =>
    Promise.resolve({
      default: ({ message, reply }: { message: string; reply: string }) => (
        <div className="p-10 bonbon-regular text-3xl">
          <div><b>You:</b> {message}</div>
          <div className="mt-6"><b>Bajaj Bot:</b> {reply}</div>
        </div>
      ),
    })
);

const Page = () => {
  const { userMsg, geminiReply } = useChat();
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatMessage message={userMsg} reply={geminiReply} />
    </Suspense>
  );
};

export default Page;
