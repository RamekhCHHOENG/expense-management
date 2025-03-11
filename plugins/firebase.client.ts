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
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const firestore = getFirestore(app);
        let analytics;

        // Only initialize analytics on client-side
        if (process.client) {
            analytics = getAnalytics(app);
        }

        // Provide Firebase services to the Vue app
        nuxtApp.vueApp.provide(FirebaseKey, app);
        nuxtApp.vueApp.provide(AuthKey, auth);
        nuxtApp.vueApp.provide(FirestoreKey, firestore);
        if (analytics) {
            nuxtApp.vueApp.provide(AnalyticsKey, analytics);
        }

        // Also provide to Nuxt app for composition API usage
        return {
            provide: {
                firebaseApp: app,
                firebaseAuth: auth,
                firebaseFirestore: firestore,
                firebaseAnalytics: analytics,
            },
        };
    },
});
