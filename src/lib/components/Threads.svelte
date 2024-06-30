<!-- Threads.svelte -->
<script lang="ts">
    import { auth, firestore } from "$lib/firebase";
    import { userStore } from "sveltefire";
    import Visualizations from "./Visualizations.svelte";
    import { userThreads } from "$lib/stores";
    import { get } from "svelte/store";
    import type { Thread } from "$lib/types";
    import {
        doc,
        updateDoc,
    } from "firebase/firestore";

    type ThreadEvent = {
        detail: {
            id: string;
            newName?: string;
        };
    };

    const user = userStore(auth);
    let myThreads: Thread[];
    $: myThreads = $userThreads;

    async function getFirstMessage(threadID: string): Promise<string> {
        try {
            const response = await fetch("/api/threads/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ threadID }),
            });

            const data = await response.json();
            return data.body?.data?.[1]?.content?.[0]?.text?.value ?? "";
        } catch (error) {
            console.error("error fetching thread messages", error);
            return "🪲";
        }
    }

    async function handleFavorite(event: ThreadEvent) {
        const { id } = event.detail;
        myThreads = myThreads.map((thread) =>
            thread.id === id
                ? { ...thread, favortie: !thread.favorite }
                : thread,
        );
        await updateFirestore();
    }

    async function handleRename(event: ThreadEvent) {
        const { id, newName } = event.detail;
        if (!newName) return;

        myThreads = myThreads.map((thread) =>
            thread.id === id ? { ...thread, name: newName } : thread,
        );

        const userRef = doc(firestore, `users/${$user!.uid}`);
        await updateDoc(userRef, { threads: myThreads });
        userThreads.set(myThreads);
    }

    async function handleArchive(event: ThreadEvent) {
        const { id } = event.detail;

        myThreads = myThreads.map((thread) =>
            thread.id === id ? { ...thread, archived: true } : thread,
        );
        const userRef = doc(firestore, `users/${$user!.uid}`);
        await updateDoc(userRef, { threads: myThreads });
        userThreads.set(myThreads);
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
            {index}
            {thread}
            firstMessage={getFirstMessage(thread.id)}
            on:favorite={handleFavorite}
            on:rename={handleRename}
            on:archive={handleArchive}
        />
    {/each}
</div>
