// routes/api/xi-stream/+server.ts
import { XI_API_KEY } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { text, voiceID } = await request.json();
    if (!text || !voiceID) {
      return new Response(JSON.stringify({ error: 'Text or voiceID is missing' }), { status: 400 });
    }

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceID}/stream`;

    const headers = {
      "Accept": "audio/mpeg",
      "Content-Type": "application/json",
      "xi-api-key": XI_API_KEY
    };

    const data = {
      text,
      model_id: "eleven_monolingual_v1",
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to convert text to speech' }), { status: response.status });
    }

    const reader = response.body?.getReader();
    const chunks = [];
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
    }

    const audioBuffer = new Blob(chunks, { type: 'audio/mpeg' });
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};

