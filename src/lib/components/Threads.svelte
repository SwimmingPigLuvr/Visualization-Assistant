<script lang="ts">
    import { auth, firestore } from "$lib/firebase";
    import { SignedIn, docStore, userStore } from "sveltefire";
    import Visualizations from "./Visualizations.svelte";
    import { userThreads } from "$lib/stores";
    import { get } from "svelte/store";
    import { onMount } from "svelte";

    let myThreads = get(userThreads);

</script>

<SignedIn>
    <div class="w-full flex flex-col">
        {#each myThreads as thread}
            <Visualizations threadID={thread} />
        {/each}
    </div>
</SignedIn>