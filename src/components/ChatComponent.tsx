"use client";
import React from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessagesComponent from "./Messages";

function ChatComponent() {
  const { input, handleInputChange, handleSubmit,messages } = useChat({
    api:'api/chat'
  });
  
  return (
    <div className=" relative max-h-screen overflow-hidden">
      <div className=" sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className=" text-xl font-bold">Chat</h3>
      </div>
      <MessagesComponent messages={messages}/>
      <form onSubmit={handleSubmit}>
        <Input 
        value={input}
        onChange={handleInputChange}
        type="text" 
        className="w-[90%] ml-5"
        />
        <Button
        className=" bg-blue-600 ml-5 mt-3 w-[90%] "
        type="submit">
            <Send className=" w-4 h-4"/>
        </Button>
      </form>
    </div>
  );
}

export default ChatComponent;
