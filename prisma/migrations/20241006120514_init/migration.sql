-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'SYSTEM');

-- CreateTable
CREATE TABLE "chat" (
    "id" TEXT NOT NULL,
    "pdf_Name" TEXT NOT NULL,
    "pdf_Url" TEXT NOT NULL,
    "user_Id" TEXT NOT NULL,
    "file_Key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" TEXT NOT NULL,
    "chat_Id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_chat_Id_fkey" FOREIGN KEY ("chat_Id") REFERENCES "chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
