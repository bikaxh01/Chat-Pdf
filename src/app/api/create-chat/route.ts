export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { file_key, fileName } = body;
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);

    return Response.json("Something Went Wrong..");
  }
}
