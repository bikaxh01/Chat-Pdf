import {Configuration,OpenAIApi} from 'openai-edge'
import {OpenAIStream,StreamTextResult,Message} from 'ai'
const config = new Configuration({
    apiKey:process.env.NEXT_PUBLIC_OPEN_AI_API_KEY
})

const openai = new OpenAIApi(config)

export async function POST(req:Request) {
    try {
        const {messages} = await req.json()
        const response = await openai.createChatCompletion({
            model:"gpt-4o",
            messages,
            stream:true
        })
        

    } catch (error) {
        
    }
}