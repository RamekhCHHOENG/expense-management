import { FirebaseError } from "firebase/app";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
        // Handle Firebase errors
        if (error instanceof FirebaseError) {
            switch (error.code) {
                case "failed-precondition":
                case "unavailable":
                case "deadline-exceeded":
                    if (!navigator.onLine) {
                        navigateTo("/offline");
                    }
                    break;
                default:
                    console.error("Firebase error:", error);
            }
        } else {
            console.error("Application error:", error);
            console.error("Vue component:", instance);
            console.error("Error info:", info);
        }
    };
});
