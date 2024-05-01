<script lang="ts">
    import { auth } from "$lib/firebase";
    import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
    import { SignedIn, SignedOut } from "sveltefire";

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
        console.log(user);
    }

</script>


<SignedIn let:user let:signOut>
    <p>Hello {user.displayName}</p>
    <button on:click={signOut}>Sign Out </button>
</SignedIn>

<SignedOut>
    <button class="p-2 px-4 bg-white bg-opacity-50 rounded-xl" on:click={signInWithGoogle}>sign in</button>
</SignedOut>
