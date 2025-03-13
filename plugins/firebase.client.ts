import type { Analytics } from "firebase/analytics";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import { getAuth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
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

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBcpxqsx5fhi5Iiis7LS0YJHQY1Q8ClJes",
    authDomain: "expense-management-b84bc.firebaseapp.com",
    projectId: "expense-management-b84bc",
    storageBucket: "expense-management-b84bc.firebasestorage.app",
    messagingSenderId: "721998265859",
    appId: "1:721998265859:web:cc220b9a328b40d952d836",
    measurementId: "G-NT7GQ1P5M6",
};

export default defineNuxtPlugin({
    name: "firebase",
    enforce: "pre",
    async setup(nuxtApp) {
        try {
            console.log("Initializing Firebase...");
            // Initialize Firebase
            const app = initializeApp(firebaseConfig);

            // Initialize services
            const auth = getAuth(app);
            const db = getFirestore(app);
            let analytics = null;

            console.log("Firebase services initialized");

            // Only initialize analytics on client-side
            if (process.client) {
                analytics = getAnalytics(app);
            }

            // Wait for auth to be ready
            await new Promise<void>((resolve) => {
                const unsubscribe = auth.onAuthStateChanged(() => {
                    unsubscribe();
                    resolve();
                });
            });

            console.log("Auth state ready");

            // Provide services using Vue's provide/inject pattern
            nuxtApp.vueApp.provide(FirebaseKey, app);
            nuxtApp.vueApp.provide(AuthKey, auth);
            nuxtApp.vueApp.provide(FirestoreKey, db);
            nuxtApp.vueApp.provide(FirebaseReadyKey, true);
            if (analytics) {
                nuxtApp.vueApp.provide(AnalyticsKey, analytics);
            }

            console.log("Firebase services provided to Vue app");

            // Also provide through Nuxt's plugin system
            return {
                provide: {
                    firebaseApp: app,
                    firebaseAuth: auth,
                    firebaseDb: db,
                    firebaseAnalytics: analytics,
                    firebaseReady: true,
                },
            };
        } catch (error) {
            console.error("Error initializing Firebase:", error);
            throw error;
        }
    },
});
