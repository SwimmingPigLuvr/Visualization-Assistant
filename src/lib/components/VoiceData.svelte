<script lang="ts">
    import { currentVoiceID, v } from "$lib/stores";
    import type { Voice } from "$lib/types";
    import { writable } from "svelte/store";

    export let voice: Voice;
    export let i: number;

    let updatingVoice = false;
    let updateSuccess = true;

    let audio = writable<HTMLAudioElement>(new Audio());

    function updateVoiceID(idString: string) {
        console.log('calling update voice function with voiceID: ', idString);

        updatingVoice = true;

        currentVoiceID.set(idString);
        updateSuccess = true;

        setTimeout(() => {updateSuccess = false; updatingVoice = false}, 1000);
    }

    function playVoicePreview(audioURL: string) {
        audio.update(currentAudio => {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio.src = audioURL;
            currentAudio.play().catch(error => console.error('error playing audio: ', error));
            return currentAudio;
        });
    }


</script>



<button 
    on:mouseenter={() => v.set(i)}
    on:click={() => playVoicePreview(voice.audioPreviewURL)}
    class="flex flex-col space-y-2 transform transition-all duration-200 ease-in-out items-center justify-start opacity-50 hover:opacity-100 group" on:click={() => updateVoiceID(voice.id)}>
    <img class="bg-gradient-to-b from-lime-400 to-white h-24 max-w-24 rounded-full border-white border-[1px] group-hover:-translate-y-1 transform transition-all duration-1000 ease-in-out" src={voice.imageURL} alt="profile picture of ${voice.name}">
    <p class="font-serif -tracking-widest italic">{voice.name}</p>
</button>

