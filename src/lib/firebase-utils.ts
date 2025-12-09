import { auth, firestore } from './firebase';
import type { Auth, Firestore } from 'firebase/firestore';

export function getAuth(): Auth {
    if (!auth) {
        throw new Error('Firebase auth is not initialized');
    }
    return auth;
}

export function getFirestore(): Firestore {
    if (!firestore) {
        throw new Error('Firebase firestore is not initialized');
    }
    return firestore;
}

export function isFirebaseReady(): boolean {
    return !!(auth && firestore);
}
