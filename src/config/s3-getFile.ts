import aws from "aws-sdk";
import fs from "fs";

export async function downloadFile(file_key: string) {
  try {
    aws.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
    });

    const s3 = new aws.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      },
      region: "ap-south-1",
    });

    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: file_key,
    };

    const file = await s3.getObject(params).promise();

    const filename = `/tmp/${Date.now()}.pdf`;
    fs.writeFileSync(filename, file.Body as Buffer);

    return filename;
  } catch (error) {
    console.log("🚀 ~ getFile ~ error:", error);
    return null;
  }
}
