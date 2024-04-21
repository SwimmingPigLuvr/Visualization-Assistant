<script lang="ts">
    import { browser } from "$app/environment";
    import { voiceID } from "$lib/stores";
    import { writable } from "svelte/store";

    export let message: string;

    const audioSource = writable('');
    const isPlaying = writable(false);
    const isLoading = writable(false);
    let audioPlayer: HTMLAudioElement;

    export async function readText(text: string) {
        console.log('hope this works');
        console.log('using voiceID: ', $voiceID);
        if (!browser) return; // Ensure this runs only in the browser

        isLoading.set(true);
        isPlaying.set(false);

        const response = await fetch('/api/speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text }) // Send the text to your SvelteKit endpoint
        });

        isLoading.set(false);

        if (response.ok) {
            // Create a blob from the response and set it as the source for an audio element
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            audioSource.set(url);
            isPlaying.set(true);
        } else {
            console.error('Failed to convert text to speech:', response.statusText);
        }
    }

    function togglePlayBack() {
        if ($isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play();
        }
        isPlaying.set(!$isPlaying); // Toggle playback state
    }

    function resumeAudio() {
        if ($audioSource) {
            audioPlayer.play();
            isPlaying.set(true);
        }
    }
</script>

<div>
    {#if $isLoading}
        <!-- Loading indicator -->
        <div class="animate-spin">💿</div>
    {:else if $isPlaying}
        <!-- Pause button -->
        <button on:click={togglePlayBack} class="">
            ⏸️
        </button>
    {:else if $audioSource}
        <!-- Resume button if audio is loaded but not playing -->
        <button on:click={resumeAudio} class="">
            🗣️
        </button>
    {:else}
        <!-- Read text button if audio hasn't been loaded -->
        <button on:click={() => readText(message)} class="opacity-50 hover:opacity-100">
            🗣️
        </button>
    {/if}
</div>

{#if $audioSource}
    <audio bind:this={audioPlayer} src={$audioSource} on:play={() => isPlaying.set(true)} on:pause={() => isPlaying.set(false)} autoplay />
{/if}
