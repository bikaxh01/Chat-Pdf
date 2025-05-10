import { Configuration, OpenAIApi } from "openai-edge";
import { Message } from "ai";
import { streamText } from "ai";
import { prisma_client } from "@/config/prisma";
import { getContext } from "@/config/context";
import { anthropic } from "@ai-sdk/anthropic";

interface chatBody {
  messages: Message[];
  chat_Id: string;
}

export async function POST(req: Request) {
  try {
    const { messages, chat_Id }: chatBody = await req.json();

    const chat = await prisma_client.chat.findUnique({
      where: {
        id: chat_Id,
      },
    });

    if (!chat) {
      return Response.json("Invalid Chat Id", {
        status: 404,
      });
    }

    const file_Key = chat.file_Key;
    const lastMessage = messages[messages.length - 1];

    const context = await getContext(lastMessage.content, file_Key);
    const prompt = {
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
        The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
        AI is a well-behaved and well-mannered individual.
        AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
        AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
        AI assistant is a big fan of Pinecone and Vercel.
        START CONTEXT BLOCK
        ${context}
        END OF CONTEXT BLOCK
        AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
        If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
        AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
        AI assistant will not invent anything that is not drawn directly from the context.

        THIS IS THE PREVIOUS CONVERSATION HISTORY 
        ${[...messages]}
        `,
    };

    await prisma_client.message.create({
      data: {
        chat_Id: chat.id,
        content: lastMessage.content,
        role: "user",
      },
    });
    const result = streamText({
      model: anthropic("claude-3-5-sonnet-20240620"),

      system: prompt.content,

      prompt: lastMessage.content,

      onFinish: async (result) => {
        await prisma_client.message.create({
          data: {
            chat_Id: chat.id,
            content: result.text,
            role: "assistant",
          },
        });
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return Response.json("Internal Server Error", {
      status: 500,
    });
  }
}
