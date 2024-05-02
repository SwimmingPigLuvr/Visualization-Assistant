// src/routes/api/assistant/+server.ts
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({
//   apiKey: OPENAI_API_KEY
});

export async function POST() {
    try {
        const thread = await openai.beta.threads.create();
        
        return new Response(JSON.stringify(thread), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
        } else {
        }
    }
}
