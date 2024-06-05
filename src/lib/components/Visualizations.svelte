<!-- perform api call to list all of user's threads -->
<script lang="ts">
    import { goto } from "$app/navigation";
    import { auth, firestore } from "$lib/firebase";
    import {
        currentRun,
        currentThread,
        isMenuOpen,
        messagesStore,
        userThreads,
    } from "$lib/stores";
    import {
        arrayRemove,
        doc,
        getFirestore,
        setDoc,
        updateDoc,
    } from "firebase/firestore";
    import { onMount } from "svelte";
    import { get, writable } from "svelte/store";
    import { docStore, userStore } from "sveltefire";
    import { map } from "zod";

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const user = userStore(auth);

    let showDeleteToolTip = false;
    let showDeleteButton = false;

    let firstMessage = writable<string>("");

    export let threadID: string;

    async function getFirstMessage() {
        try {
            const response = await fetch("/api/threads/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    threadID: threadID,
                }),
            });

            const data = await response.json();

            firstMessage.set(
                data.body?.data?.[1]?.content?.[0]?.text?.value ?? "",
            );
        } catch (error) {
            console.error("error fetching thread messages", error);
        }
    }

    async function deleteThread(threadID: string) {
        // todos
        // delete thread from userThreads store
        // delete thread from firestore
        console.log("hello from delete thread");
        try {
            const response = await fetch("/api/threads/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    threadID: threadID,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("API response:", result);

            // delete from firestore
            if (result.deleted) {
                console.log("hello from if (result.success)");

                console.log(
                    "Thread successfully deleted from API. Proceeding with Firestore update.",
                );

                const userRef = doc(firestore, `users/${$user!.uid}`);

                await updateDoc(userRef, {
                    threads: arrayRemove(threadID),
                });

                console.log("Thread successfully deleted from Firestore.");

                // todo
                // remove thread from userThreads
                userThreads.update((threads) =>
                    threads.filter((id) => id !== threadID),
                );
                console.log(
                    "Thread successfully deleted from userThreads store.",
                );

                // check if deleted thread is the currentThread
                console.log("checking to see if currentThread deleted: ");
                currentThread.update((current) => {
                    if (current === threadID) {
                        messagesStore.set([]);
                        currentRun.set("");

                        // clear url
                        goto("/", { replaceState: true });

                        return "";
                    }
                    return current;
                });
                console.log("current thread: ", currentThread);
            }
        } catch (error) {
            console.error("failed to delete the thread: ", error);
        }
    }

    async function setThread(threadID: string) {
        currentThread.set(threadID);
        isMenuOpen.set(false);
    }

    getFirstMessage();
</script>

{#if $firstMessage !== ""}
    <button
        on:mouseenter={() => (showDeleteButton = true)}
        on:mouseleave={() => (showDeleteButton = false)}
        on:click={() => setThread(threadID)}
        class="group rounded-xl hover:border-slate-400 border-[1px] border-transparent w-full max-w-[22rem] text-left relative p-2 hover:glow"
    >
        <p
            class="peer-last-of-type:opacity-50 truncate -tracking-widest w-full group-hover:text-white text-slate-500"
        >
            {$firstMessage}
        </p>

        {#if showDeleteButton || isMobile}
            <button
                on:click|stopPropagation={() => deleteThread(threadID)}
                class="hover:bg-white hover:border-black px-2 p-1 rounded-full bg-black border-slate-500 border-[1px] absolute -top-2 -right-1 text-xs"
                >❌</button
            >
        {/if}
    </button>
{/if}
