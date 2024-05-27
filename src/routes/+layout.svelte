<script lang="ts">
    import "../app.css"
    import { FirebaseApp, SignedIn, SignedOut, docStore, userStore } from "sveltefire";
    import { auth, firestore } from "$lib/firebase";
    import { doc, getDoc, setDoc } from "firebase/firestore";
    import { onAuthStateChanged } from "firebase/auth";
    import { currentThread, accountType, userNameStore, userSettings, userThreads, defaultVoiceID } from "$lib/stores";
    import { onMount } from "svelte";
    import { get, writable } from "svelte/store";

    let loadingUserData = writable<boolean>(false);

    const user = userStore(auth);

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            loadingUserData.set(true);
            const userRef = doc(firestore, `users/${user.uid}`);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                userNameStore.set(userData.username);
                userSettings.set(userData.settings);
                userThreads.set(userData.threads);
                accountType.set(userData.accountType);
                loadingUserData.set(false);
            } else {
                console.log("No such document!");
                userNameStore.set('user');  // Default or error case
                // Create a new document for the user
                await setDoc(userRef, {
                    username: user.displayName || "user",
                    email: user.email,
                    threads: [],
                    settings: {
                        voiceID: get(defaultVoiceID),
                    },
                    accountType: "free",  // Set default account type
                    createdAt: new Date()
                });
                console.log("User document created.");
                // Re-fetch the user data
                const newDocSnap = await getDoc(userRef);
                const newUserData = newDocSnap.data();
                userNameStore.set(newUserData?.username);
                userSettings.set(newUserData?.settings);
                userThreads.set(newUserData?.threads);
                accountType.set(newUserData?.accountType);
                loadingUserData.set(false);
            }
            console.log('user SIGNED IN');
        } else {
            console.log('user SIGNED OUT');
            userNameStore.set('');
        }
    });
</script>

<FirebaseApp {auth} {firestore}>
    <slot />
    <SignedIn let:user>
        <!-- you're signed in -->
    </SignedIn>
    <SignedOut>
        <!-- <div>user not signed in</div> -->
    </SignedOut>
</FirebaseApp>
