import { Button } from "@/components/ui/button";
import Uploader from "@/components/uploader";
import { prisma_client } from "@/config/prisma";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useId } from "react";

export default async function Page() {
  const { userId } = await auth();

  const isAuth = !!userId;
  let firstChat;

  if (userId) {
    firstChat = await prisma_client.chat.findFirst({
      where: {
        user_Id: userId,
      },
    });
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat with any PDF</h1>
            <UserButton afterSwitchSessionUrl="/" />
          </div>
          <div className=" flex mt-2">
            {isAuth && (
              <Link href={`chat/${firstChat?.id}`}>
                <Button>Go to chats</Button>
              </Link>
            )}
          </div>
          <p className=" max-w-xl mt-1 text-1g text-slate-600">
            Join millions of students, researchers and professionals to
            instantly answer questions and understand research with AI
          </p>
          <div className=" w-full mt-4">
            {isAuth ? (
              <Uploader />
            ) : (
              <Link href={"/sign-in"}>
                <Button>
                  Login to get started
                  <LogIn className=" w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
