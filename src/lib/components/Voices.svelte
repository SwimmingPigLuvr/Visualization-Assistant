<script lang="ts">
    import VoiceData from "./VoiceData.svelte";
    import type { Voice } from "$lib/types";
    import { v, showVoiceModal } from "$lib/stores";
    import { writable } from "svelte/store";
    import { fade, slide } from "svelte/transition";
    import { cubicInOut } from "svelte/easing";

    let voices: Voice[] = [
        {
            id: "Atp5cNFg1Wj5gyKD7HWV",
            name: "Natasha",
            imageURL: "/images/voices/natasha.png",
            audioPreviewURL: "/sounds/voice-previews/natasha.mp3",
        },
        {
            id: "7Uw4vgM4Qb1qiwwUnu15",
            name: "Sam",
            imageURL: "/images/voices/soothing-sam.png",
            audioPreviewURL: "/sounds/voice-previews/sam.mp3",
        },
        {
            id: "286VLndcKwmm1RxLQoOn",
            name: "Matthew",
            imageURL: "/images/voices/materializePath.png",
            audioPreviewURL: "/sounds/voice-previews/matthew.mp3",
        },
        {
            id: "aOcS60CY8CoaVaZfqqb5",
            name: "Bleakoff",
            imageURL: "/images/voices/bleakoffHandDox.png",
            audioPreviewURL: "/sounds/voice-previews/bleakoff.mp3",
        },
        {
            id: "FVQMzxJGPUBtfz1Azdoy",
            name: "Danielle",
            imageURL: "/images/voices/zoomer.png",
            audioPreviewURL: "/sounds/voice-previews/danielle.mp3",
        },
        {
            id: "4JVOFy4SLQs9my0OLhEw",
            name: "Luca",
            imageURL: "/images/voices/snow-leopard.png",
            audioPreviewURL: "/sounds/voice-previews/luca.mp3",
        },
    ];
</script>

<!-- voices -->
<div class="flex flex-col text-left w-full p-2">
    <!-- voice -->
    <button
        on:click={() => showVoiceModal.set(true)}
        class="p-2 px-4 rounded-xl hover:bg-white hover:bg-opacity-10 hover:border-white border-[1px] border-transparent flex justify-between items-center -tracking-widest text-xl text-left"
    >
        Voice

        <!-- current voice -->
        <div class="flex text-xl items-center space-x-4">
            <img
                class="h-10 w-10 rounded-full"
                src={voices[$v].imageURL}
                alt=""
            />
            <p>{voices[$v].name}</p>
        </div>
    </button>

    <!-- voice selection modal -->
    {#if $showVoiceModal}
        <!-- bg overlay -->
        <div
            class="bg-black bg-opacity-50 p-2 h-screen fixed w-full z-50 top-0 left-0 flex justify-center items-end"
        >
            <!-- modal -->
            <div
                class="flex bg-black flex-col p-2 w-full items-center justify-evenly overflow-x-auto"
            >
                <!-- header -->
                <div
                    class="mb-auto flex justify-between w-full items-center p-2 my-4"
                >
                    <p>Choose a voice</p>
                    <button on:click={() => showVoiceModal.set(false)} class=""
                        >X</button
                    >
                </div>
                <div class="flex space-x-4 my-4">
                    <!-- selected voice pfp -->
                    <img
                        src={voices[$v].imageURL}
                        alt="{voices[$v].name} pfp"
                        class="h-40 w-40 rounded-none mb-2"
                    />
                </div>

                <!-- voice options -->
                <div class="flex flex-col space-y-2 w-full my-6">
                    {#each voices as voice, index}
                        <button class="w-full">
                            <VoiceData {voice} i={index} />
                        </button>
                    {/each}
                </div>
            </div>
        </div>
    {/if}
</div>
