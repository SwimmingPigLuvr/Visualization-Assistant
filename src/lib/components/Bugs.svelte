<script lang="ts">
    import { slide } from "svelte/transition";

    let reportBugWindowOpen = false;
    let suggestIdeaWindowOpen = false;

    function toggleReportWindow() {
        reportBugWindowOpen = !reportBugWindowOpen;
        suggestIdeaWindowOpen = false;
    }

    function toggleIdeaWindow() {
        suggestIdeaWindowOpen = !suggestIdeaWindowOpen;
        reportBugWindowOpen = false;
    }
</script>

<div class="w-full p-1 flex">
    <button
        on:click={() => toggleIdeaWindow()}
        class=" text-3xl w-full text-left">💡</button
    >
    <button
        on:click={() => toggleReportWindow()}
        class=" text-3xl w-full text-right">🐛</button
    >
</div>

{#if reportBugWindowOpen}
    <div
        in:slide
        class="z-50 font-sans font-bold -tracking-wide fixed -bottom-16 right-8 text-xl p-4 text-sky-400 bg-white rounded-xl rounded-br-none"
    >
        <p>Please kindly message me if you see any bugs!</p>
        <p>-Thanks</p>
    </div>
{/if}

{#if suggestIdeaWindowOpen}
    <div
        in:slide
        class="z-50 font-sans font-bold -tracking-wide fixed -bottom-16 left-8 text-xl p-4 text-sky-200 bg-sky-600 border-sky-600 border-4 rounded-xl rounded-bl-none"
    >
        <p>
            Please kindly message me if you see have any ideas or suggestions!
        </p>
        <p>-Thanks</p>
    </div>
{/if}
