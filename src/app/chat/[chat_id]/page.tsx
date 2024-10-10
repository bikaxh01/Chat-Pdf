import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/chatSideBar";
import PDFviewer from "@/components/PDFviewer";
import { prisma_client } from "@/config/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import React from "react";

async function chatPage({
  params: { chat_id },
}: {
  params: { chat_id: string };
}) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const getChats = await prisma_client.chat.findMany({
    where: {
      user_Id: userId,
    },
  });

  if (!getChats) {
    redirect("/ ");
  }

  if (!getChats.find((chat) => chat.id === chat_id)) {
    redirect("/");
  }

  const currentChat = getChats.find((chat) => chat.id === chat_id);

  return (
    <div className=" flex max-h-screen overflow-hidden">
      <div className=" flex w-full max-h-screen overflow-hidden">
        <div className=" flex-[1] max-w-xs">
          <ChatSideBar chat_id={chat_id} chats={getChats} />
        </div>
        <div className=" max-h-screen p-4 overflow-hidden flex-[5]">
          <PDFviewer PDF_URL={currentChat?.pdf_Url || ""} />
        </div>
        <div className=" flex-[3] border-l-4  border-l-slate-200">
          <ChatComponent  chat_Id={chat_id}/>
        </div>
      </div>
    </div>
  );
}

export default chatPage;
