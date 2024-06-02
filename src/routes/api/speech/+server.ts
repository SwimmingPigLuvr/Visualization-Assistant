// src/routes/api/speech/+server.ts
import { XI_API_KEY } from '$env/static/private';
import fetch from 'node-fetch';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { text, voiceID } = await request.json();
    console.log('Received request to /api/speech. VoiceID:', voiceID, 'Text:', text);

    // ElevenLabs API URL with voice ID path parameter
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceID}/stream`;
    console.log('ElevenLabs API URL:', url);

    const headers = {
      "Accept": "audio/mpeg",
      "Content-Type": "application/json",
      "xi-api-key": XI_API_KEY
    };

    const data = {
      text: text,
      model_id: "eleven_monolingual_v1",
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      console.error('Error response from ElevenLabs API:', response.status, response.statusText);
      return new Response(JSON.stringify({ error: 'Failed to convert text to speech' }), { status: response.status });
    }

    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg'
      }
    });
  } catch (error) {
    console.error('Error in /api/speech handler:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
