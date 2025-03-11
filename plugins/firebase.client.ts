import { getAnalytics } from "firebase/analytics";
import { initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import type { InjectionKey } from "vue";

// Define injection keys
export const FirebaseKey: InjectionKey<ReturnType<typeof initializeApp>> =
    Symbol("Firebase");
export const AuthKey: InjectionKey<Auth> = Symbol("Auth");
export const FirestoreKey: InjectionKey<Firestore> = Symbol("Firestore");
export const AnalyticsKey: InjectionKey<any> = Symbol("Analytics");

// Initialize Firebase outside the plugin to ensure it's available immediately
let firebaseApp: ReturnType<typeof initializeApp> | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;
let analytics: any = null;

export default defineNuxtPlugin({
    name: "firebase",
    enforce: "pre",
    async setup(nuxtApp) {
        // Only initialize once
        if (!firebaseApp) {
            const config = useRuntimeConfig();

            try {
                // Validate Firebase config
                const firebaseConfig = config.public
                    .firebase as FirebaseOptions;
                if (!firebaseConfig.apiKey) {
                    throw new Error(
                        "Firebase API key is missing. Please check your environment variables."
                    );
                }

                // Initialize Firebase
                firebaseApp = initializeApp(firebaseConfig);
                auth = getAuth(firebaseApp);
                firestore = getFirestore(firebaseApp);

                if (process.client) {
                    analytics = getAnalytics(firebaseApp);
                }
            } catch (error) {
                console.error("Firebase initialization error:", error);
                throw error;
            }
        }

        return {
            provide: {
                firebaseApp: firebaseApp!,
                firebaseAuth: auth!,
                firebaseFirestore: firestore!,
                firebaseAnalytics: analytics,
            },
        };
    },
});
