import OpenAi from "openai";

const openai = new OpenAi();

export async function DELETE({ request }) {
    try {

        const requestBody = await request.json();
        const threadID = requestBody.threadID;

        const deletedThread = await openai.beta.threads.del(threadID);

        console.log(deletedThread);
        return new Response(JSON.stringify(deletedThread), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message); // Now TypeScript knows error is an Error object
        } else {
            console.log('An unknown error occurred');
        }
    }
}