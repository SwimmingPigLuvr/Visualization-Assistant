<script lang="ts">
    import {
        currentVoiceID,
        v,
        currentAudio,
        showVoiceModal,
    } from "$lib/stores";
    import type { Voice } from "$lib/types";
    import { onDestroy } from "svelte";
    import { get } from "svelte/store";

    import { isMenuOpen } from "$lib/stores";
    import { slide } from "svelte/transition";
    import { onMount } from "svelte";

    let audio = new Audio();

    function updateVoiceID(idString: string) {
        console.log("calling update voice function with voiceID: ", idString);
        currentVoiceID.set(idString);
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

    // Close dropdown when clicking outside
    onMount(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element | null;
            if (
                target &&
                !target.closest(".voice-dropdown-container") &&
                $showVoiceModal
            ) {
                showVoiceModal.set(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    });
</script>

<!-- voices -->
<div class="flex flex-col text-left w-full voice-dropdown-container relative">
    <!-- voice -->
    <button
        on:click={() => showVoiceModal.set(!$showVoiceModal)}
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
            <p class="font-serif italic -tracking-widest">{voices[$v].name}</p>
        </div>
    </button>

    <!-- voice selection dropdown -->
    {#if $showVoiceModal}
        <div
            in:slide={{ duration: 200, axis: "y" }}
            out:slide={{ duration: 150, axis: "y" }}
            class="absolute top-full left-0 mt-2 w-full bg-blue-800 border-white border-[1px] rounded-xl shadow-lg z-50 overflow-hidden"
        >
            <!-- header -->
            <div class="px-4 py-3 border-b border-white border-opacity-20">
                <p class="text-center text-white font-medium">Choose a voice</p>
            </div>

            <!-- current voice preview -->
            <div
                class="px-4 py-3 border-b border-white border-opacity-20 bg-blue-900 bg-opacity-50"
            >
                <div class="flex items-center space-x-3">
                    <img
                        src={voices[$v].imageURL}
                        alt="{voices[$v].name} avatar"
                        class="h-12 w-12 rounded-full"
                    />
                    <div>
                        <p class="text-white font-medium">{voices[$v].name}</p>
                        <p class="text-blue-200 text-sm">Current voice</p>
                    </div>
                </div>
            </div>

            <!-- voice options -->
            <div class="max-h-64 overflow-y-auto">
                {#each voices as voice, index}
                    <div
                        class="border-b border-white border-opacity-10 last:border-b-0"
                    >
                        <button
                            on:click={() => {
                                v.set(index);
                                updateVoiceID(voice.id);
                            }}
                            class="flex justify-between text-left pl-2 w-full items-center {$currentVoiceID ===
                            voice.id
                                ? 'opacity-100'
                                : 'opacity-25 hover:opacity-75'} group"
                        >
                            <div class="flex space-x-2">
                                <button
                                    on:click={() =>
                                        playVoicePreview(voice.audioPreviewURL)}
                                    >🎧</button
                                >
                                <p
                                    class="font-serif text-3xl -tracking-widest italic"
                                >
                                    {voice.name}
                                </p>
                            </div>
                            <img src={voice.imageURL} class="h-10" alt="" />
                        </button>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>
