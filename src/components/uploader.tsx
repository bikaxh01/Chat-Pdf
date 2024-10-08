"use client";
import { toast } from "sonner";
import { uploadToS3, getUrl } from "@/config/s3";
import { Loader2, UploadIcon } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { dataTagSymbol, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
function Uploader() {
  const [uploading, setUploading] = useState<boolean>(false);
  const router = useRouter()
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      fileName,
      file_key,
    }: {
      fileName: string;
      file_key: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        fileName,
        file_key,
      });

      return response.data;
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFile) => {
      const file = acceptedFile[0];

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size is too large");
        return;
      }
      try {
        setUploading(true);
        const data = await uploadToS3(file);

        if (!data?.fileName || !data.file_key) {
          toast.error("some thing went wrong...");
          return;
        }

        mutate(data, {
          onSuccess: (data) => {
            toast.success(data.message)
             router.push(`/chat/${data.chat_id}`)
          },
          onError: (error) => {
            toast.error("some thing went wrong...");
          },
        });
      } catch (error) {
        console.log("🚀 ~ onDrop: ~ error:", error);
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className=" h-44  border-2 cursor-pointer border-dashed bg-white rounded-lg flex justify-center items-center py-5 shadow-l  text-center"
    >
      <input {...getInputProps()} />

      {uploading || isPending ? (
        <Loader2 className=" h-10 w-10 text-blue-500 animate-spin" />
      ) : isDragActive ? (
        <>
          <UploadIcon />
          <p>Drop the files here ...</p>
        </>
      ) : (
        <div className=" flex flex-col items-center justify-center h-full">
          <UploadIcon className=" w-40 h-40 m-4" />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
      )}
    </div>
  );
}

export default Uploader;
