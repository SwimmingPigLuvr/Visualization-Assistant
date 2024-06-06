<script lang="ts">
    let reportBugWindowOpen = false;

    function toggleReportWindow() {
        reportBugWindowOpen = !reportBugWindowOpen;
    }
</script>

<div class="w-full p-2">
    <button
        on:click={() => toggleReportWindow()}
        class="animate-bounce text-3xl w-full text-right">🐛</button
    >
</div>

{#if reportBugWindowOpen}
    <div
        class="z-50 font-sans -tracking-wide fixed -bottom-16 right-12 text-xl p-8 text-sky-300 bg-white rounded-xl rounded-br-none"
    >
        <p>please kindly message m3.</p>
    </div>
{/if}
