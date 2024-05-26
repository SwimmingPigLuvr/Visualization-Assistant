<script lang="ts">
    import "../app.css"
    import { FirebaseApp, SignedIn, SignedOut, docStore, userStore } from "sveltefire";
    import { initializeApp } from "firebase/app";
    import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import { db } from "$lib/firebase";
    import { currentThread, accountType, userNameStore, userSettings, userThreads, defaultVoiceID } from "$lib/stores";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    let loadingUserData = writable<boolean>(false);

    const firebaseConfig = {
        apiKey: "AIzaSyBW92KU1AP-kOvqt7Kwiip6nlOV1m_2lj8",
        authDomain: "visualization-assistant.firebaseapp.com",
        projectId: "visualization-assistant",
        storageBucket: "visualization-assistant.appspot.com",
        messagingSenderId: "905179929921",
        appId: "1:905179929921:web:dd441ba7a1d7f50d2455c0",
        measurementId: "G-YC54QT6Z5T"
    };

    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    const auth = getAuth(app);

    const user = userStore(auth);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            loadingUserData.set(true);
            const userRef = doc(firestore, `users/${user.uid}`);
            getDoc(userRef).then(docSnap => {
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
                    setDoc(userRef, {
                        username: user.displayName || "user",
                        email: user.email,
                        threads: [],
                        settings: {
                            voiceID: $defaultVoiceID,
                        },
                        accountType: "paid",
                        createdAt: new Date()
                    }).then(() => {
                        console.log("User document created.");
                        // Re-fetch the user data
                        getDoc(userRef).then(docSnap => {
                            const userData = docSnap.data();
                            userNameStore.set(userData?.username);
                            userSettings.set(userData?.settings);
                            userThreads.set(userData?.threads);
                            accountType.set(userData?.accountType);
                            loadingUserData.set(false);
                        });
                    }).catch(error => {
                        console.error("Error creating user document:", error);
                        loadingUserData.set(false);
                    });
                }
            });
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
    <SignedOut >
        <!-- <div>user not signed in</div> -->
    </SignedOut>
</FirebaseApp>
