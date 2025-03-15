import type { Analytics } from "firebase/analytics";
import type { FirebaseOptions } from "firebase/app";
import { initializeApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import { getAuth } from "firebase/auth";
import {
    enableIndexedDbPersistence,
    initializeFirestore,
    type Firestore,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import type { InjectionKey } from "vue";

// Injection keys for Firebase services
export const FirebaseKey: InjectionKey<ReturnType<typeof initializeApp>> =
    Symbol("firebase-app");
export const AuthKey: InjectionKey<Auth> = Symbol("firebase-auth");
export const FirestoreKey: InjectionKey<Firestore> =
    Symbol("firebase-firestore");
export const AnalyticsKey: InjectionKey<Analytics> =
    Symbol("firebase-analytics");
export const FirebaseReadyKey: InjectionKey<boolean> = Symbol("firebase-ready");

export default defineNuxtPlugin({
    name: "firebase",
    enforce: "pre",
    async setup(nuxtApp) {
        const config = useRuntimeConfig();

        // Validate required Firebase configuration
        if (!config.public.firebaseApiKey) {
            console.error("Firebase API Key is missing");
            throw new Error("Firebase configuration is incomplete");
        }

        const firebaseConfig: FirebaseOptions = {
            apiKey: config.public.firebaseApiKey,
            authDomain: config.public.firebaseAuthDomain,
            projectId: config.public.firebaseProjectId,
            storageBucket: config.public.firebaseStorageBucket,
            messagingSenderId: config.public.firebaseMessagingSenderId,
            appId: config.public.firebaseAppId,
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);

        // Initialize Firestore with settings for offline support
        const db = initializeFirestore(app, {
            experimentalForceLongPolling: true,
            cacheSizeBytes: 50000000, // 50 MB cache size
        });

        // Enable offline persistence
        try {
            await enableIndexedDbPersistence(db);
            console.log("Offline persistence enabled");
        } catch (err: any) {
            if (err.code === "failed-precondition") {
                console.warn(
                    "Multiple tabs open, persistence can only be enabled in one tab at a time."
                );
            } else if (err.code === "unimplemented") {
                console.warn(
                    "The current browser does not support offline persistence"
                );
            } else {
                console.error("Error enabling offline persistence:", err);
            }
        }

        const auth = getAuth(app);
        const storage = getStorage(app);

        // Provide services using Vue's provide/inject pattern
        nuxtApp.vueApp.provide(FirebaseKey, app);
        nuxtApp.vueApp.provide(AuthKey, auth);
        nuxtApp.vueApp.provide(FirestoreKey, db);
        nuxtApp.vueApp.provide(FirebaseReadyKey, true);

        return {
            provide: {
                firebaseApp: app,
                firebaseAuth: auth,
                firebaseDb: db,
                firebaseStorage: storage,
            },
        };
    },
});
