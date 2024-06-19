<script lang="ts">
    import {
        currentVoiceID,
        audioSource,
        isLoading,
        isPlaying,
    } from "$lib/stores";
    import { formatText } from "$lib/api";
    import { streamTextToSpeech } from "$lib/utils/streamTextToSpeech";

    export let message: string;

    let listenToolTip = false;
    let pauseTooltip = false;
    let loadingSpeechTooltip = false;
    let downloadTooltip = false;

    let downloaded = false;
    let downloadStatus = "";

    let loopTooltip = false;
    let isLooped = false;

    let audioPlayer: HTMLAudioElement;

    function stripHtmlTags(inputText: string) {
        return inputText.replace(/<[^>]*>/g, "");
    }

    function downloadAudio() {
        downloaded = false;
        downloadStatus = "in progress";
        if ($audioSource) {
            const a = document.createElement("a");
            a.href = $audioSource;
            a.download = "voice.mp3";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        }
        downloaded = true;
        downloadStatus = "complete";
        setTimeout(() => {
            downloaded = false;
        }, 3000);
    }

    function togglePlayBack() {
        if ($isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play();
        }
        isPlaying.set(!$isPlaying); // Toggle playback state
    }

    function toggleLoopAudio() {
        isLooped = !isLooped;
    }

    function resumeAudio() {
        if ($audioSource) {
            audioPlayer.play();
            isPlaying.set(true);
        }
    }
</script>

<div>
    {#if $isLoading}
        <button
            on:mouseenter={() => (loadingSpeechTooltip = true)}
            on:mouseleave={() => (loadingSpeechTooltip = false)}
            class="relative"
        >
            {#if loadingSpeechTooltip}
                <span
                    class="text-sm absolute left-1/2 top-0 -translate-x-1/2 tooltip rounded shadow-lg px-2 p-1 bg-black text-slate-400 mt-8"
                    >loading voice</span
                >
            {/if}
            <p class="animate-spin">💿</p>
        </button>
    {:else if $isPlaying}
        <button
            on:mouseenter={() => (pauseTooltip = true)}
            on:mouseleave={() => (pauseTooltip = false)}
            on:click={togglePlayBack}
            class="relative"
        >
            {#if pauseTooltip}
                <span
                    class="text-sm absolute left-1/2 top-0 -translate-x-1/2 tooltip rounded shadow-lg px-2 p-1 bg-black text-slate-400 mt-8"
                    >pause</span
                >
            {/if}
            ⏸️
        </button>
    {:else if $audioSource}
        <button
            on:mouseenter={() => (listenToolTip = true)}
            on:mouseleave={() => (listenToolTip = false)}
            on:click={resumeAudio}
            class="relative"
        >
            {#if listenToolTip}
                <span
                    class="text-sm absolute left-1/2 top-0 -translate-x-1/2 tooltip rounded shadow-lg px-2 p-1 bg-black text-slate-400 mt-8"
                    >play</span
                >
            {/if}
            🎧
        </button>
    {:else}
        <button
            on:mouseenter={() => (listenToolTip = true)}
            on:mouseleave={() => (listenToolTip = false)}
            on:click={() =>
                streamTextToSpeech(formatText(message), $currentVoiceID)}
            class="relative"
        >
            {#if listenToolTip}
                <span
                    class="text-sm absolute left-1/2 top-0 -translate-x-1/2 tooltip rounded shadow-lg px-2 p-1 bg-black text-slate-400 mt-8"
                    >listen</span
                >
            {/if}
            <p
                class="contrast-50 hover:contrast-100 transform transition-all duration-200 ease-in-out"
            >
                🎧
            </p>
        </button>
    {/if}
</div>

{#if $audioSource}
    <button
        on:click={toggleLoopAudio}
        on:mouseenter={() => (loopTooltip = true)}
        on:mouseleave={() => (loopTooltip = false)}
        class="relative"
    >
        {#if isLooped}
            {#if loopTooltip}
                <span
                    class="text-sm absolute left-1/2 top-0 -translate-x-1/2 tooltip rounded shadow-lg px-2 p-1 bg-black text-slate-400 mt-8"
                    >don't loop</span
                >
            {/if}
            <p>🔁</p>
        {:else}
            {#if loopTooltip}
                <span
                    class="w-24 text-sm absolute left-1/2 top-0 -translate-x-1/2 tooltip rounded shadow-lg px-2 p-1 bg-black text-slate-400 mt-8"
                    >loop audio</span
                >
            {/if}
            <p
                class="contrast-50 hover:contrast-100 transform transition-all duration-200 ease-in-out"
            >
                🔁
            </p>
        {/if}
    </button>
    <audio
        bind:this={audioPlayer}
        src={$audioSource}
        on:play={() => isPlaying.set(true)}
        on:pause={() => isPlaying.set(false)}
        on:ended={() => isPlaying.set(false)}
        autoplay
        loop={isLooped}
    />
    <button
        on:click={downloadAudio}
        on:mouseenter={() => (downloadTooltip = true)}
        on:mouseleave={() => (downloadTooltip = false)}
        class="relative"
    >
        {#if downloaded}
            {#if downloadTooltip}
                <span
                    class="text-sm absolute left-1/2 top-0 -translate-x-1/2 tooltip rounded shadow-lg px-2 p-1 bg-black text-slate-400 mt-8"
                    >download {downloadStatus}</span
                >
            {/if}
            ✅
        {:else}
            {#if downloadTooltip}
                <span
                    class="w-32 text-sm absolute left-1/2 top-0 -translate-x-1/2 tooltip rounded shadow-lg px-2 p-1 bg-black text-slate-400 mt-8"
                    >download audio</span
                >
            {/if}
            <p
                class="contrast-50 hover:contrast-100 transform transition-all duration-200 ease-in-out"
            >
                💾
            </p>
        {/if}
    </button>
{/if}
