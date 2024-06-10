import axios from 'axios';
import { browser } from '$app/environment';
import { currentAudio, isLoading, isPlaying, audioSource } from '$lib/stores';

async function streamTextToSpeech(
    text: string,
    voiceID: string,
    retries: number = 3,
) {
    const plainText = stripHtmlTags(text);
    console.log("streamTextToSpeech function: ", plainText);
    // listenToolTip = false;
    if (!browser) return;

    isLoading.set(true);
    isPlaying.set(false);

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch('/api/xi-stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: plainText, voiceID }),
            });

            if (response.ok) {
                const reader = response.body?.getReader();
                const audioChunks = [];

                if (reader) {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        audioChunks.push(value);
                    }

                    const audioBuffer = new Blob(audioChunks);
                    const url = URL.createObjectURL(audioBuffer);
                    audioSource.set(url);
                    isPlaying.set(true);
                    isLoading.set(false);
                    return;
                }
            } else {
                console.error(
                    'Failed to convert text to speech:',
                    response.statusText,
                );
            }
        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);
            if (attempt < retries) {
                console.log(`Retrying... (${attempt}/${retries})`);
                await new Promise((res) => setTimeout(res, 1000));
            } else {
                isLoading.set(false);
                console.error(
                    'Failed to convert text to speech after multiple attempts.',
                );
            }
        }
    }
}

// Function to strip HTML tags
function stripHtmlTags(inputText) {
    return inputText.replace(/<[^>]*>/g, "");
}

export { streamTextToSpeech };
