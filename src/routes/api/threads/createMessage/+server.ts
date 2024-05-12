import { currentThread } from "$lib/stores.js";
import { json } from "@sveltejs/kit";
import OpenAI from "openai";
import { get } from "svelte/store";

const myThread = get(currentThread);

const openai = new OpenAI();

export async function POST({ request }) {
    try {
        const requestBody = await request.json();
        const userMessage = requestBody?.message?.content;
        const threadID = requestBody?.threadID;

        if (!threadID) {
            return json({ error: 'threadid required' }, { status: 400 });
        }
    
        const threadMessage = await openai.beta.threads.messages.create(
            threadID,
            { 
                role: "user", 
                content: userMessage 
            }
        );

        return json(threadMessage);
      
    } catch (error) {

        console.error('whoops... ', error);

        return json({ error: 'An error occurred' }, { status: 500 });
    }
}
