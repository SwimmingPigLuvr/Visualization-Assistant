// utils/streamTextToSpeech.ts
import { audioSource, isLoading, isPlaying } from '$lib/stores';

function initArray<T>(array: T[], length: number, defaultValue: T): T[] {
    for (let i = 0; i < length; i++) {
        if (array[i] === undefined) {
            array[i] = defaultValue;
        }
    }
    return array;
}

export async function streamTextToSpeech(
    text: string, 
    voiceID: string, 
    index: number,
    retries: number = 3,
) {
    const plainText = stripHtmlTags(text);
    console.log("streamTextToSpeech function: ", plainText);
    if (!browser) return;
    
    // init arrays
    isLoading.update(n => initArray(n, index + 1, false));
    isPlaying.update(n => initArray(n, index + 1, false));
    audioSource.update(n => initArray(n, index + 1, ''));

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

