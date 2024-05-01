<script>
    import "../app.css"
    import { FirebaseApp } from "sveltefire";
    import { initializeApp } from "firebase/app";
    import { getFirestore } from "firebase/firestore";
    import { getAuth } from "firebase/auth";

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
</script>

<FirebaseApp {auth} {firestore}>
    <slot />
</FirebaseApp>