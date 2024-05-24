<script lang="ts">
    import { auth, db } from "$lib/firebase";
    import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
    import { doc, getDoc, setDoc } from "firebase/firestore";
    import { SignedIn, SignedOut } from "sveltefire";

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;

        // Check if the user document exists
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        // If the document does not exist, create it
        if (!userDoc.exists()) {
            const defaultData = {
                accountType: "free",
                photoURL: user.photoURL,
                settings: {
                    voiceID: "28VLndcKwmm1RxLQoOn"
                },
                threads: [],
                username: user.displayName || "user" // Using display name or a default value
            };

            await setDoc(userDocRef, defaultData);
        }
    }

</script>


<SignedIn let:user let:signOut>
    <p>Hello {user.displayName}</p>
    <button on:click={signOut}>Sign Out </button>
</SignedIn>

<SignedOut>
    <button class="p-2 px-4 bg-white bg-opacity-50 rounded-xl" on:click={signInWithGoogle}>sign in</button>
</SignedOut>
