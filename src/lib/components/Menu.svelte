<script lang="ts">
    import { fade, fly, slide, blur } from "svelte/transition";
    import VoiceData from "./VoiceData.svelte";
    import { cubicInOut, cubicIn, cubicOut, backIn, backOut } from "svelte/easing";
    import { writable } from "svelte/store";
    import Visualizations from "./Visualizations.svelte";
    import { bgMode, currentThread, inputFocused, isMenuOpen, messagesStore, userThreads, v, wallpaper } from "$lib/stores";
    import { SignedIn, SignedOut, Doc, collectionStore, docStore, userStore } from "sveltefire";
    import { auth, db } from "$lib/firebase";
    import { onDestroy } from "svelte";
    import Threads from "./Threads.svelte";
    import type { Voice } from "$lib/types";
    import Profile from "./Profile.svelte";

    let showCreateButton = false;

    let wallpapers = [
        { 
            src: "/wallpaper/images/scene1.png",
            alt: "A serene landscape with clear blue skies, lush green meadows and gentle flowing rivers under the warm summer sun. The scene is filled with vibrant colors of nature's palette, creating an atmosphere that evokes tranquility and harmony. in the style of anime."
        },
        { 
            src: "/wallpaper/images/scene2.png",
            alt: "Japanese temple, Japanese landscape with waterfalls and blue sky, fantasy art style, concept art in the style of Atey Ghailan and Studio Ghibli, anime background, red accents, digital painting, high resolution"
        },
        { 
            src: "/wallpaper/images/background.jpeg",
            alt: "pretty field of green grass, neatly cut, a branch with many pink cherry blossoms and green leaves is in the view of the top right corner of the image. the sun shines white with long rays in the upper left over a sky of beautiful white clouds"
        },
    ];

    let videos = [
        "/videos/clouds.mp4",
    ];

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


    function openMenu() {
        isMenuOpen.set(true);
    }

    function closeMenu() {
        isMenuOpen.set(false);
    }

    function toggleSettings(event: MouseEvent) {
        showSettings = !showSettings;
    }

    let showSettings = false;
    let showAssistantSettings = false;
    let showVoiceSettings = false;
    let showProfileSettings = false;
    let showAppearanceSettings = false;

    
    let isVideoOn = writable(false);

    function toggleVideo(event: MouseEvent) {
        isVideoOn.set(!isVideoOn);
    }

    function setWallpaper(src: string, mode: 'image' | 'video') {
        if (mode === 'image') {
            console.log('bg mode: image');
            console.log('image source: ', src);
            wallpaper.set(src);
            bgMode.set(mode);
        } else if (mode === 'video') {
            console.log('bg mode: video');
            console.log('video source: ', src);
            bgMode.set(mode);
        }
    }


    function handleCreateNewThread() {
        isMenuOpen.set(false);
        currentThread.set('');
        messagesStore.set([]);
        // focus on input
        inputFocused.set(true);
        console.log('input focused: ', $inputFocused);
    }


</script>



<SignedIn>

    {#if $isMenuOpen}

   


        <!-- click anywhere but menu to close menu -->
        <button on:click={() => closeMenu()} class="z-20 inset-10 h-screen w-screen fixed top-0 left-0"></button>
        <!-- settings -->
        <div class="h-screen overflow-y-auto max-w-sm w-[70%] z-30 bg-black border-slate-500 border-[1px] bg-opacity-50 backdrop-blur-2xl fixed top-0 p-2 flex flex-col space-y-2 items-start">

            


            <!-- close button -->
            <button on:click={() => closeMenu()} class="absolute w-10 items-center flex justify-center h-10 top-0 right-2 font-mono text-sm">⬅</button>

            <!-- visualizations -->
            <!-- <h2 class="p-2 text-xl">Visualizations</h2> -->
            <div class="flex flex-col p-2">
                <!-- create new thread -->
                <button 
                    on:mouseenter={() => showCreateButton = true}
                    on:mouseleave={() => showCreateButton = false}
                    on:click={() => handleCreateNewThread()} 
                    class="rounded-none  hover:border-slate-500 border-[1px] border-transparent hover:bg-opacity-30 w-full text-left relative p-2">
                        <p class="w-full">Create a new Thread +</p>
                        {#if showCreateButton}
                            <button class="absolute text-xl right-4">️</button>
                        {/if}
                </button>
                <Threads />
            </div>

            <hr class="w-full border-[1px] border-slate-500">

            <button on:click={toggleSettings} class="p-2 text-xl">Settings</button>
            {#if showSettings}
                <div
                    in:slide={{duration: 500, easing: cubicInOut}} 
                    out:slide={{duration: 500, easing: cubicInOut}} 
                    class="flex flex-col text-left w-full p-2">

                    <!-- <hr class="w-full max-w-xl py-2"> -->

                    <!-- assistant -->
                    <!-- <button class="-tracking-widest text-xl text-left">Assitant</button> -->

                    <!-- voice -->
                    <button 
                        on:mouseenter={() =>showVoiceSettings = true} 
                        on:mouseleave={() =>showVoiceSettings = false} 
                        class="-tracking-widest text-xl text-left">
                        Voice

                        <!-- voice settings -->
                        <div class="flex space-x-4">
                            <img class="w-20 h-20 my-4  rounded" src={voices[$v].imageURL} alt="">
                            <div class="flex flex-col space-x-2">
                                <p>{voices[$v].name}</p>
                                <p>{voices[$v].audioPreviewURL}</p>
                            </div>
                        </div>
                        <div 
                            in:slide={{duration: 300, easing: cubicInOut}}
                            out:slide={{duration: 300, easing: cubicInOut}}
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
            {/if}
            
        </div>
    {:else}
        <button on:click={() => openMenu()} class="transform transition-all duration-500 ease-in-out hover:scale-110 fixed top-0 left-2 font-mono text-5xl font-black hover:text-white text-slate-400 -tracking-widest">✦</button>
    {/if}
</SignedIn>