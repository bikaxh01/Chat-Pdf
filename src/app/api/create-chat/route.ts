import { s3ToPineCone } from "@/config/Pinecone";
import { prisma_client } from "@/config/prisma";
import { getUrl } from "@/config/s3";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();

  try {
    if (!userId) {
      return Response.json({ message: "Unauthorized" }, { status: 400 });
    }
    const body = await req.json();
    const { file_key, fileName } = body;

    await s3ToPineCone(file_key);

    const createChat = await prisma_client.chat.create({
      data: {
        user_Id: userId,
        file_Key: file_key,
        pdf_Name: fileName,
        pdf_Url: getUrl(file_key),
      },
      select: {
        id: true,
      },
    });

    return Response.json(
      { message: "Success", chat_id: createChat.id },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);

    return Response.json("Something Went Wrong..", {
      status: 500,
    });
  }
}
