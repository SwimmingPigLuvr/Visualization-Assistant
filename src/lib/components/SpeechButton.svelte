<script lang="ts">
    import { browser } from "$app/environment";
    import { currentVoiceID } from "$lib/stores";
    import { get, writable } from "svelte/store";

    export let message: string;

    let listenToolTip = false;
    let pauseTooltip = false;

    const audioSource = writable('');
    const isPlaying = writable(false);
    const isLoading = writable(false);
    let audioPlayer: HTMLAudioElement;

    async function readText(text: string) {
        if (!browser) return; // Ensure this runs only in the browser

        isLoading.set(true);
        isPlaying.set(false);

        const voiceID = get(currentVoiceID);

        const response = await fetch('/api/speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, voiceID })
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
        <button 
            on:mouseenter={() => pauseTooltip = true}
            on:mouseleave={() => pauseTooltip = false}
            on:click={togglePlayBack} 
            class="relative">
            {#if pauseTooltip}
                    <span class="text-sm absolute left-1/2 top-0 -translate-x-1/2 tooltip rounded shadow-lg p-1 bg-black text-slate-400 mt-8">pause</span>
            {/if}
            ⏸️
        </button>
    {:else if $audioSource}
        <!-- Resume button if audio is loaded but not playing -->
        <button 
            on:mouseenter={() => listenToolTip = true}
            on:mouseleave={() => listenToolTip = false}
            on:click={resumeAudio} 
            class="relative">
                {#if listenToolTip}
                    <span class="text-sm absolute left-1/2 top-0 -translate-x-1/2 tooltip rounded shadow-lg p-1 bg-black text-slate-400 mt-8">listen</span>
                {/if}
            🎧
        </button>
    {:else}
        <!-- Read text button if audio hasn't been loaded -->
        <button 
            on:mouseenter={() => listenToolTip = true}
            on:mouseleave={() => listenToolTip = false}
            on:click={() => readText(message)} 
            class="relative">
                {#if listenToolTip}
                    <span class="text-sm absolute left-1/2 top-0 -translate-x-1/2 tooltip rounded shadow-lg p-1 bg-black text-slate-400 mt-8">listen</span>
                {/if}
            🎧
        </button>
    {/if}
</div>

{#if $audioSource}
    <audio bind:this={audioPlayer} src={$audioSource} on:play={() => isPlaying.set(true)} on:pause={() => isPlaying.set(false)} autoplay />
{/if}
