import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { browser } from "$app/environment";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;
let storage: FirebaseStorage | undefined;

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
if (browser) {
    const firebaseConfig = {
        apiKey: "AIzaSyBW92KU1AP-kOvqt7Kwiip6nlOV1m_2lj8",
        authDomain: window.location.hostname === 'localhost'
            ? 'localhost:5173' 
            : "visualization-assistant.vercel.app",
        projectId: "visualization-assistant",
        storageBucket: "visualization-assistant.appspot.com",
        messagingSenderId: "905179929921",
        appId: "1:905179929921:web:dd441ba7a1d7f50d2455c0",
        measurementId: "G-YC54QT6Z5T"
    };

    // init firebase
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
    storage = getStorage(app);

    setPersistence(auth, browserSessionPersistence);
}

export { app, auth, firestore, storage };
