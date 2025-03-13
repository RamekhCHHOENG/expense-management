import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { inject } from "vue";
import { useAuthStore } from "~/stores/auth";
import { AuthKey, FirestoreKey } from "./firebase.client";

export default defineNuxtPlugin({
    name: "auth",
    enforce: "post",
    async setup(nuxtApp) {
        try {
            // Try Vue's inject first
            let auth = inject(AuthKey) as Auth | undefined;
            let db = inject(FirestoreKey) as Firestore | undefined;

            // If Vue's inject fails, try Nuxt's plugin system
            if (!auth || !db) {
                const { $firebaseAuth, $firebaseDb } = nuxtApp;
                auth = $firebaseAuth as Auth;
                db = $firebaseDb as Firestore;
            }

            // Ensure services are available
            if (!auth || !db) {
                throw new Error("Firebase services not properly initialized");
            }

            const authStore = useAuthStore();

            // Set the auth instance
            authStore.setAuth(auth);

            // Initialize auth state
            await authStore.init();

            return {
                provide: {
                    auth: authStore,
                },
            };
        } catch (error) {
            console.error("Error initializing auth:", error);
            throw error;
        }
    },
});
