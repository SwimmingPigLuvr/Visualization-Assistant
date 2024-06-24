import OpenAi from "openai";
const openai = new OpenAi();

export async function POST({ request }) {
    try {
        const { threadID, newName } = await request.json();
        // OpenAI doesn't have a direct method to rename threads, so we'll update the first message
        const messages = await openai.beta.threads.messages.list(threadID);
        const firstMessage = messages.data[0];
        await openai.beta.threads.messages.update(threadID, firstMessage.id, {
            content: newName
        });
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to rename thread' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
