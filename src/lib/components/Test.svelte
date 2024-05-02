<script lang="ts">
    async function createThreadAndRun(event: MouseEvent) {
        const response = await fetch('/api/threads/threadsAndRuns', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
    }
</script>

<div class="w-full z-50">
    <button on:click={createThreadAndRun} class="active:border-t-4 active:border-b-2 active:border-e-8 z-50 hover:bg-opacity-60 bg-white bg-opacity-50 fixed top-24 left-1/2 -translate-x-1/2  font-serif italic -tracking-widest text-2xl rounded-xl border-white border-b-8 border-e-4 border-s-2 border-t-2 w-60 p-4 m-auto">Create Thread & Run</button>
</div>