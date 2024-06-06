<script lang="ts">
    import { blur, fade, fly, slide } from "svelte/transition";
    import SpeechButton from "./SpeechButton.svelte";

    let copyToolTip = false;
    let regenerateToolTip = false;

    export let message: string;

    let copied = false;

    // copyButton
    function handleCopy(text: string) {
        navigator.clipboard.writeText(text);
        copied = true;
        setTimeout(() => {
            copied = false;
        }, 2000);
    }

    function handleRegenerate() {}
</script>

<!-- tools -->
<div
    class="transform transition-all duration-500 ease-in-out flex items-center justify-start space-x-3 mt-2 mb-8 -translate-x-2"
>
    <!-- text to speech button -->
    <SpeechButton {message} />
    <!-- copy to clipboard button -->
    <button
        on:mouseenter={() => (copyToolTip = true)}
        on:mouseleave={() => (copyToolTip = false)}
        on:click={() => handleCopy(message)}
        class="relative"
    >
        {#if copied}
            {#if copyToolTip}
                <span
                    class="text-sm absolute left-1/2 top-0 -translate-x-1/2 tooltip rounded shadow-lg px-2 p-1 bg-black text-slate-400 mt-8"
                    >copied</span
                >
            {/if}
            ✅
        {:else}
            {#if copyToolTip}
                <span
                    class="text-sm absolute left-1/2 -translate-x-1/2 top-0 tooltip rounded shadow-lg px-2 p-1 bg-black text-slate-400 mt-8"
                    >copy</span
                >
            {/if}
            <p
                class="contrast-50 hover:contrast-100 transform transition-all duration-200 ease-in-out"
            >
                📋
            </p>
        {/if}
    </button>
    <!-- regenerate button -->
    <button
        on:mouseenter={() => (regenerateToolTip = true)}
        on:mouseleave={() => (regenerateToolTip = false)}
        on:click={() => handleRegenerate()}
        class="relative"
    >
        {#if regenerateToolTip}
            <span
                class="text-sm absolute left-1/2 -translate-x-1/2 top-0 tooltip rounded shadow-lg px-2 p-1 bg-black text-slate-400 mt-8"
                >regenerate</span
            >
        {/if}
        <p
            class="contrast-50 hover:contrast-100 transform transition-all duration-200 ease-in-out"
        >
            🔄
        </p>
    </button>
</div>
