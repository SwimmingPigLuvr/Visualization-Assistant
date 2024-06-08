import { XI_API_KEY } from '$env/static/private';
import { ElevenLabsClient } from "elevenlabs";
import { createWriteStream, promises as fsPromises } from "fs";
import { v4 as uuid } from "uuid";
import type { RequestHandler } from '@sveltejs/kit';

// Initialize ElevenLabs client
const client = new ElevenLabsClient({
  apiKey: XI_API_KEY,
});

// Function to create audio file from text
const createAudioFileFromText = async (text: string, voiceID: string): Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const audio = await client.generate({
        voice: voiceID,
        model_id: "eleven_turbo_v2",
        text,
      });
      const fileName = `${uuid()}.mp3`;
      const fileStream = createWriteStream(`/tmp/${fileName}`); // Save file in a temporary directory

      audio.pipe(fileStream);
      fileStream.on("finish", () => resolve(fileName)); // Resolve with the fileName
      fileStream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { text, voiceID } = await request.json();
    console.log('Received request to /api/speech-file. VoiceID:', voiceID, 'Text:', text);

    const fileName = await createAudioFileFromText(text, voiceID);
    const filePath = `/tmp/${fileName}`;

    const fileBuffer = await fsPromises.readFile(filePath);

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    });
  } catch (error) {
    console.error('Error in /api/speech-file handler:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};

