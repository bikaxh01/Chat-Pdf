import { s3ToPineCone } from "@/config/Pinecone";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { file_key, fileName } = body;

    const uploadedToPinecone = await s3ToPineCone(file_key)
    

    return Response.json({ message: "Success" });
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);

    return Response.json("Something Went Wrong..", {
      status: 500,
    });
  }
}
