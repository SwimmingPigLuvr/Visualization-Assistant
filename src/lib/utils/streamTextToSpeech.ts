// utils/streamTextToSpeech.ts
import { browser } from '$app/environment';
import { globalAudioPlayer, audioSource, isLoading, isPlaying } from '$lib/stores';

export async function streamTextToSpeech(
    text: string, 
    voiceID: string, 
    index: number,
    retries: number = 3,
    backoff: number = 1000;
) {
    const plainText = stripHtmlTags(text);
    console.log("streamTextToSpeech function: ", plainText);
    if (!browser) return;
    
    isLoading.update(n => {
        n[index] = true;
        return n;
    });
    isPlaying.update(n => {
        n[index] = false;
        return n;
    });

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch('/api/xi-stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: plainText, voiceID }),
                timeout: backoff * attempt;
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

                    const audioBuffer = new Blob(audioChunks, { type: 'audio/mpeg' });
                    const url = URL.createObjectURL(audioBuffer);

                    audioSource.update(n => {
                        n[index] = url;
                        return n;
                    });

                    globalAudioPlayer.update(audioPlayer => {
                        audioPlayer.src = url;
                        audioPlayer.play();
                        return audioPlayer;
                    });

                    isPlaying.update(n => {
                        n[index] = true;
                        return n;
                    });

                    isLoading.update(n => {
                        n[index] = false;
                        return n;
                    });

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
                isLoading.update(n => {
                    n[index] = false;
                    return n;
                });
                console.error(
                    'Failed to convert text to speech after multiple attempts.',
                );
            }
        }
    }
}

// Function to strip HTML tags
function stripHtmlTags(inputText: string) {
    return inputText.replace(/<[^>]*>/g, "");
}

