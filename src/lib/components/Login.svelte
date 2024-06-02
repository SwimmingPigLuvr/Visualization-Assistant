<script lang="ts">
    import { auth, firestore } from "$lib/firebase";
    import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, type User, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
    import { doc, getDoc, setDoc } from "firebase/firestore";
    import { SignedIn, SignedOut } from "sveltefire";
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import { defaultVoiceID, signInModalOpen } from "$lib/stores";
    import { writable } from "svelte/store";

    // https://firebase.google.com/docs/auth/web/email-link-auth?hl=en&authuser=0&_gl=1*2fpshk*_ga*MTE1ODg4MzE0My4xNzE1Mzk1ODE4*_ga_CW55HF8NVT*MTcxNjgyMjIxOC4zMC4xLjE3MTY4MjIzMDEuNTguMC4w
    // easy!

    let email = '';
    let password = '';
    let isSignUp = false;

    async function handleFormSubmit(event: SubmitEvent) {
        event.preventDefault();
        if (isSignUp) {
            await emailSignUp(email, password);
        } else {
            await emailSignIn(email, password);
        }
    }

    async function emailSignUp(email: string, password: string) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await handleUserSignIn(userCredential.user);
        } catch (error) {
            console.error('error during email sign up: ', error);
        }
    }

    async function emailSignIn(email: string, password: string) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await handleUserSignIn(userCredential.user);
        } catch (error) {
            console.error('Error during email sign in:', error);
        }
    }

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        try {
            if (browser) {
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                let userCredential;
                if (isMobile) {
                    userCredential = await signInWithRedirect(auth, provider);
                } else {
                    userCredential = await signInWithPopup(auth, provider);
                }
                await handleUserSignIn(userCredential.user);
            }
        } catch (error) {
            console.error('Error during sign in:', error);
        }
    }

    async function handleUserSignIn(user: User) {
        console.log('User signed in:', user);

        // Check if user document exists
        const userDocRef = doc(firestore, `users/${user.uid}`);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            console.log('Creating new user document...');
            await setDoc(userDocRef, {
                username: user.displayName || "user",
                email: user.email,
                threads: [],
                voiceID: $defaultVoiceID,
                accountType: "paid",
                createdAt: new Date(),
            });
            console.log('User document created.');
        } else {
            console.log('User document already exists.');
        }
    }

    // Check for redirect results on component mount
    onMount(async () => {
        if (browser) {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    await handleUserSignIn(result.user);
                }
            } catch (error) {
                console.error('Error handling redirect result:', error);
            }
        }
    });

</script>

<SignedIn let:user let:signOut>
    <!-- <p>Hello {user.displayName}</p> -->
    <!-- <button on:click={signOut}>Sign Out</button> -->
</SignedIn>

<SignedOut>
    <button on:click={() => signInModalOpen.set(true)}>Sign In</button>

    <!-- sign in with email -->
    {#if signInModalOpen}
    <button on:click={() => signInModalOpen.set(false)} class="z-40 w-full h-screen bg-black bg-opacity-30 inset-0 fixed top-0 left-0">

        <div class="z-50 flex flex-col space-y-4 max-w-[24rem] relative m-auto p-8 border-white border-[1px] bg-black">
            <form class="text-left flex flex-col space-y-2" on:submit|preventDefault={handleFormSubmit}>
                <button class="absolute top-0 right-0 rounded-none px-4 p-2 text-xs border-white border-[1px]" on:click={() => signInModalOpen.set(false)}>X</button>
                <label for="email">email</label>
                <input class="text-black px-2 p-1" type="email" name="email" id="email" bind:value={email}>
                <label for="password">password</label>
                <input class="text-black px-2 p-1" type="password" name="password" id="password" bind:value={password}>
                <button class="border-white border-[1px] p-1" type="submit">submit</button>
            </form>

            <p>or use</p>
            <!-- google -->
            <button class="p-2 px-4 bg-slate-400 text-white rounded-xl" on:click={signInWithGoogle}>Google</button>
            <p>{isSignUp ? "Already have an account?" : "Don't have an account?"} <a href="#" on:click={() => isSignUp = !isSignUp}>{isSignUp ? "Sign In" : "Sign Up"}</a></p>
        </div>
    </button>
    {/if}
</SignedOut>
