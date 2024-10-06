"use client";
import { toast } from "sonner";
import { uploadToS3, getUrl } from "@/config/s3";
import { PlusIcon, UploadIcon } from "lucide-react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
function Uploader() {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFile) => {
      console.log(acceptedFile);
      const file = acceptedFile[0];

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size is too big");
        return;
      }
      try {
        const response = await uploadToS3(file);

        console.log("🚀 ~ onDrop: ~ response:", response);
         
      } catch (error) {
      console.log("🚀 ~ onDrop: ~ error:", error)
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className=" h-44  border-2 cursor-pointer border-dashed bg-white rounded-lg flex justify-center items-center py-5 shadow-l  text-center"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
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
