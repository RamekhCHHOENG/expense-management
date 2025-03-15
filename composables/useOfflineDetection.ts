import { FirebaseError } from "firebase/app";
import { onMounted, onUnmounted } from "vue";

export function useOfflineDetection() {
    const router = useRouter();
    const isOffline = ref(false);

    const handleOffline = () => {
        isOffline.value = true;
        router.push("/offline");
    };

    const handleOnline = () => {
        isOffline.value = false;
        if (router.currentRoute.value.path === "/offline") {
            router.back();
        }
    };

    const handleFirebaseError = (error: unknown) => {
        if (error instanceof FirebaseError) {
            // Handle specific Firebase errors
            switch (error.code) {
                case "failed-precondition":
                case "unavailable":
                case "deadline-exceeded":
                    if (!navigator.onLine) {
                        handleOffline();
                    }
                    break;
                default:
                    console.error("Firebase error:", error);
            }
        }
    };

    onMounted(() => {
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Check initial state
        if (!navigator.onLine) {
            handleOffline();
        }
    });

    onUnmounted(() => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
    });

    return {
        isOffline,
        handleFirebaseError,
    };
}
