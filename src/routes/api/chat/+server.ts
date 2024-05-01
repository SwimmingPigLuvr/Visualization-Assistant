// src/routes/api/chat/+server.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

export const config = {
  runtime: 'edge'
};

export async function POST({ request }) {
  const { messages } = await request.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    stream: true,
    messages: messages || [
      {
        "role": "system",
        "content": "say 'no message received'."
      },
    ],
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}


