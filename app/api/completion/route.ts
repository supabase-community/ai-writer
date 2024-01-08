import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

export const runtime = "edge"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { prompt } = await req.json()

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "user",
        content: `You are a helpful text completion bot. Complete the current paragraph: ${prompt} Do not include the prompt. Refrain from restating the something that has already been stated. Output:\n`,
      },
    ],
    max_tokens: 50,
    temperature: 0.7,
    presence_penalty: 0.8, // A high presence penalty encourages the model to talk about new topics
    frequency_penalty: 0.6, // Frequency penalty encourages the model to avoid repeating the same words / phrases
  })

  const stream = OpenAIStream(response)

  return new StreamingTextResponse(stream)
}
