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
        }, 2000)
    }

    function handleRegenerate() {
        
    }

</script>

<!-- tools -->
<div class="flex justify-start space-x-1 mt-2 mb-8 -translate-x-2">
    <!-- text to speech button -->
    <SpeechButton message={message} />
    <!-- copy to clipboard button -->
    <button 
        on:mouseenter={() => copyToolTip = true} 
        on:mouseleave={() => copyToolTip = false} 
        on:click={() => handleCopy(message)} class="relative">
        {#if copied}
            {#if copyToolTip}
                <span class="text-sm absolute left-1/2 top-0 -translate-x-1/2 tooltip rounded shadow-lg p-1 bg-black text-slate-400 mt-8">copied</span>
            {/if}
            ✅
        {:else}
            {#if copyToolTip}
                <span class="text-sm absolute left-1/2 -translate-x-1/2 top-0 tooltip rounded shadow-lg p-1 bg-black text-slate-400 mt-8">copy</span>
            {/if}
            📋
        {/if}
    </button>
    <!-- regenerate button -->
    <button 
        on:mouseenter={() => regenerateToolTip = true}
        on:mouseleave={() => regenerateToolTip = false}
        on:click={() => handleRegenerate()}
        class="relative">
            {#if regenerateToolTip}
                <span class="text-sm absolute left-1/2 -translate-x-1/2 top-0 tooltip rounded shadow-lg p-1 bg-black text-slate-400 mt-8">regenerate</span>
            {/if}
        ↪️
    </button>
</div>

