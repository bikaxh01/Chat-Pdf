import { prisma_client } from "@/config/prisma"
import { ReceiptIndianRupee } from "lucide-react"

export async function POST (req:Request){

    const {chat_Id} = await req.json()

    if(!chat_Id){
        return Response.json("Invalid User id",{
            status:400
        })
    }

    const getMessages  = await prisma_client.message.findMany({
        where:{
            chat_Id:chat_Id
        }
    })
    

    return Response.json(getMessages)


}