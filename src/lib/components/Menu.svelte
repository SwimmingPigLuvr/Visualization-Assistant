<script lang="ts">
    import Voices from "./Voices.svelte";

    import { fade, fly, slide, blur } from "svelte/transition";
    import VoiceData from "./VoiceData.svelte";
    import {
        cubicInOut,
        cubicIn,
        cubicOut,
        backIn,
        backOut,
    } from "svelte/easing";
    import { writable } from "svelte/store";
    import Visualizations from "./Visualizations.svelte";
    import {
        bgMode,
        customInstruct,
        currentTechnique,
        currentThread,
        inputFocused,
        isMenuOpen,
        messagesStore,
        userThreads,
        v,
        wallpaper,
    } from "$lib/stores";
    import {
        SignedIn,
        SignedOut,
        Doc,
        collectionStore,
        docStore,
        userStore,
    } from "sveltefire";
    import { auth, firestore } from "$lib/firebase";
    import { onDestroy } from "svelte";
    import Threads from "./Threads.svelte";
    import type { Voice } from "$lib/types";
    import Profile from "./Profile.svelte";
    import Techniques from "./Techniques.svelte";
    import Bugs from "./Bugs.svelte";
    import { goto } from "$app/navigation";

    $: if ($currentTechnique) {
        if ($currentTechnique === "affirmation") {
            customInstruct.set(
                "Your role is my affirmation assistant. An affirmation is a short statement. Create an affirmation based on the user's desired outcome. the affirmation will be in the present tense and will be a positive statement that assumes their desire is fulfilled",
            );
        }
        if ($currentTechnique === "meditation") {
            customInstruct.set(
                "create a guided meditation that invites the user to first close their eyes. breathing in slowly, holding for a brief period, then breathing out slowly. each inhalation relaxes the user and is breathing in the feelings of their wish fulfilled right now in the present moment, each exhalation is letting go of the old emotions, thought patterns, behaviors that no longer serve them. instruct them to feel that the wish has been fulfilled. let them do this for awhile then guide them back to the present",
            );
        }
        if ($currentTechnique === "revision") {
            customInstruct.set(
                "Guide the user through the technique of revision. Ask them to review an event that didn't go the way they wanted it to go, without judgment, just review it. Instruct them to rewrite and revise the event in their imagination the way they wish it would have gone. Then, guide them to get into the state akin to sleep (SATS), where they feel completely relaxed. Tell them to relive the revised event in their imagination over and over again until it starts feeling as though it actually happened that way. They should continue this until they either fall asleep or wake up from the drowsy state knowing that the revision is done. Emphasize that through this method, they can revise any unwanted event and will notice changes for the better in the coming days and weeks.",
            );
        }
        if ($currentTechnique === "visualization") {
            customInstruct.set(null);
        }
    }

    let showCreateButton = false;

    let wallpapers = [
        {
            src: "/wallpaper/images/scene1.png",
            alt: "A serene landscape with clear blue skies, lush green meadows and gentle flowing rivers under the warm summer sun. The scene is filled with vibrant colors of nature's palette, creating an atmosphere that evokes tranquility and harmony. in the style of anime.",
        },
        {
            src: "/wallpaper/images/scene2.png",
            alt: "Japanese temple, Japanese landscape with waterfalls and blue sky, fantasy art style, concept art in the style of Atey Ghailan and Studio Ghibli, anime background, red accents, digital painting, high resolution",
        },
        {
            src: "/wallpaper/images/background.jpeg",
            alt: "pretty field of green grass, neatly cut, a branch with many pink cherry blossoms and green leaves is in the view of the top right corner of the image. the sun shines white with long rays in the upper left over a sky of beautiful white clouds",
        },
    ];

    let videos = ["/videos/clouds.mp4"];

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

    function setWallpaper(src: string, mode: "image" | "video") {
        if (mode === "image") {
            console.log("bg mode: image");
            console.log("image source: ", src);
            wallpaper.set(src);
            bgMode.set(mode);
        } else if (mode === "video") {
            console.log("bg mode: video");
            console.log("video source: ", src);
            bgMode.set(mode);
        }
    }

    function handleCreateNewThread() {
        isMenuOpen.set(false);
        currentThread.set("");
        messagesStore.set([]);
        // focus on input
        inputFocused.set(true);
        console.log("input focused: ", $inputFocused);
        goto("/", { replaceState: true });
    }
</script>

<SignedIn>
    {#if $isMenuOpen}
        <!-- click anywhere but menu to close menu -->
        <button
            on:click={() => closeMenu()}
            class="z-20 inset-10 h-screen w-screen fixed top-0 left-0"
        ></button>
        <!-- settings -->
        <div
            class="h-screen overflow-y-auto max-w-sm z-30 bg-black border-slate-500 border-[1px] bg-opacity-50 backdrop-blur-2xl fixed top-0 p-2 flex flex-col space-y-2 items-start"
        >
            <!-- close button -->
            <button
                on:click={() => closeMenu()}
                class="absolute w-10 items-center flex justify-center h-10 top-0 right-2 font-mono text-sm"
                >⬅</button
            >

            <!-- visualizations -->
            <!-- <h2 class="p-2 text-xl">Visualizations</h2> -->
            <div class="flex flex-col p-2">
                <!-- create new thread -->
                <button
                    on:mouseenter={() => (showCreateButton = true)}
                    on:mouseleave={() => (showCreateButton = false)}
                    on:click={() => handleCreateNewThread()}
                    class="rounded-xl hover:border-slate-500 border-[1px] border-transparent hover:bg-opacity-30 w-full text-left relative p-2"
                >
                    <p class="w-full">New Visualization</p>
                    {#if showCreateButton}
                        <button
                            on:click|preventDefault={() =>
                                handleCreateNewThread()}
                            class="hover:bg-white hover:border-black hover:text-black px-2 rounded-full bg-black border-slate-500 border-[1px] absolute -top-2 -right-1 font-bold text-xl"
                            >+</button
                        >
                    {/if}
                </button>
                <Threads />
            </div>

            <hr class="w-full border-[1px] border-slate-500" />

            <button on:click={toggleSettings} class="p-2 text-xl"
                >Settings</button
            >

            <Techniques />

            <Voices />

            <Bugs />
        </div>
    {:else}
        <button
            on:click={() => openMenu()}
            class="transform transition-all duration-500 ease-in-out hover:scale-110 fixed top-0 left-2 font-mono text-5xl font-black hover:text-white text-slate-400 -tracking-widest"
            >✦</button
        >
    {/if}
</SignedIn>
