<script lang="ts">
    import { currentVoiceID } from "$lib/stores";
    import type { Voice } from "$lib/stores";
    import { writable } from "svelte/store";

    export let voice: Voice;

    let updatingVoice = false;
    let updateSuccess = writable(false);

    function updateVoiceID(idString: string) {
        updatingVoice = true;

        currentVoiceID.set(idString);

        updateSuccess.set(true);

        console.log('updated Voice:');
        console.log('VoiceID: ', idString);
        console.log('Name: ', voice.name);
        console.log('ImageURL: ', voice.imageURL);

        setTimeout(() => {updateSuccess.set(false);}, 1000);
    }

</script>

    <button class="transform transition-all duration-500 ease-in-out items-center justify-center opacity-50 hover:opacity-100 group" on:click={() => updateVoiceID(voice.id)}>
        {#if !updateSuccess}
            <div class="rounded-full border-white border-2 w-20 h-20 flex items-center justify-center">
                <span class="text-5xl">✔️</span>
            </div>
        {:else}
            <img class="h-20 rounded-full border-white border-2 mx-auto group-hover:-translate-y-1 transform transition-all duration-1000 ease-in-out" src={voice.imageURL} alt="">
        {/if}
        <p class="font-serif -tracking-widest italic">{voice.name}</p>
    </button>

