<script lang="ts">
    import { currentVoiceID } from "$lib/stores";
    import type { Voice } from "$lib/stores";
    import { writable } from "svelte/store";

    export let voice: Voice;

    let updatingVoice = false;
    let updateSuccess = true;

    function updateVoiceID(idString: string) {
        console.log('calling update voice function with voiceID: ', idString);

        updatingVoice = true;

        currentVoiceID.set(idString);
        updateSuccess = true;

        setTimeout(() => {updateSuccess = false; updatingVoice = false}, 1000);
    }

</script>

    <button class="transform transition-all duration-500 ease-in-out items-center justify-center opacity-50 hover:opacity-100 group" on:click={() => updateVoiceID(voice.id)}>
        <img class="bg-gradient-to-b from-lime-400 to-white h-24 max-w-24 rounded-full border-white border-2 mx-auto group-hover:-translate-y-1 transform transition-all duration-1000 ease-in-out" src={voice.imageURL} alt="">
        <p class="font-serif -tracking-widest italic">{voice.name}</p>
    </button>

