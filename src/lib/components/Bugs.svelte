<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { fly } from "svelte/transition";
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
        if (browser) {
            document.removeEventListener("click", handleClickOutside);
        }
    });
</script>
