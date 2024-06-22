<script lang="ts">
    import { auth, firestore } from "$lib/firebase";
    import { currentThread, userNameStore, userThreads } from "$lib/stores";
    import {
        collection,
        doc,
        getDoc,
        getDocs,
        writeBatch,
    } from "firebase/firestore";
    import { get, writable } from "svelte/store";
    import { slide } from "svelte/transition";
    import { SignedIn, docStore, userStore } from "sveltefire";

    const user = userStore(auth);
    const userDoc = docStore(firestore, `users/${$user!.uid}`);
    $: username = $userDoc?.username;

    $: if (username) {
        userNameStore.set(username);
    }

    $: threads = $userDoc?.threads;

    const myThread = get(currentThread);
    const myThreads = get(userThreads);

    let newUsername = "";
    let loading = false;
    let isAvailable = false;

    const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    $: isTouched = newUsername.length > 0;
    $: isValid =
        newUsername?.length > 2 &&
        newUsername.length < 16 &&
        re.test(newUsername);
    $: isTaken = isValid && !isAvailable && !loading;

    let debounceTimer: NodeJS.Timeout;

    async function checkAvailability() {
        isAvailable = false;
        clearTimeout(debounceTimer);
        loading = true;

        debounceTimer = setTimeout(async () => {
            const ref = doc(firestore, "usernames", newUsername);
            const exists = await getDoc(ref).then((doc) => doc.exists());

            isAvailable = !exists;
            loading = false;
        }, 700);
    }

    async function confirmUsername() {
        const currentUid = $user?.uid;
        const batch = writeBatch(firestore);

        // Check if the current UID already has a username
        const usernamesSnapshot = await getDocs(
            collection(firestore, "usernames"),
        );
        const existingUsernameDoc = usernamesSnapshot.docs.find(
            (doc) => doc.data().uid === currentUid,
        );

        if (existingUsernameDoc) {
            // If the UID already has a username, delete the old one
            batch.delete(existingUsernameDoc.ref);
        }

        batch.set(doc(firestore, "usernames", newUsername), {
            uid: $user?.uid,
        });
        batch.update(doc(firestore, "users", $user!.uid), {
            username: newUsername,
        });

        await batch.commit();
    }

    let randomUsernames = ["milady", "remilio"];

    let randomUsername: string;

    function getRandomUsername() {
        randomUsername =
            randomUsernames[Math.floor(Math.random() * randomUsernames.length)];
    }

    getRandomUsername();

    async function uploadPhoto() {}
</script>

<div class="px-4">
    <p>signed in as <span class="text-white">{username}</span></p>
    <form
        class="flex flex-col space-y-2 w-full"
        on:submit|preventDefault={confirmUsername}
    >
        <div class="flex space-x-2">
            {#if username === ""}
                <p>create</p>
            {:else}
                <p>edit</p>
            {/if}
            <p>username</p>
            <input
                type="text"
                placeholder={username}
                class="underline text-white font-bold bg-transparent outline-none border-none"
                bind:value={newUsername}
                on:input={checkAvailability}
            />
        </div>

        <div class="flex space-x-2 items-center">
            {#if isTouched}
                {#if !isValid}
                    <div in:slide out:slide class="flex flex-col">
                        <p class="text-red-400 text-xs">
                            must be 3-16 characters long
                        </p>
                        <p class="text-red-400 text-xs">aplhanumeric only</p>
                    </div>
                {:else}
                    <p>status:</p>
                    {#if loading}
                        <img
                            class="animate-spin h-6 w-6 rounded-full"
                            src="/icons/gigaBubble.png"
                            alt=""
                        />
                    {/if}
                    {#if isAvailable}
                        <p class="text-lime-400">available</p>
                    {:else if !loading}
                        <p class="text-red-400">username taken</p>
                    {/if}
                {/if}
            {/if}
        </div>

        {#if isValid && isAvailable}
            <button
                class="bg-lime-600 text-slate-200 text-xs p-1 hover:bg-lime-400"
                >confirm username <span class="text-white">{newUsername}</span
                ></button
            >
        {/if}
    </form>
</div>
