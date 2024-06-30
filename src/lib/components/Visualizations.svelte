<!--Visualizations.svelte -->
<script lang="ts">
    import { goto } from "$app/navigation";
    import { auth, firestore } from "$lib/firebase";
    import {
        currentRun,
        currentThread,
        isMenuOpen,
        messagesStore,
        userThreads,
        threadOptionIndex,
    } from "$lib/stores";
    import { fade, fly, slide } from "svelte/transition";
    import {
        arrayRemove,
        doc,
        getDoc,
        getFirestore,
        setDoc,
        updateDoc,
    } from "firebase/firestore";
    import { createEventDispatcher, onMount } from "svelte";
    import { get, writable } from "svelte/store";
    import { docStore, userStore } from "sveltefire";
    import type { Thread } from "$lib/types";

    const user = userStore(auth);
    const dispatch = createEventDispatcher<{
        favorite: { id: string };
        rename: { id: string; newName: string };
        archive: { id: string };
    }>();

    export let thread: Thread;
    export let index: number;
    export let firstMessage: Promise<string>;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let showOptions = false;
    let displayMessage = writable('');

    $: if (thread.name) {
        displayMessage.set(thread.name);
    } else {
        firstMessage.then(message => displayMessage.set(message));
    }

    async function loadThreadName() {
        if (!$user) return;
        const userRef = doc(firestore, `users/${$user.uid}`);
        const userDoc = await getDoc(userRef);
        const threadNames = userDoc.data()?.threadNames || {};
        threadName = threadName[threadID] || $firstMessage;
    }

    $: if ($user) {
        loadThreadName();
    }



    async function deleteThread(id: string) {
        try {
            const response = await fetch("/api/threads/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ threadID: id }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();

            // delete from firestore
            if (result.deleted) {
                const userRef = doc(firestore, `users/${$user!.uid}`);
                await updateDoc(userRef, {
                    threads: arrayRemove(id),
                });

                userThreads.update((threads) =>
                    threads.filter((thread) => thread.id !== id)
                );

                currentThread.update((current) => {
                    if (current === id) {
                        messagesStore.set([]);
                        currentRun.set("");
                        goto("/", { replaceState: true });
                        return "";
                    }
                    return current;
                });
            }
        } catch (error) {
            console.error("failed to delete the thread: ", error);
        }
    }

    async function setThread(id: string) {
        currentThread.set(id);
        isMenuOpen.set(false);
    }

    onMount(() => {

        // close thread options by clicking anything else
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element | null;
            if (
                target &&
                !target.closest(".options-modal") &&
                $threadOptionIndex === index
            ) {
                threadOptionIndex.set(-1);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    });

    async function favorite() {
        dispatch("favorite", { id: thread.id });
    }

    async function rename() {
        const newName = prompt("Enter new name for thread:");
        if (newName) {
            dispatch("rename", { id: thread.id, newName });
        }
    }

    async function archive() {
        dispatch("archive", { id: thread.id });
    }
</script>

{#if $displayMessage !== ""}
    <!-- choose thread button -->
    <button
        on:mouseenter={() => (showOptions = true)}
        on:mouseleave={() => (showOptions = false)}
        on:click={() => setThread(thread.id)}
        class="hover-glow group hover:border-slate-400 rounded-xl border-[1px] border-transparent sm:w-[370px] w-[490px] text-left relative p-2 hover:glow"
    >
        <!-- preview thread content -->
        <p
            class="z-20 group-hover:text-opacity-100 text-opacity-75 overflow-hidden truncate tracking w-full text-white"
        >
            {$displayMessage}
        </p>

        <!-- open thread options button -->
        {#if $threadOptionIndex === index || showOptions || isMobile}
            <div
                class="bg-opacity-100 bg-black h-full text-xs px-4 group rounded-e-xl top-0 right-0 flex justify-center font-black z-10 items-center absolute"
            >
                <button
                    on:click|stopPropagation={() =>
                        threadOptionIndex.set(index)}
                    class=""
                    ><span class="text-xl">✨</span>

                    <!-- options modal -->
                    {#if $threadOptionIndex === index}
                        <!-- thread options -->
                        <button
                            in:slide
                            class="z-50 absolute right-0 text-sm flex flex-col items-center p-2 rounded-2xl bg-black bg-opacity-100 backdrop-blur-2xl border-white border-[1px]"
                        >
                            <!-- share -->
                            <button
                                on:click|stopPropagation={favorite}
                                class="{thread.favorite ? 'bg-blue-700' : 'hover:bg-blue-700'} w-full p-3 rounded-xl flex justify-start space-x-2"
                            >
                                <p>⭐️</p>
                                <p>Favorite</p>
                            </button>
                            <!-- rename -->
                            <button
                                on:click|stopPropagation={rename}
                                class="w-full p-3 rounded-xl hover:bg-blue-700 flex justify-start space-x-2"
                            >
                                <p>🤔</p>
                                <p>Rename</p>
                            </button>
                            <!-- archive -->
                            <button
                                on:click|stopPropagation={archive}
                                class="w-full p-3 rounded-xl hover:bg-blue-700 flex justify-start space-x-2"
                            >
                                <p>🗂️</p>
                                <p>Archive</p>
                            </button>
                            <!-- delete -->
                            <button
                                on:click|stopPropagation={() => deleteThread(thread.id)}
                                class="w-full p-3 rounded-xl hover:bg-red-700 flex justify-start space-x-2"
                            >
                                <p>🚮</p>
                                <p>Delete</p>
                            </button>
                        </button>
                    {/if}
                </button>
            </div>
        {/if}
    </button>
{/if}
