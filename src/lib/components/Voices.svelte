<script lang="ts">
    import VoiceData from "./VoiceData.svelte";
    import type { Voice } from "$lib/types";
    import { v, showVoiceModal, isMenuOpen } from "$lib/stores";
    import { writable } from "svelte/store";
    import { fade, slide } from "svelte/transition";
    import { cubicInOut } from "svelte/easing";

    let voices: Voice[] = [
        {
            id: "7Uw4vgM4Qb1qiwwUnu15",
            name: "Sam",
            imageURL: "/images/voices/sam.png",
            audioPreviewURL: "/sounds/voice-previews/sam.mp3",
        },
        {
            id: "286VLndcKwmm1RxLQoOn",
            name: "Matthew",
            imageURL: "/images/voices/matthew.png",
            audioPreviewURL: "/sounds/voice-previews/matthew.mp3",
        },
        {
            id: "FVQMzxJGPUBtfz1Azdoy",
            name: "Danielle",
            imageURL: "/images/voices/danielle.png",
            audioPreviewURL: "/sounds/voice-previews/danielle.mp3",
        },
        {
            id: "4JVOFy4SLQs9my0OLhEw",
            name: "Luca",
            imageURL: "/images/voices/luca.png",
            audioPreviewURL: "/sounds/voice-previews/luca.mp3",
        },
    ];

    $: if (!$isMenuOpen) {
        showVoiceModal.set(false);
    }
</script>

<!-- voices -->
<div class="flex flex-col text-left w-full">
    <!-- voice -->
    <button
        on:click={() => showVoiceModal.set(true)}
        class="p-2 px-4 rounded-xl hover:bg-white hover:bg-opacity-10 hover:border-white border-[1px] border-transparent flex justify-between items-center text-xl text-left"
    >
        Voice

        <!-- current voice -->
        <div class="flex text-xl items-center space-x-2">
            <img
                class="h-8 w-8 rounded-full"
                src={voices[$v].imageURL}
                alt=""
            />
            <p>{voices[$v].name}</p>
        </div>
    </button>

    <!-- voice selection modal -->
    {#if $showVoiceModal}
        <!-- bg overlay -->
        <button
            in:fade={{ duration: 250 }}
            on:click={() => showVoiceModal.set(false)}
            class="bg-black bg-opacity-50 backdrop-blur p-2 h-screen fixed w-full z-50 top-0 left-0 flex justify-center items-center"
        >
            <!-- modal -->
            <button
                in:slide={{ duration: 250 }}
                on:click|stopPropagation
                class="rounded-none flex border-white border-[1px] bg-blue-800 flex-col p-4 w-full items-center justify-evenly overflow-x-auto"
            >
                <!-- header -->
                <div class="mb-auto flex justify-between w-full items-center">
                    <p class="text-center">Choose a voice</p>
                    <button
                        on:click={() => showVoiceModal.set(false)}
                        class="rounded-none border-white border-[1px] px-3 hover:bg-rose-500 hover:bg-opacity-50 p-1"
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
            </button>
        </button>
    {/if}
</div>
