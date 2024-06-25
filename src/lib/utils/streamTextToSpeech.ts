// utils/streamTextToSpeech.ts
import { browser } from '$app/environment';
import { globalAudioPlayer, audioSource, isLoading, isPlaying } from '$lib/stores';

const MAX_CHUNK_LENGTH = 1000; // Adjust this value as needed

export async function streamTextToSpeech(
    text: string, 
    voiceID: string, 
    index: number
) {
    const plainText = stripHtmlTags(text);
    console.log("streamTextToSpeech function: ", plainText);
    if (!browser) return;

    audioSource.update(n => {
        n[index] = "";
        return n;
    });
    
    isLoading.update(n => {
        n[index] = true;
        return n;
    });
    isPlaying.update(n => {
        n[index] = false;
        return n;
    });

    try {
        const chunks = chunkText(plainText, MAX_CHUNK_LENGTH);
        const audioChunks = [];

        for (const chunk of chunks) {
            const response = await fetch('/api/xi-stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: chunk, voiceID }),
            });

            if (response.ok) {
                const blob = await response.blob();
                audioChunks.push(blob);
            } else {
                throw new Error(`Failed to convert text to speech: ${response.statusText}`);
            }
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
    } catch (error) {
        console.error('Failed to convert text to speech:', error);
    } finally {
        isLoading.update(n => {
            n[index] = false;
            return n;
        });
    }
}

function chunkText(text: string, maxLength: number): string[] {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
        let end = start + maxLength;
        if (end > text.length) end = text.length;
        else {
            // Find the last space within the chunk
            while (end > start && text[end] !== ' ') {
                end--;
            }
            if (end === start) end = start + maxLength; // If no space found, just cut at maxLength
        }
        chunks.push(text.slice(start, end).trim());
        start = end;
    }
    return chunks;
}

// Function to strip HTML tags (unchanged)
function stripHtmlTags(inputText: string) {
    return inputText.replace(/<[^>]*>/g, "");
}
