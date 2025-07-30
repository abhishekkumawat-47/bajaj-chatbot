
"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const ChatMessage = React.lazy(
  () =>
    Promise.resolve({
      default: ({ message }: { message: string }) => (
        <div className="p-10 bonbon-regular text-3xl">{message}</div>
      ),
    })
);

const Page = () => {
  const searchParams = useSearchParams();
  const fullMessage = searchParams.get("msg") || "";
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatMessage message={fullMessage} />
    </Suspense>
  );
};

export default Page;
