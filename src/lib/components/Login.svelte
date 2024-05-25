<script lang="ts">
    import { auth, db } from "$lib/firebase";
    import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
    import { doc, getDoc, setDoc } from "firebase/firestore";
    import { SignedIn, SignedOut } from "sveltefire";

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            console.log('User signed in:', user);

            // Check if user document exists
            const userDocRef = doc(db, `users/${user.uid}`);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                console.log('Creating new user document...');
                await setDoc(userDocRef, {
                    username: user.displayName || "user",
                    email: user.email,
                    threads: [],
                    voiceID: "default_voice_id",  // Set default voice ID
                    accountType: "free",  // Set default account type
                    createdAt: new Date()
                });
                console.log('User document created.');
            } else {
                console.log('User document already exists.');
            }
        } catch (error) {
            console.error('Error during sign in:', error);
        }
    }
</script>

<SignedIn let:user let:signOut>
    <p>Hello {user.displayName}</p>
    <button on:click={signOut}>Sign Out</button>
</SignedIn>

<SignedOut>
    <button class="p-2 px-4 bg-white bg-opacity-50 rounded-xl" on:click={signInWithGoogle}>Sign in here</button>
</SignedOut>
