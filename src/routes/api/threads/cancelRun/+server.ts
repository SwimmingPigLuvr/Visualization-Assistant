import { json } from "@sveltejs/kit";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST({ request }) {
    const requestBody = await request.json();
    const threadID = requestBody.threadID;
    const runID = requestBody.runID;
    
    try {
        const run = await openai.beta.threads.runs.cancel(
            threadID,
            runID
        );

        return json({ success: true, run });
    } catch (error) {
        console.error('whoops... ', error);
        return json({ error: 'An error occurred' }, { status: 500 });
    }
}