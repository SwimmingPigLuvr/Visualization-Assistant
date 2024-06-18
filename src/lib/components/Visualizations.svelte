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
        threadOptionIndex,
    } from "$lib/stores";
    import { fade, fly, slide } from "svelte/transition";
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
    import { cubicInOut } from "svelte/easing";
    import ThreadOptions from "./ThreadOptions.svelte";

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const user = userStore(auth);

    let showDeleteToolTip = false;
    let showDeleteButton = false;
    let showOptions = false;

    let firstMessage = writable<string>("");

    export let threadID: string;
    export let index: number;

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

    onMount(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    });
</script>

{#if $firstMessage !== ""}
    <!-- choose thread button -->
    <button
        on:mouseenter={() => (showOptions = true)}
        on:mouseleave={() => (showOptions = false)}
        on:click={() => setThread(threadID)}
        class="hover-glow group hover:border-slate-400 rounded-xl border-[1px] border-transparent sm:w-[370px] w-[490px] text-left relative p-2 hover:glow"
    >
        <!-- preview thread content -->
        <p
            class="z-20 group-hover:text-opacity-100 text-opacity-75 overflow-hidden truncate tracking w-full text-white"
        >
            {$firstMessage}
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
                                class="w-full p-3 rounded-xl hover:bg-blue-700 flex justify-start space-x-2"
                            >
                                <p>⭐️</p>
                                <p>Favorite</p>
                            </button>
                            <!-- rename -->
                            <button
                                class="w-full p-3 rounded-xl hover:bg-blue-700 flex justify-start space-x-2"
                            >
                                <p>🤔</p>
                                <p>Rename</p>
                            </button>
                            <!-- archive -->
                            <button
                                class="w-full p-3 rounded-xl hover:bg-blue-700 flex justify-start space-x-2"
                            >
                                <p>🗂️</p>
                                <p>Archive</p>
                            </button>
                            <!-- delete -->
                            <button
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
