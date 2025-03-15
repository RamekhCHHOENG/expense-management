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
                    // Check for offline error message
                    if (error.message?.includes("client is offline")) {
                        navigateTo("/offline");
                    } else {
                        console.error("Firebase error:", error);
                    }
            }
        } else if (
            error instanceof Error &&
            error.message?.includes("client is offline")
        ) {
            navigateTo("/offline");
        } else {
            console.error("Application error:", error);
            console.error("Vue component:", instance);
            console.error("Error info:", info);
        }
    };
});
