<script lang="ts">
    import {
        currentVoiceID,
        v,
        currentAudio,
        showVoiceModal,
    } from "$lib/stores";
    import type { Voice } from "$lib/types";
    import { onDestroy } from "svelte";
    import { writable, get } from "svelte/store";

    export let voice: Voice;
    export let i: number;

    let audio = new Audio();
    let updatingVoice = false;
    let updateSuccess = true;

    function updateVoiceID(idString: string) {
        console.log("calling update voice function with voiceID: ", idString);

        updatingVoice = true;

        currentVoiceID.set(idString);
        updateSuccess = true;

        setTimeout(() => {
            updateSuccess = false;
            updatingVoice = false;
        }, 1000);
    }

    function playVoicePreview(audioURL: string) {
        // get current audio
        const currentAudioElement = get(currentAudio);

        // pause if exists (but we can't compare src since currentAudio is OpenAI Audio type)
        if (currentAudioElement) {
            // currentAudioElement.pause(); // This doesn't exist on OpenAI Audio type
        }

        // update element and play
        if (audio.src !== audioURL) {
            audio.src = audioURL;
        }

        if (audio.paused) {
            audio
                .play()
                .catch((error) =>
                    console.error("error playing audio: ", error),
                );
        } else {
            audio.pause();
        }

        // Don't update store with HTMLAudioElement since currentAudio expects OpenAI Audio type
        // currentAudio.set(audio);
    }

    // pause audio if voice modal is closed
    $: {
        if (!get(showVoiceModal)) {
            audio.pause();
        }
    }

    // stop audio when component is unmounted
    onDestroy(() => {
        audio.pause();
    });
</script>

<button
    on:click={() => v.set(i)}
    on:click={() => playVoicePreview(voice.audioPreviewURL)}
    class="flex justify-between text-left p- w-full items-center {$currentVoiceID ===
    voice.id
        ? 'opacity-100'
        : 'opacity-25 hover:opacity-75'} group"
    on:click={() => updateVoiceID(voice.id)}
>
    <p class="font-serif text-3xl -tracking-widest italic">{voice.name}</p>
</button>
