// src/routes/api/assistant/+server.ts
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({
//   apiKey: OPENAI_API_KEY
});

export async function POST() {
    try {
        const myThread = await openai.beta.threads.retrieve(
            'thread_xsnD9pNgMCIgHp7yIChR6dLO'
        );
        
        return new Response(JSON.stringify(myThread), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
        } else {
        }
    }
}