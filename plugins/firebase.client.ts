import { getAnalytics } from "firebase/analytics";
import { initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

let app: any;
let auth: any;
let firestore: any;
let analytics: any;

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();

    if (!app) {
        // Initialize Firebase
        app = initializeApp(config.public.firebase as FirebaseOptions);

        // Initialize services
        auth = getAuth(app);
        firestore = getFirestore(app);

        if (process.client) {
            analytics = getAnalytics(app);
        }
    }

    return {
        provide: {
            firebase: app,
            auth,
            firestore,
            analytics: process.client ? analytics : undefined,
        },
    };
});
