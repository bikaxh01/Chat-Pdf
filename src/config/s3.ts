import aws, { S3 } from "aws-sdk";

export async function uploadToS3(file: File) {
  try {
    aws.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
    });

    const s3 = new S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      },
      region: "ap-south-1",
    });
    let file_key =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: file_key,
      Body: file,
    };

    const upload =  s3
      .putObject(params)
      .on("httpUploadProgress", (event) => {
        console.log(
          "Uploading to S3",
          parseInt(((event.loaded * 100) / event.total).toString()+"%")
        );
      }).promise()
 
      await upload.then(data=>{
        console.log("Completed");
        
      })

    return Promise.resolve( {
        file_key,
        fileName: file.name,
      })
  } catch (error) {
    console.log("🚀 ~ uploadToS3 ~ error:", error);
  }
}

export function getUrl(file_key: string) {
  const url = `https://s3.ap-south-1.amazonaws.com/${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}/uploads/${file_key}`;
  return url;
}
