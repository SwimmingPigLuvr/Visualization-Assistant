import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { browser } from "$app/environment";

let app;
let auth;
let firestore;
let storage;

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
if (browser) {
    const firebaseConfig = {
        apiKey: "AIzaSyBW92KU1AP-kOvqt7Kwiip6nlOV1m_2lj8",
        authDomain: window.location.hostname === 'localhost'
            ? 'localhost' 
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
