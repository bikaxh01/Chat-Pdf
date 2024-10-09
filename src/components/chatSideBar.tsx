import { chat } from "@prisma/client";
import { Key, MessageCircle, PlusCircle } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface chats {
  chats: chat[];
  chat_id: string;
}

function ChatSideBar({ chats, chat_id }: chats) {
  return (
    <div className=" w-full text-white h-screen p-4 bg-gray-900 ">
      <Link href="/">
        <Button className="w-full  border-dashed border-white border">
          <PlusCircle className=" h-4 w-4 mr-2" />
          New Chat
        </Button>
      </Link>
      <div className=" flex flex-col gap-2 mt-4">
        {chats.map((chat) => (
          <Link href={`${chat.id}`} key={chat.id}>
            <div
              className={cn(
                " rounded-lg p-3 text-slate-300 flex items-center",
                {
                  "bg-blue-600 text-white": chat.id === chat_id,
                  "hover:text-white": chat.id !== chat_id,
                }
              )}
            >
              <p className="flex w-full overflow-hidden text-sm whitespace-nowrap truncate text-ellipsis">
                <MessageCircle className="mr-2 flex-shrink-0" />
                <span className="truncate">{chat.pdf_Name}</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className=" absolute bottom-4 left-4">
        <div className=" flex items-center gap-2 flex-wrap text-slate-600">
          <Link href={"/"}>Home</Link>
          <Link href={"/"}>Source</Link>
        </div>
      </div>
    </div>
  );
}

export default ChatSideBar;
