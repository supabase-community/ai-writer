import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

export const runtime = "edge"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { prompt } = await req.json()

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    // a precise prompt is important for the AI to reply with the correct tokens
    messages: [
      {
        role: "user",
        content: `You are a helpful title suggestion bot. Suggest a title for the following text: ${prompt} Title: `,
      },
    ],
    max_tokens: 30,
    temperature: 0.4,
  })

  const stream = OpenAIStream(response)

  return new StreamingTextResponse(stream)
}
