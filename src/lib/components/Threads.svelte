<script lang="ts">
    import { auth, firestore } from "$lib/firebase";
    import { userStore } from "sveltefire";
    import Visualizations from "./Visualizations.svelte";
    import { userThreads } from "$lib/stores";
    import { get } from "svelte/store";
    import {
        doc,
        updateDoc,
        arrayUnion,
        arrayRemove,
    } from "firebase/firestore";

    type ThreadEvent = {
        detail: {
            threadID: string;
            newName?: string;
        }
    }

    const user = userStore(auth);
    let myThreads = get(userThreads);

    async function handleFavorite(event: ThreadEvent) {
        const { threadID } = event.detail;
        myThreads = [threadID, ...myThreads.filter((id) => id !== threadID)];
        await updateFirestore();
    }

    async function handleRename(event: ThreadEvent) {
        const { threadID, newName } = event.detail;
        if (!newName) return;

        const userRef = doc(firestore, `users/${$user!.uid}`);
        await updateDoc(userRef, {
            [`threadNames.${threadID}`]: newName,
        });
    }

    async function handleArchive(event: ThreadEvent) {
        const { threadID } = event.detail;
        myThreads = myThreads.filter((id) => id !== threadID);
        const userRef = doc(firestore, `users/${$user!.uid}`);
        await updateDoc(userRef, {
            threads: arrayRemove(threadID),
            archivedThreads: arrayUnion(threadID),
        });
        await updateFirestore();
    }

    async function updateFirestore() {
        if (!$user) return;
        const userRef = doc(firestore, `users/${$user.uid}`);
        await updateDoc(userRef, { threads: myThreads });
        userThreads.set(myThreads);
    }
</script>

<div class="flex flex-col">
    {#each myThreads as thread, index}
        <Visualizations
            threadID={thread}
            {index}
            on:favorite={handleFavorite}
            on:rename={handleRename}
            on:archive={handleArchive}
        />
    {/each}
</div>
