import { Pinecone } from "@pinecone-database/pinecone";
import { removeNonAsciiCharacters } from "./Pinecone";
import { getEmbedding } from "./embedding";

export async function getSimilarEmbeddings(
  embeddings: number[],
  file_Key: string
) {
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY as string,
    });

    const pineconeIndex = await pinecone.Index("pdf");
    const nameSpace = pineconeIndex.namespace(
      removeNonAsciiCharacters(file_Key)
    );
    const response = await nameSpace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });

    return response.matches || [];
  } catch (error) {
    console.log("🚀 ~ error:", error);
    throw error;
  }
}

export async function getContext(query: string, file_Key: string) {
  try {
    const embedQuery = await getEmbedding(query);
    

    const getVector = await getSimilarEmbeddings(embedQuery, file_Key);
    

    const filteredVectors = await getVector.filter(
      (embed) => embed.score && embed.score > 0.7
    );
    

    type Metadata = {
      text: string;
      pageNumber: number;
    };

    let docs = filteredVectors.map(
      (match) => (match.metadata as Metadata).text
    );

    return docs.join("\n").substring(0, 3000);
  } catch (error) {
    console.log("🚀 ~ getContext ~ error:", error);
    throw error;
  }
}
