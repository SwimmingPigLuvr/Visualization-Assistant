// routes/api/xi-stream/+server.ts
import { XI_API_KEY } from '$env/static/private';
import axios from 'axios';
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

    console.log('Sending request to ElevenLabs with data:', data);


    const response = await axios({
      method: 'post',
      url: url,
      headers: headers,
      data: data,
      responseType: 'stream'
    });

    console.log('Received response from ElevenLabs', response.status);


    // Pipe the response data stream to the response
    response.data.pipe(res);
  } catch (error) {
    console.error('Error in /api/speech handler:', error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const statusText = error.response?.statusText || 'Internal Server Error';
      return new Response(JSON.stringify({ error: statusText }), { status });
    }
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};


