<script lang="ts">
    import Voices from "./Voices.svelte";

    import { fly } from "svelte/transition";
    import { cubicInOut } from "svelte/easing";
    import {
        currentThread,
        inputFocused,
        isMenuOpen,
        messagesStore,
    } from "$lib/stores";
    import Threads from "./Threads.svelte";
    import Bugs from "./Bugs.svelte";
    import { goto } from "$app/navigation";

    let newVisualizationToolTip = false;
    let toggleMenuToolTip = false;

    function toggleMenu() {
        isMenuOpen.update(current => !current);
        toggleMenuToolTip = false;
    }

    function closeMenu() {
        isMenuOpen.set(false);
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

{#if $isMenuOpen}
    <!-- bg overlay -->
    <button
        on:click={() => closeMenu()}
        class="z-20 inset-10 h-screen w-screen fixed top-0 left-0"
    ></button>

    <!-- menu -->
    <div
        in:fly={{ x: -100, duration: 100, easing: cubicInOut }}
        class="h-screen overflow-y-auto w-full sm:w-[390px] z-30 bg-blue-700 border-slate-500 border-[1px] bg-opacity-30 backdrop-blur relative top-0 p-2 flex flex-col space-y-2 items-start"
    >
        <!-- new visualization button -->
        <button
            on:mouseenter={() => (newVisualizationToolTip = true)}
            on:mouseleave={() => (newVisualizationToolTip = false)}
            on:click={() => handleCreateNewThread()}
            class="p-4 bg-lime-800 z-10 group absolute top-0 right-0 font-mono text-3xl font-black hover:text-white text-slate-400"
            ><p
                class="transform transition-all duration-500 ease-in-out group-hover:scale-110"
            >
                📝
            </p>

            {#if newVisualizationToolTip}
                <span
                    in:fly={{ duration: 200, y: -10 }}
                    class="text-sm absolute top-10 right-0 tooltip rounded shadow-lg px-2 p-1 bg-black border-white border-[1px] text-white mt-8"
                    >new visualization</span
                >
            {/if}
        </button>

        <!-- visualizations -->
        <div class="pt-12 flex flex-col p-">
            <Threads />
        </div>

        <Voices />

        <div class="p-2 w-full m-auto left-0 absolute bottom-0">
            <Bugs />
        </div>
    </div>
{/if}
<button
    on:touchstart|preventDefault={() => (toggleMenuToolTip = true)}
    on:touchend|preventDefault={() => (toggleMenuToolTip = false)}
    on:mouseenter|preventDefault={() => (toggleMenuToolTip = true)}
    on:mouseleave|preventDefault={() => (toggleMenuToolTip = false)}
    on:click|stopPropagation={() => toggleMenu()}
    class="p-4 bg-sky-800 transform z-[9999] transition-all duration-500 ease-in-out group fixed top-0 left-0 font-mono text-3xl font-black hover:text-white text-slate-400"
>
    <p class="group-hover:scale-110">𓊓</p>

    {#if toggleMenuToolTip}
        <span
            in:fly={{duration: 200, y: -10}}
            class="z-50 flex justify-center items-center text-sm absolute top-10 left-0 tooltip w-28 rounded shadow-lg px-2 p-1 bg-black border-white border-[1px] font-mono font-normal text-white mt-8"
        >
            {#if $isMenuOpen}
                Close menu
            {:else}
                Open menu
            {/if}
        </span>
    {/if}
</button>
