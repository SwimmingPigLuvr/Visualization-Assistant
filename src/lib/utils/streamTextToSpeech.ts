// utils/streamTextToSpeech.ts
import { browser } from '$app/environment';
import { globalAudioPlayer, audioSource, isLoading, isPlaying } from '$lib/stores';

export async function streamTextToSpeech(
    text: string, 
    voiceID: string, 
    index: number
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
        console.error('Failed to convert text to speech:', error);
        isLoading.update(n => {
            n[index] = false;
            return n;
        });
    }
}

// Function to strip HTML tags
function stripHtmlTags(inputText: string) {
    return inputText.replace(/<[^>]*>/g, "");
}
