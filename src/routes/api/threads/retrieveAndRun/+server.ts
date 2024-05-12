// api/threads/retrieve/+server.ts
import { currentThread } from "$lib/stores.js";
import { json } from "@sveltejs/kit";
import OpenAi from "openai";
import { get } from "svelte/store";

const thread = get(currentThread);

const openai = new OpenAi();

export async function POST() {
  try {


    const myThread = await openai.beta.threads.retrieve(
        thread
    );

    console.log('mythread:', myThread);
    return json(myThread)
  } catch (error) {
    console.error('whoops... ', error);
    return json({ error: 'An error occurred' }, { status: 500 });
  }
}