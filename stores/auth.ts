import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    GithubAuthProvider,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    type User,
} from "firebase/auth";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null as User | null,
        loading: true,
        error: null as string | null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
    },

    actions: {
        async init() {
            const { $auth } = useNuxtApp();
            if (!$auth) {
                console.error("Auth not initialized");
                this.loading = false;
                return;
            }

            return new Promise<void>((resolve) => {
                const unsubscribe = onAuthStateChanged(
                    $auth,
                    (user) => {
                        this.user = user;
                        this.loading = false;
                        resolve();
                    },
                    (error) => {
                        console.error("Auth state change error:", error);
                        this.loading = false;
                        this.error = this.getReadableErrorMessage(error);
                        resolve();
                    }
                );

                // Unsubscribe when component is unmounted
                if (process.client) {
                    window.onbeforeunload = () => {
                        unsubscribe();
                    };
                }
            });
        },

        async signIn(email: string, password: string) {
            try {
                this.error = null;
                this.loading = true;
                const { $auth } = useNuxtApp();
                if (!$auth) throw new Error("Auth not initialized");

                const userCredential = await signInWithEmailAndPassword(
                    $auth,
                    email,
                    password
                );
                this.user = userCredential.user;
                return this.user;
            } catch (error: any) {
                this.handleAuthError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async signInWithGoogle() {
            try {
                this.error = null;
                this.loading = true;
                const { $auth } = useNuxtApp();
                if (!$auth) throw new Error("Auth not initialized");

                const provider = new GoogleAuthProvider();
                const userCredential = await signInWithPopup($auth, provider);
                this.user = userCredential.user;
                return this.user;
            } catch (error: any) {
                this.handleAuthError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async signInWithGithub() {
            try {
                this.error = null;
                this.loading = true;
                const { $auth } = useNuxtApp();
                if (!$auth) throw new Error("Auth not initialized");

                const provider = new GithubAuthProvider();
                const userCredential = await signInWithPopup($auth, provider);
                this.user = userCredential.user;
                return this.user;
            } catch (error: any) {
                this.handleAuthError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async signUp(email: string, password: string) {
            try {
                this.error = null;
                this.loading = true;
                const { $auth } = useNuxtApp();
                if (!$auth) throw new Error("Auth not initialized");

                const userCredential = await createUserWithEmailAndPassword(
                    $auth,
                    email,
                    password
                );
                this.user = userCredential.user;
                return this.user;
            } catch (error: any) {
                this.handleAuthError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async signOut() {
            try {
                this.loading = true;
                const { $auth } = useNuxtApp();
                if (!$auth) throw new Error("Auth not initialized");

                await firebaseSignOut($auth);
                this.user = null;
            } catch (error: any) {
                this.handleAuthError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        handleAuthError(error: any) {
            console.error("Auth error:", error);
            this.error = this.getReadableErrorMessage(error);
        },

        getReadableErrorMessage(error: any): string {
            const code = error.code;
            switch (code) {
                case "auth/email-already-in-use":
                    return "This email is already registered. Please try logging in.";
                case "auth/invalid-email":
                    return "Please enter a valid email address.";
                case "auth/operation-not-allowed":
                    return "Email/password accounts are not enabled. Please contact support.";
                case "auth/weak-password":
                    return "Please choose a stronger password.";
                case "auth/user-disabled":
                    return "This account has been disabled. Please contact support.";
                case "auth/user-not-found":
                case "auth/wrong-password":
                    return "Invalid email or password.";
                case "auth/too-many-requests":
                    return "Too many attempts. Please try again later.";
                case "auth/network-request-failed":
                    return "Network error. Please check your connection.";
                case "auth/popup-closed-by-user":
                    return "Sign in was cancelled. Please try again.";
                case "auth/cancelled-popup-request":
                    return "Only one sign in window can be open at a time.";
                case "auth/popup-blocked":
                    return "Sign in popup was blocked. Please allow popups for this site.";
                case "auth/account-exists-with-different-credential":
                    return "An account already exists with this email but with different sign in credentials.";
                default:
                    return error.message || "An unexpected error occurred.";
            }
        },
    },
});
