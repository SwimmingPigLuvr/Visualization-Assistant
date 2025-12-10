<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { fly, slide } from "svelte/transition";
    import { browser } from "$app/environment";

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

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as Element | null;
        if (
            target &&
            !target.closest(".popup") &&
            (reportBugWindowOpen || suggestIdeaWindowOpen)
        ) {
            reportBugWindowOpen = false;
            suggestIdeaWindowOpen = false;
        }
    }

    onMount(() => {
        if (browser) {
            document.addEventListener("click", handleClickOutside);
        }
    });

    onDestroy(() => {
        document.addEventListener("click", handleClickOutside);
    });
</script>

<div class="w-full px-3 flex justify-end space-x-3">
    <button
        on:click={() => toggleIdeaWindow()}
        class="text-3xl hover:-translate-y-1">💡</button
    >
    <button
        on:click={() => toggleReportWindow()}
        class="text-3xl hover:-translate-y-1">🐛</button
    >
</div>

{#if reportBugWindowOpen}
    <div
        in:fly={{ y: 10 }}
        class="popup z-50 w-[10rem] font-sans font-bold -tracking-wide fixed bottom-14 right-10 text-xl p-4 text-sky-400 bg-white rounded-xl rounded-br-none"
    >
        <p>Please kindly message me if you see any bugs!</p>
        <p>-Thanks</p>
    </div>
{/if}

{#if suggestIdeaWindowOpen}
    <div
        in:fly={{ y: 10 }}
        class="z-50 w-[10rem] font-sans font-bold -tracking-wide fixed bottom-14 right-20 text-xl p-4 text-sky-200 bg-sky-600 border-sky-600 border-4 rounded-xl rounded-br-none"
    >
        <p>
            Please kindly message me if you see have any ideas or suggestions!
        </p>
        <p>-Thanks</p>
    </div>
{/if}
