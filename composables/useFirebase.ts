import type { Analytics } from "firebase/analytics";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { inject } from "vue";
import {
    AnalyticsKey,
    AuthKey,
    FirebaseKey,
    FirestoreKey,
} from "~/plugins/firebase.client";

export const useFirebase = () => {
    // Try Vue's inject first
    let app = inject(FirebaseKey);
    let auth = inject(AuthKey);
    let db = inject(FirestoreKey);
    let analytics = inject(AnalyticsKey, null);

    // If Vue's inject fails, try Nuxt's plugin system
    if (!app || !auth || !db) {
        const nuxtApp = useNuxtApp();
        app = nuxtApp.$firebaseApp as FirebaseApp;
        auth = nuxtApp.$firebaseAuth as Auth;
        db = nuxtApp.$firebaseDb as Firestore;
        analytics = nuxtApp.$firebaseAnalytics as Analytics | null;
    }

    // If both methods fail, throw an error
    if (!app || !auth || !db) {
        throw new Error("Firebase services not initialized");
    }

    return {
        app,
        auth,
        db,
        analytics,
    };
};
