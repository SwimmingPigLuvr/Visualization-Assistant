<script lang="ts">
    import "../app.css"
    import { FirebaseApp, SignedIn, docStore, userStore } from "sveltefire";
    import { initializeApp } from "firebase/app";
    import { doc, getDoc, getFirestore, writeBatch } from "firebase/firestore";
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import { db } from "$lib/firebase";
    import { currentThread, userNameStore, userSettings, userThreads } from "$lib/stores";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    let loadingUserData = writable<boolean>(false);

    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyBW92KU1AP-kOvqt7Kwiip6nlOV1m_2lj8",
        authDomain: "visualization-assistant.firebaseapp.com",
        projectId: "visualization-assistant",
        storageBucket: "visualization-assistant.appspot.com",
        messagingSenderId: "905179929921",
        appId: "1:905179929921:web:dd441ba7a1d7f50d2455c0",
        measurementId: "G-YC54QT6Z5T"
    };

    // init firebase
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
                    userThreads.set(userData.threads);
                    userSettings.set(userData.settings);
                    loadingUserData.set(false);
                } else {
                    console.log("No such document!");
                    userNameStore.set('user');  // Default or error case
                }
            });
            console.log('user SIGNED IN');
        } else {
            console.log('user SIGNED OUT');
            userNameStore.set('');
        }
    });

    async function syncThreadData() {
        console.log('hello from sync thread data, $userThreads: ', $userThreads);
        const batch = writeBatch(db);
        batch.set(doc(db, `users/${$user!.uid}`), {
            threads: $userThreads
        }, { merge: true });

        await batch.commit();
    }

</script>

<FirebaseApp {auth} {firestore}>
    <slot />
    <SignedIn let:user>
        howdy
    </SignedIn>
</FirebaseApp>

<!-- user layout to import the settings and data of a signed in user -->