import { inject } from "vue";
import { useAuthStore } from "~/stores/auth";
import { AuthKey, FirebaseReadyKey, FirestoreKey } from "./firebase.client";

export default defineNuxtPlugin({
    name: "auth",
    enforce: "post",
    async setup(nuxtApp) {
        try {
            // Wait for Firebase to be ready
            const isFirebaseReady = inject(FirebaseReadyKey);
            if (!isFirebaseReady) {
                throw new Error("Firebase is not ready");
            }

            // Get Firebase services
            const auth = inject(AuthKey);
            const db = inject(FirestoreKey);

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
