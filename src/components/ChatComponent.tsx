"use client";
import React, { useEffect } from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessagesComponent from "./Messages";
import { prisma_client } from "@/config/prisma";
import axios from "axios";

function ChatComponent({chat_Id}:{chat_Id:string}) {
  const { input, handleInputChange, handleSubmit, messages ,setMessages} = useChat({
    api:'/api/chat',
    body:{
      chat_Id
    }
  });

  useEffect(()=>{
       const getMessages = async ()=>{
         const response = await axios.post('/api/get-messages',{
          chat_Id
         })
         setMessages(response.data)
       }
       getMessages()
  },[chat_Id])
  
  return (
    <div className="relative max-h-screen flex flex-col">
    <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
      <h3 className="text-xl font-bold">Chat</h3>
    </div>
  
    <div className="flex-grow overflow-y-auto">
      <MessagesComponent messages={messages} />
    </div>
  
    <form onSubmit={handleSubmit} className="sticky bottom-0 inset-x-0 p-2 bg-white">
      <Input
        value={input}
        onChange={handleInputChange}
        type="text"
        className="w-[90%] ml-5"
        placeholder="Ask Anything"
      />
      <Button className="bg-blue-600 ml-5 mt-3 w-[90%]" type="submit">
        <Send className="w-4 h-4" />
      </Button>
    </form>
  </div>
  
  );
}

export default ChatComponent;
