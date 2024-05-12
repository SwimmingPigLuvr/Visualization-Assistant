<!-- perform api call to list all of user's threads -->
<script lang="ts">
    import { auth, db } from "$lib/firebase";
    import { currentThread, userThreads } from "$lib/stores";
    import { arrayRemove, doc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { docStore, userStore } from "sveltefire";
    import { map } from "zod";

    const user = userStore(auth);

    let showDeleteButton = false;

    let firstMessage = writable<string>('');
    
    export let threadID: string;

    async function getThreadMessages() {
        try {
            const response = await fetch('/api/threads/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    threadID: threadID,
                })
            });

            const data = await response.json();
            
            firstMessage.set(data.body?.data?.[1]?.content?.[0]?.text?.value ?? '');
        }
         catch (error) {
            console.error('error fetching thread messages', error);
        }

    }

    async function deleteThread(threadID: string) {
        try {
            const response = await fetch('/api/threads/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    threadID: threadID,
                })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();

            // delete from firestore
            if (result.success) {
                const userRef = doc(db, `users/${$user!.uid}`);

                await updateDoc(userRef, {
                    threads: arrayRemove(threadID)
                });

            }
        } catch (error) {
            console.error('failed to delete the thread: ', error);
        }
    }


    async function setThread(threadID: string) {
        currentThread.set(threadID);
    }

    getThreadMessages();

</script>

{#if $firstMessage !== ''}
    <button 
        on:mouseenter={() => showDeleteButton = true} 
        on:mouseleave={() => showDeleteButton = false} 
        on:click={() => setThread(threadID)} 
        class="rounded-xl hover:bg-sky-400 w-full max-w-80 text-left relative p-2">
                <p class="w-full">{$firstMessage}</p>
            {#if showDeleteButton}
                <button on:click={() => deleteThread(threadID)} class="absolute h-7 w-10 px-2 top-0 right-0 bg-white text-black text-xs bg-opacity-100 border-black">del</button>
            {/if}
    </button>
{/if}