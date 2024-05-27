<script lang="ts">
    import { auth, firestore } from "$lib/firebase";
    import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, type User } from "firebase/auth";
    import { doc, getDoc, setDoc } from "firebase/firestore";
    import { SignedIn, SignedOut } from "sveltefire";
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import { defaultVoiceID } from "$lib/stores";

    // https://firebase.google.com/docs/auth/web/email-link-auth?hl=en&authuser=0&_gl=1*2fpshk*_ga*MTE1ODg4MzE0My4xNzE1Mzk1ODE4*_ga_CW55HF8NVT*MTcxNjgyMjIxOC4zMC4xLjE3MTY4MjIzMDEuNTguMC4w
    // easy!

    let modalOpen = false;

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
                accountType: "free",
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
    <p>Hello {user.displayName}</p>
    <button on:click={signOut}>Sign Out</button>
</SignedIn>

<SignedOut>
    <button on:click={() => modalOpen = true}>Sign In</button>

    <!-- sign in with email -->
    {#if modalOpen}
        <div class="flex flex-col space-y-2 max-w-[15rem] relative m-auto p-8 border-white border-[1px]">
            <form class="flex flex-col space-y-2"  action="submit">
                <button class="absolute top-0 right-0 rounded-none p-2 text-xs border-white border-[1px]" on:click={() => modalOpen = false}>X</button>
                <label for="email">email</label>
                <input class="text-black px-2 p-1" type="email" name="email" id="email">
                <label for="password">password</label>
                <input class="text-black px-2 p-1" type="password" name="password" id="password">
                <button class="border-white border-[1px] p-1" type="submit">submit</button>
            </form>

            <p>or</p>
            <!-- google -->
            <button class="p-2 px-4 bg-slate-400 text-white rounded-xl" on:click={signInWithGoogle}>Google</button>
        </div>
    {/if}
</SignedOut>
