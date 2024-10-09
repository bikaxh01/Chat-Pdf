import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import React from "react";

function MessagesComponent({ messages }: { messages: Message[] }) {
  if (!messages) return <></>;
  return (
    <div className=" flex flex-col gap-2 px-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn("flex", {
            "justify-end pl-10": message.role === "user",
            "justify-start pr-10": message.role === "system",
          })}
        >
          <div
            className={cn("rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10 ", {
              " bg-blue-500 text-white": message.role === "user",
              " bg-white text-black": message.role === "system",
            })}
          >
            <p>{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessagesComponent;
