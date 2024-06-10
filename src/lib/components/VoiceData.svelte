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

        // pause if exists and !== the new one
        if (currentAudioElement && currentAudioElement.src !== audioURL) {
            currentAudioElement.pause();
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

        // update store
        currentAudio.set(audio);
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
        : 'opacity-20 hover:opacity-50'} group"
    on:click={() => updateVoiceID(voice.id)}
>
    <p class="font-serif text-3xl -tracking-widest italic">{voice.name}</p>
</button>
