import { json } from "@sveltejs/kit";
import OpenAi from "openai";

const openai = new OpenAi();

export async function POST({ request }) {
  try {
    const requestBody = await request.json();
    const threadID = requestBody.threadID;
    const instructions = requestBody.instructions;

    const stream = await openai.beta.threads.runs.create(threadID, { 
      assistant_id: 'asst_VhJfolAsWeg19JwxVbYjHpqc', 
      instructions: instructions,
      stream: true 
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          const chunk = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(new TextEncoder().encode(chunk));
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('whoops... ', error);
    return json({ error: 'An error occurred' }, { status: 500 });
  }
}