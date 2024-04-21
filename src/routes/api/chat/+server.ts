// src/routes/api/chat/+server.ts
import OpenAI from 'openai'
import { OPENAI_API_KEY } from '$env/static/private'
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
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        "role": "system",
        "content": "You are a visualization assistant who takes people's goals and crafts them into a potent, palpable visualization so that they can feel their future and see it in their imagination."
      },
    ],
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}


