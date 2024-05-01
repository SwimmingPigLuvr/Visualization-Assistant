// src/routes/api/assistant/+server.ts
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({
//   apiKey: OPENAI_API_KEY
});

export async function POST({ request }) {
    try {
        const requestBody = await request.json();
        const threadID = requestBody.threadID;


        const threadMessages = await openai.beta.threads.messages.list(threadID);

        
        return new Response(JSON.stringify(threadMessages), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: unknown) {
        console.error("Server error:", error);
        // Return a structured JSON error message
        return new Response(JSON.stringify({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'An unknown error occurred'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
    }
}