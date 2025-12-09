<script lang="ts">
    import "../app.css";
    import {
        FirebaseApp,
        SignedIn,
        SignedOut,
        docStore,
        userStore,
    } from "sveltefire";
    import { auth, firestore } from "$lib/firebase";
    import { doc, getDoc, setDoc } from "firebase/firestore";
    import { onAuthStateChanged } from "firebase/auth";
    import type { User } from "firebase/auth";
    import {
        currentThread,
        accountType,
        userNameStore,
        userSettings,
        userThreads,
        defaultVoiceID,
    } from "$lib/stores";
    import { onMount } from "svelte";
    import { get, writable, type Readable } from "svelte/store";
    import { inject } from "@vercel/analytics";
    import { browser, dev } from "$app/environment";

    inject({ mode: dev ? "development" : "production" });

    let loadingUserData = writable<boolean>(false);
    let user: Readable<User | null> | null = null;

    onMount(() => {
        if (browser && auth) {
            user = userStore(auth);
            user.subscribe(($user) => {
                if ($user) {
                    loadUserData($user);
                } else {
                    console.log('user signed out')
                    userNameStore.set('');
                    accountType.set('free');
                }
            });
        }
    });

    async function loadUserData(user: User) {
        if (!firestore) return;
        loadingUserData.set(true);
        const userRef = doc(firestore, `users/${user.uid}`);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            userNameStore.set(userData.username);
            userSettings.set(userData.settings);
            userThreads.set(userData.threads);
            accountType.set(userData.accountType);
        } else {
            console.log("no such document!");
            userNameStore.set("user");
            // create new user
            await setDoc(userRef, {
                username: user.displayName || "user",
                email: user.email,
                threads: [],
                settings: {
                    voiceID: get(defaultVoiceID),
                },
                accountType: "paid",
                createdAt: new Date(),
            });
            console.log("user created");
            // refetch user
            const newDocSnap = await getDoc(userRef);
            const newUserData = newDocSnap.data();
            userNameStore.set(newUserData?.username);
            userSettings.set(newUserData?.settings);
            userThreads.set(newUserData?.threads);
            accountType.set(newUserData?.accountType);
        }
        loadingUserData.set(false);
        console.log("user data loaded");
    }

    $: if (browser && user && !$user) {
        console.log("user signed out");
        userNameStore.set("");
        // userSettings.set("");
        // userThreads.set("");
        accountType.set("");
    }
</script>

{#if browser}
    <FirebaseApp {auth} {firestore}>
        <slot />
        <SignedIn let:user></SignedIn>
        <SignedOut></SignedOut>
    </FirebaseApp>
{:else}
    <slot />
{/if}
