<script lang="ts">
    import { auth, firestore } from "$lib/firebase";
    import {
        GoogleAuthProvider,
        signInWithRedirect,
        getRedirectResult,
        type User,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        setPersistence,
        onAuthStateChanged,
        browserSessionPersistence,
    } from "firebase/auth";
    import { doc, getDoc, setDoc } from "firebase/firestore";
    import { SignedIn, SignedOut } from "sveltefire";
    import { browser } from "$app/environment";
    import { afterUpdate, onMount } from "svelte";
    import { defaultVoiceID, signInModalOpen } from "$lib/stores";
    import { fade, fly } from "svelte/transition";
    import { backOut } from "svelte/easing";

    const provider = new GoogleAuthProvider();

    let email = "";
    let password = "";
    let isSignUp = false;
    let emailInput: HTMLElement | null = null;

    async function handleFormSubmit(event: SubmitEvent) {
        event.preventDefault();
        if (!email) {
            emailInput?.focus();
            return;
        }
        if (isSignUp) {
            await emailSignUp(email, password);
        } else {
            await emailSignIn(email, password);
        }
    }

    async function emailSignUp(email: string, password: string) {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );
            await handleUserSignIn(userCredential.user);
        } catch (error) {
            console.error("error during email sign up: ", error);
        }
    }

    async function emailSignIn(email: string, password: string) {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );
            await handleUserSignIn(userCredential.user);
        } catch (error) {
            console.error("Error during email sign in:", error);
        }
    }

    async function signInWithGoogle() {
        console.log("redirect sign in...");
        await setPersistence(auth, browserSessionPersistence);
        await signInWithRedirect(auth, provider);
    }

    async function handleUserSignIn(user: User) {
        console.log("User signed in:", user);

        // Check if user document exists
        const userDocRef = doc(firestore, `users/${user.uid}`);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            console.log("Creating new user document...");
            await setDoc(userDocRef, {
                username: user.displayName || "user",
                email: user.email,
                threads: [],
                voiceID: $defaultVoiceID,
                accountType: "paid",
                createdAt: new Date(),
            });
            console.log("User document created.");
        } else {
            console.log("User document already exists.");
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
                console.error("Error handling redirect result:", error);
            }
        }
    });

    // Focus the email input when the modal is opened
    afterUpdate(() => {
        if ($signInModalOpen && emailInput) {
            emailInput?.focus();
        }
    });
</script>

<SignedOut>
    <button
        class="z-50 absolute top-2 right-3"
        on:click={() => signInModalOpen.set(true)}>Sign In</button
    >

    <!-- sign in with email -->
    {#if $signInModalOpen}
        <button
            in:fade
            on:click={() => signInModalOpen.set(false)}
            class="z-40 w-full h-screen bg-black bg-opacity-50 inset-0 fixed top-0 left-0 p-4"
        >
            <!-- modal -->
            <button
                in:fly={{ y: 100, duration: 1000, easing: backOut }}
                on:click|stopPropagation
                class="glow top-0 -translate-y-1/4 left-1/2 -translate-x-1/2 z-50 flex items-center rounded-2xl flex-col space-y-4 w-full max-w-[28rem] relative p-4 sm:p-12 border-slate-600 border-[1px] bg-black"
            >
                <form
                    class="text-left flex flex-col space-y-2 w-full"
                    on:submit|preventDefault={handleFormSubmit}
                >
                    <!-- <button
                        class="absolute top-0 right-1 rounded-none p-3"
                        on:click={() => signInModalOpen.set(false)}>X</button
                    > -->
                    <!-- <label for="email">email</label> -->
                    <input
                        class="text-black p-3 rounded-xl"
                        placeholder="Type your email..."
                        type="email"
                        name="email"
                        id="email"
                        bind:this={emailInput}
                        bind:value={email}
                    />
                    <!-- <label for="password">password</label> -->
                    <input
                        class="text-black p-3 rounded-xl"
                        placeholder="Password"
                        type="password"
                        name="password"
                        id="password"
                        bind:value={password}
                    />
                    <button
                        class="font-sans font-bold text-white text-xl bg-blue-700 transform transition-all duration-500 ease-in-out border-transparent border-[1px] hover:border-white hover:border-[1px] p-3 rounded-xl"
                        type="submit"
                    >
                        <p class="">Visualize Your Goals now ➔</p>
                    </button>
                </form>

                <p>or</p>
                <!-- google -->
                <button
                    class="hover:bg-black hover:text-white hover:border-white border-[1px] flex space-x-2 justify-center items-center font-bold text-xl p-3 w-full bg-white text-black font-sans rounded-2xl"
                    on:click={signInWithGoogle}
                >
                    <img
                        src="images/logos/Google_g_logo.png"
                        alt="google G logo"
                        class="h-8"
                    />
                    <p>Sign in with Google</p>
                </button>
                <p class="text-xs -translate-y-1">
                    {isSignUp
                        ? "Already have an account?"
                        : "Don't have an account?"}
                    <button on:click={() => (isSignUp = !isSignUp)}
                        ><span class="text-lime-200"
                            >{isSignUp ? "Sign In" : "Sign Up"}</span
                        ></button
                    >
                </p>
            </button>
        </button>
    {/if}
</SignedOut>
