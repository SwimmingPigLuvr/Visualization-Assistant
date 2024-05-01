import { json } from "@sveltejs/kit";
import OpenAi from "openai";
import { currentThread } from "$lib/stores.js";

const openai = new OpenAi();

export async function POST({ request }) {
    try {

        const requestBody = await request.json();
        const userMessage = requestBody.message;

        const stream = await openai.beta.threads.createAndRun({
            model: 'gpt-4-turbo',
            assistant_id: 'asst_VhJfolAsWeg19JwxVbYjHpqc',
            thread: {
                messages: [
                    userMessage
                ],
            },
            stream: true,
        });

        const events = [];
        for await (const event of stream) {
            events.push(event.data);
        }
        
        console.log('usermessage: ', userMessage);
        return json({ events });
    } catch (error) {
        let errorMessage = 'An unknown error occurred';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        return json({ error: errorMessage }, { status: 500 });
    }
}
    