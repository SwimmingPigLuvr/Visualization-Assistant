<script lang="ts">
    import {
        currentVoiceID,
        audioSource,
        isLoading,
        isPlaying,
        currentTechnique,
    } from "$lib/stores";
    import { formatText } from "$lib/api";
    import { streamTextToSpeech } from "$lib/utils/streamTextToSpeech";

    export let message: string;
    export let index: number;

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
        if ($audioSource[index]) {
            const a = document.createElement("a");
            a.href = $audioSource[index];
            a.download = `custom_${$currentTechnique}.mp3`;
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
        if ($isPlaying[index]) {
            audioPlayer.pause();
        } else {
            audioPlayer.play();
        }
        isPlaying.update((state) => {
            state[index] = !state[index];
            return state;
        });
    }

    function toggleLoopAudio() {
        isLooped = !isLooped;
    }

    function resumeAudio() {
        if ($audioSource[index]) {
            audioPlayer.play();
            isPlaying.update((n) => {
                n[index] = true;
                return n;
            });
        }
    }

    async function handleStreamTextToSpeech() {
        const formattedText = formatText(message);
        console.log("streamTextToSpeech function: ", formatText);
        if (formattedText && $currentVoiceID) {
            await streamTextToSpeech(formattedText, $currentVoiceID);
        } else {
            console.error("text or voice id is missing");
        }
    }
</script>

<div>
    {#if $isLoading[index]}
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
    {:else if $isPlaying[index]}
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
            on:click={handleStreamTextToSpeech}
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

{#if $audioSource[index]}
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
        src={$audioSource[index]}
        on:play={() =>
            isPlaying.update((n) => {
                n[index] = true;
                return n;
            })}
        on:pause={() =>
            isPlaying.update((n) => {
                n[index] = false;
                return n;
            })}
        on:ended={() =>
            isPlaying.update((n) => {
                n[index] = false;
                return n;
            })}
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
