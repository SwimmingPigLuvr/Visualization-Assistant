// routes/api/threads/delete/+server.ts
import OpenAi from "openai";

const openai = new OpenAi();

export async function DELETE({ request }) {
    try {

        const requestBody = await request.json();
        const threadID = requestBody.threadID;

        const deletedThread = await openai.beta.threads.del(threadID);

        return new Response(JSON.stringify(deletedThread), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
        } else {
        }
    }
}
