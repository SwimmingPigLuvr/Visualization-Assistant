<script lang="ts">
    import { auth, db } from "$lib/firebase";
    import { SignedIn, docStore, userStore } from "sveltefire";
    import Visualizations from "./Visualizations.svelte";
    import { userThreads } from "$lib/stores";
    import { get } from "svelte/store";
    import { onMount } from "svelte";

    // get user store
    const user = userStore(auth);
    const userDoc = docStore(db, `users/${$user!.uid}`);

    let threads: string[] = [];
    $: threads = $userDoc?.threads || [];

    // update threads store
    $: {
        if (threads) {
            userThreads.set([...threads]);
        }
    }

    let myThreads = get(userThreads);


</script>

<SignedIn>
    <div class="w-full flex flex-col">
        {#each myThreads as thread}
            <Visualizations threadID={thread} />
        {/each}
    </div>
</SignedIn>