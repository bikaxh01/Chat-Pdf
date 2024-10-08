import { OpenAIApi, Configuration } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPEN_AI_API_KEY,
});

const openAI = new OpenAIApi(config);

export async function getEmbedding(text: string) {
  
  try {
    const response = await openAI.createEmbedding({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, ""),
    });

    const result  = await response.json()
   
    return result.data[0].embedding as number []
  } catch (error) {
    console.log("🚀 ~ getEmbedding ~ error:", error);
    throw error;
  }
}
