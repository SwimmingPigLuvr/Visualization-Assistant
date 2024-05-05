// src/routes/api/elevenlabs/+server.ts
import { XI_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import fetch from 'node-fetch';
import type { RequestHandler } from '@sveltejs/kit';
import { currentVoiceID } from '$lib/stores';

export const POST: RequestHandler = async ({ request }) => {
  const { text, voiceID } = await request.json();
  console.log('howdy from api/speech/+server.ts. voiceID: ', voiceID);

  // ElevenLabs API URL with voice ID path parameter
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceID}/stream`;
  console.log('url: ', url);

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
    throw new Error(`ElevenLabs API responded with status ${response.status}`);
  }

  const buffer = await response.arrayBuffer();

  return new Response(buffer, {
    headers: {
      'Content-Type': 'audio/mpeg'
    }
  });
};
