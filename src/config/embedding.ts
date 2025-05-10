import { OpenAIApi, Configuration } from "openai-edge";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMEINI_API_KEY });

//const openAI = new OpenAIApi(config);

export async function getEmbedding(text: string) {
  try {
    // const response = await openAI.createEmbedding({
    //   model: "text-embedding-ada-002",
    //   input: text.replace(/\n/g, ""),
    // });

    const response = await ai.models.embedContent({
      model: "gemini-embedding-exp-03-07",
      contents: text.replace(/\n/g, ""),

      config: {
        taskType: "SEMANTIC_SIMILARITY",
        outputDimensionality:1536
      },
    });

   

    //@ts-ignore
    return response.embeddings[0].values as number[];
  } catch (error) {
    console.log("🚀 ~ getEmbedding ~ error:", error);
    throw error;
  }
}
