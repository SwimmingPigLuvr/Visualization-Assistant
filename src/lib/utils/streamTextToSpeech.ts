// utils/streamTextToSpeech.ts
import { audioSource, isLoading, isPlaying } from '$lib/stores';

export async function streamTextToSpeech(text: string, voiceID: string, retries: number = 3): Promise<void> {
  const plainText = stripHtmlTags(text);
  if (!text || !voiceID) throw new Error('Text or voiceID is missing');

  isLoading.set(true);
  isPlaying.set(false);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch('/api/xi-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: plainText, voiceID }),
      });

      if (!response.ok) throw new Error(`Failed: ${response.statusText}`);

      const reader = response.body?.getReader();
      const stream = new ReadableStream({
        start(controller) {
          function push() {
            reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              push();
            });
          }

          push();
        }
      });

      const audioURL = URL.createObjectURL(new Blob([stream], { type: 'audio/mpeg' }));
      audioSource.set(audioURL);
      isPlaying.set(true);
      isLoading.set(false);
      return;

    } catch (error) {
      if (attempt >= retries) {
        isLoading.set(false);
        throw error;
      }
      await new Promise(res => setTimeout(res, 1000));
    }
  }
}

function stripHtmlTags(inputText: string): string {
  return inputText.replace(/<[^>]*>/g, "");
}

