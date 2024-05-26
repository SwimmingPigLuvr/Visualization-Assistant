<script lang="ts">
    import VoiceData from "./VoiceData.svelte";
    import type { Voice } from "$lib/types";
    import { v } from "$lib/stores";
    import { writable } from "svelte/store";
    import { slide } from "svelte/transition";
    import { cubicInOut } from "svelte/easing";

    let voices: Voice[] = [
        {
            id: 'Atp5cNFg1Wj5gyKD7HWV',
            name: 'Natasha',
            imageURL: '/images/voices/natasha.png',
            audioPreviewURL: '/sounds/voice-previews/natasha.mp3'
        },
        {
            id: '7Uw4vgM4Qb1qiwwUnu15',
            name: 'Sam',
            imageURL: '/images/voices/soothing-sam.png',
            audioPreviewURL: '/sounds/voice-previews/sam.mp3'
        },
        {
            id: '286VLndcKwmm1RxLQoOn',
            name: 'Matthew',
            imageURL: '/images/voices/materializePath.png',
            audioPreviewURL: '/sounds/voice-previews/matthew.mp3'
        },
        {
            id: 'aOcS60CY8CoaVaZfqqb5',
            name: 'Bleakoff',
            imageURL: '/images/voices/bleakoffHandDox.png',
            audioPreviewURL: '/sounds/voice-previews/bleakoff.mp3'
        },
        {
            id: 'FVQMzxJGPUBtfz1Azdoy',
            name: 'Danielle',
            imageURL: '/images/voices/zoomer.png',
            audioPreviewURL: '/sounds/voice-previews/danielle.mp3'
        },
        {
            id: '4JVOFy4SLQs9my0OLhEw',
            name: 'Luca',
            imageURL: '/images/voices/snow-leopard.png',
            audioPreviewURL: '/sounds/voice-previews/luca.mp3'
        },
    ];

    let audio = new Audio();
    let currentAudio = writable('');

    function playVoicePreview(audioURL: string) {
        // Check if the same audio is already playing
        currentAudio.update(url => {
            if (url !== audioURL) {
                audio.pause();
                audio.src = audioURL;
                audio.play().catch(error => console.error('Error playing audio:', error));
            } else {
                if (audio.paused) {
                    audio.play().catch(error => console.error('Error resuming audio:', error));
                } else {
                    audio.pause();
                }
            }
            return audioURL;
        });
    }




</script>

<!-- voices -->
                <div
                    class="flex flex-col text-left w-full p-2">


                    <!-- voice -->
                    <button 
                        class="-tracking-widest text-xl text-left">
                        Voice

                        <!-- voice settings -->
                        <div class="p-2 flex items-center space-x-4">
                            <img class="w-auto h-14 my-4  rounded" src={voices[$v].imageURL} alt="">
                            <div class="flex flex-col">
                                <p>{voices[$v].name}</p>
                                <!-- preview audio -->
                                <button 
                                    on:click={() => playVoicePreview(voices[$v].audioPreviewURL)}
                                    class="hover:bg-white transform transition-all duration-300 ease-in-out hover:text-black px-3 p-1 border-white border-[1px] text-xs">preview audio ▶️</button>
                            </div>
                        </div>
                        <div 
                            class="flex flex-wrap gap-2 p-2 w-full justify-evenly overflow-x-auto">
                            <!-- hovered voice goes here -->
                            {#each voices as voice, index}
                                <button>
                                    <VoiceData voice={voice} i={index} />
                                </button>
                            {/each}
                        </div>
                    </button>

                    

                    

                </div>

