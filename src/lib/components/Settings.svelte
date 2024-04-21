<script lang="ts">
    import { fade, slide } from "svelte/transition";
    import Voice from "./Voice.svelte";
    import { cubicInOut } from "svelte/easing";

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

    let showAssistantSettings = false;
    let showVoiceSettings = false;
    let showProfileSettings = false;
    let showAppearanceSettings = false;


</script>

{#if isMenuOpen}
    <!-- settings -->
    <div class="w-full z-50 bg-black bg-opacity-50 backdrop-blur-2xl fixed top-0 p-8 flex flex-col space-y-2 items-start">
        <!-- close button -->
        <button on:click={() => closeMenu()} class="absolute top-2 right-4 font-serif italic text-xl">X</button>

        <h1 class="font-serif -tracking-widest italic text-3xl">Settings</h1>
        <hr class="w-full max-w-xl py-2">

        <button class="-tracking-widest text-xl">Assitant</button>

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

        <button class="-tracking-widest text-xl">Profile</button>

        <button class="-tracking-widest text-xl">Appearance</button>
    </div>
{:else}
    <button on:click={() => openMenu()} class="hover:scale-110 p-4 font-serif italic -tracking-widest">MENU</button>
{/if}