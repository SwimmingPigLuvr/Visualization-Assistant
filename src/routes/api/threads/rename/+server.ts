import OpenAi from "openai";
const openai = new OpenAi();

export async function POST({ request }) {
    try {
        const { threadID, newName } = await request.json();
        // OpenAI doesn't have a direct method to rename threads
        // We'll just return success and handle the renaming in the frontend/database
        return new Response(JSON.stringify({ success: true, threadID, newName }), {
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
