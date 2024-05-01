<script lang="ts">
    import { fade, fly, slide } from "svelte/transition";
    import Voice from "./Voice.svelte";
    import { cubicInOut, cubicIn, cubicOut } from "svelte/easing";
    import { writable } from "svelte/store";
    import Visualizations from "./Visualizations.svelte";
    import { currentThread, userThreads } from "$lib/stores";
    import { SignedIn, SignedOut, Doc, collectionStore, docStore, userStore } from "sveltefire";
    import { auth, db } from "$lib/firebase";
    import { onDestroy } from "svelte";
    import Threads from "./Threads.svelte";

    let voices = [
        {
            id: 'Atp5cNFg1Wj5gyKD7HWV',
            name: 'Natasha',
            imageURL: '/images/voices/natasha.png',
        },
        {
            id: '7Uw4vgM4Qb1qiwwUnu15',
            name: 'Soothing Sam',
            imageURL: '/images/voices/soothing-sam.png',
        },
    ];

    let isMenuOpen = false;

    function openMenu() {
        isMenuOpen = true;
    }

    function closeMenu() {
        isMenuOpen = false;
    }

    function toggleSettings(event: MouseEvent) {
        showSettings = !showSettings;
    }

    let showSettings = true;
    let showAssistantSettings = false;
    let showVoiceSettings = false;
    let showProfileSettings = false;
    let showAppearanceSettings = false;

    
    let isVideoOn = writable(false);

    function toggleVideo(event: MouseEvent) {
        isVideoOn.set(!isVideoOn);
    }


</script>



<SignedIn>

    {#if isMenuOpen}


        <!-- click anywhere but menu to close menu -->
        <button on:click={() => closeMenu()} class="z-20 inset-10 h-screen w-screen fixed top-0 left-0"></button>
        <!-- settings -->
        <div
            in:fly={{x: -200, duration: 500}}
            out:fly={{x: -200, duration: 500}}
            class="h-screen max-w-sm w-[70%] z-30 bg-black bg-opacity-50 backdrop-blur-2xl fixed top-0 p-2 flex flex-col space-y-2 items-start">

            <!-- close button -->
            <button on:click={() => closeMenu()} class="absolute w-10 items-center flex justify-center h-10 top-0 right-2 font-mono text-sm">⬅</button>

            <!-- visualizations -->
            <h2 class="p-2 text-xl">Visualizations</h2>
            <div class="flex flex-col p-2">
                <Threads />
            </div>

            <hr class="w-full bg-white">

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
                        {#if showVoiceSettings}
                            <div 
                                in:slide={{duration: 300, easing: cubicInOut}}
                                out:slide={{duration: 300, easing: cubicInOut}}
                                class="flex space-x-6 p-4">
                                {#each voices as voice}
                                    <Voice voice={voice} />
                                {/each}
                            </div>
                        {/if}
                    </button>

                    <!-- profile -->
                    <!-- <button class="-tracking-widest text-xl text-left">Profile</button> -->

                    <!-- appearance -->
                    <button 
                        on:mouseenter={() =>showAppearanceSettings = true} 
                        on:mouseleave={() =>showAppearanceSettings = false} 
                        class="-tracking-widest text-xl text-left">
                        Appearance

                        <!-- voice settings -->
                        {#if showAppearanceSettings}
                            <div 
                                in:slide={{duration: 300, easing: cubicInOut}}
                                out:slide={{duration: 300, easing: cubicInOut}}
                                class="flex flex-col space-y-2">

                                <!-- video -->
                                <h2>Video</h2>
                                <div class="flex space-x-2">
                                    <button class="transform transition-all duration-500 ease-in-out items-center justify-center opacity-50 hover:opacity-100 group flex flex-col" on:click={toggleVideo}>
                                        <video class="h-20 rounded-full border-white border-2 mx-auto group-hover:-translate-y-1 transform transition-all duration-1000 ease-in-out" src="/videos/clouds.mp4" autoplay loop muted>
                                        <input type="radio">
                                        <p class="font-serif -tracking-widest italic">Toggle Video</p>
                                    </button>
                                    <button class="transform transition-all duration-500 ease-in-out items-center justify-center opacity-50 hover:opacity-100 group flex flex-col" on:click={toggleVideo}>
                                        <video class="h-20 rounded-full border-white border-2 mx-auto group-hover:-translate-y-1 transform transition-all duration-1000 ease-in-out" src="/videos/clouds.mp4" autoplay loop muted>
                                        <input type="radio">
                                        <p class="font-serif -tracking-widest italic">Toggle Video</p>
                                    </button>
                                </div>
                            </div>
                        {/if}
                    </button>

                </div>
            {/if}
            
        </div>
    {:else}
        <button on:click={() => openMenu()} class="transform transition-all duration-500 ease-in-out hover:scale-110 fixed top-0 left-2 font-mono text-5xl font-black hover:text-white text-slate-400 -tracking-widest">✦</button>
    {/if}
</SignedIn>