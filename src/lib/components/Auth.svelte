<script lang="ts">
    import { auth } from "$lib/firebase";
    import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";

    export async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
        console.log(user);
    }

</script>

<h2>Login</h2>
<button on:click={signInWithGoogle}>Log in with Google</button>