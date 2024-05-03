import OpenAI from "openai";

const openai = new OpenAI({

});

export async function DELETE({ params }) {
    const { threadID, runID } = params;
    try {
        await openai.beta.threads.runs.cancel( threadID, runID);
        console.log('run canceled');
        return new Response(null, { status: 200 });

    } catch (error) {
        console.log('failed to cancel run', error);
        return new Response(null, { status: 500 });
    }
}