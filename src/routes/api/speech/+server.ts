// src/routes/api/elevenlabs/+server.ts
import { XI_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import fetch from 'node-fetch';
import type { RequestHandler } from '@sveltejs/kit';
import { voiceID } from '$lib/stores';
import { get as getStoreValue } from 'svelte/store';

export const POST: RequestHandler = async ({ request }) => {
  console.log('umm voice id: ', voiceID);
  const currentVoiceID = getStoreValue(voiceID); 
  console.log('currentVoiceID: ', currentVoiceID);
  const { text } = await request.json();

  // ElevenLabs API URL with voice ID path parameter
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${currentVoiceID}/stream`;

  const headers = {
    "Accept": "audio/mpeg",
    "Content-Type": "application/json",
    "xi-api-key": XI_API_KEY
  };

  const data = {
    text: text,
    model_id: "eleven_monolingual_v1",
    // Add other parameters as per ElevenLabs' API documentation
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
