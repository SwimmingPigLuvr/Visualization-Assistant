<!-- todo -->
<!-- my plan -->
<!-- my threads -->
<!-- settings -->
<!-- hr -->
<!-- logout -->


<script lang='ts'>
    import { SignedIn, SignedOut } from "sveltefire";

    import { auth } from "$lib/firebase";
    import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
    import { cubicIn, cubicInOut, cubicOut } from "svelte/easing";
    import { fly, slide } from "svelte/transition";
    import AccountSettings from "./AccountSettings.svelte";
    import SubscriptionSettings from "./SubscriptionSettings.svelte";

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
    }

    async function signInWithMoogle() {
        const provider = new GoogleAuthProvider();
        const user = await signInWithRedirect(auth, provider);
    }


    let showUserState = false;
    let showUserInfo = false;

    let showAccountSettings = false;
    let showSubscriptionSettings = false;

    function showSettings(category: string) {
        if (category === 'account') {
            showAccountSettings = true;
            showSubscriptionSettings = false;
        } else if (category === 'subscription') {
            showSubscriptionSettings = true;
            showAccountSettings = false;
        }
    }

</script>

<div class="z-50">
    <SignedIn let:user let:signOut>
        <button 
            on:click={() => showUserInfo = true}
            class="z-20 transform transition-all duration-500 ease-in-out h-12 w-12 fixed top-2 right-2 border-slate-500 border-[1px] rounded-full  filter grayscale hover:grayscale-0 group">
            <!-- pfp -->
            <img class="transform transition-all duration-500 ease-in-out rounded-full filter invert group-hover:invert-0" src="/pfps/field-aura.png" alt="">
        </button>
               {#if showUserInfo}
                    <button on:click|stopPropagation={() => showUserInfo = false} class="inset-0 z-20 h-screen w-screen fixed top-0 left-0"></button>

                    <div 
                        in:fly={{x: 100, duration: 500, easing: cubicInOut}} 
                        out:fly={{x: 100, duration: 500, easing: cubicInOut}} 
                        class="z-30 flex flex-col space-y-4 text-gray-400 absolute top-16 right-0 w-[300px] p-4 bg-black bg-opacity-50 backdrop-blur-2xl">
                        <div class="text-left flex flex-col space-y-1">

                            <!-- account settings -->
                            <button on:click={() => showSettings('account')} class="text-left hover:text-white">account</button>
                                <div in:slide out:slide>
                                    <AccountSettings />
                                </div>

                            <!-- subscription settings -->
                            <button on:click={() => showSettings('subscription')} class="text-left hover:text-white">subscription</button>
                                <div in:slide out:slide>
                                    <SubscriptionSettings />
                                </div>

                        </div>
                        <button class="hover:bg-white hover:bg-opacity-25 bg-slate-500 p-2 bg-opacity-50 text-white" on:click={signOut}>Sign Out </button>
                    </div>
                {/if}
    </SignedIn>

    <SignedOut>
        <button class="p-2 px-4 bg-white bg-opacity-50 rounded-xl" on:click={signInWithMoogle}>sign in</button>
    </SignedOut>
</div>