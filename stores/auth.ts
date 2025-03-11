import {
    browserLocalPersistence,
    browserSessionPersistence,
    confirmPasswordReset,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    GithubAuthProvider,
    GoogleAuthProvider,
    onAuthStateChanged,
    onIdTokenChanged,
    sendPasswordResetEmail,
    setPersistence,
    signInWithEmailAndPassword,
    signInWithPopup,
    type Auth,
    type AuthError,
    type ErrorFn,
    type User,
} from "firebase/auth";
import { defineStore } from "pinia";

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    isTokenRefreshing: boolean;
    initialized: boolean;
    authInstance: Auth | null;
}

export const useAuthStore = defineStore("auth", {
    state: (): AuthState => ({
        user: null,
        loading: true,
        error: null,
        isTokenRefreshing: false,
        initialized: false,
        authInstance: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
    },

    actions: {
        setAuth(authInstance: Auth) {
            this.authInstance = authInstance;
        },

        async init() {
            if (this.initialized || !this.authInstance) {
                return;
            }

            try {
                // Set up token refresh listener
                onIdTokenChanged(this.authInstance, async (user) => {
                    if (user) {
                        const token = await user.getIdToken();
                        if (process.client) {
                            localStorage.setItem("auth_token", token);
                        }
                    } else {
                        if (process.client) {
                            localStorage.removeItem("auth_token");
                        }
                    }
                });

                await new Promise<void>((resolve) => {
                    const unsubscribe = onAuthStateChanged(
                        this.authInstance!,
                        (user) => {
                            this.user = user;
                            this.loading = false;
                            this.initialized = true;
                            resolve();
                        },
                        ((error: Error) => {
                            console.error("Auth state change error:", error);
                            this.loading = false;
                            this.error =
                                "An error occurred during authentication";
                            this.initialized = true;
                            resolve();
                        }) as ErrorFn
                    );

                    // Unsubscribe when component is unmounted
                    if (process.client) {
                        window.onbeforeunload = () => {
                            unsubscribe();
                        };
                    }
                });
            } catch (error) {
                console.error("Auth initialization error:", error);
                this.loading = false;
                this.initialized = true;
                throw error;
            }
        },

        async signIn(
            email: string,
            password: string,
            rememberMe: boolean = false
        ) {
            if (!this.authInstance) throw new Error("Auth not initialized");

            try {
                this.error = null;
                this.loading = true;

                // Set persistence based on remember me option
                await setPersistence(
                    this.authInstance,
                    rememberMe
                        ? browserLocalPersistence
                        : browserSessionPersistence
                );

                const userCredential = await signInWithEmailAndPassword(
                    this.authInstance,
                    email,
                    password
                );
                this.user = userCredential.user;
                return this.user;
            } catch (error) {
                this.handleAuthError(error as AuthError);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async signInWithGoogle() {
            if (!this.authInstance) throw new Error("Auth not initialized");

            try {
                this.error = null;
                this.loading = true;

                const provider = new GoogleAuthProvider();
                const userCredential = await signInWithPopup(
                    this.authInstance,
                    provider
                );
                this.user = userCredential.user;
                return this.user;
            } catch (error) {
                this.handleAuthError(error as AuthError);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async signInWithGithub() {
            if (!this.authInstance) throw new Error("Auth not initialized");

            try {
                this.error = null;
                this.loading = true;

                const provider = new GithubAuthProvider();
                const userCredential = await signInWithPopup(
                    this.authInstance,
                    provider
                );
                this.user = userCredential.user;
                return this.user;
            } catch (error) {
                this.handleAuthError(error as AuthError);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async signUp(email: string, password: string) {
            if (!this.authInstance) throw new Error("Auth not initialized");

            try {
                this.error = null;
                this.loading = true;

                const userCredential = await createUserWithEmailAndPassword(
                    this.authInstance,
                    email,
                    password
                );
                this.user = userCredential.user;
                return this.user;
            } catch (error) {
                this.handleAuthError(error as AuthError);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async signOut() {
            if (!this.authInstance) throw new Error("Auth not initialized");

            try {
                this.loading = true;
                await firebaseSignOut(this.authInstance);
                this.user = null;
            } catch (error) {
                this.handleAuthError(error as AuthError);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async sendPasswordResetEmail(email: string) {
            if (!this.authInstance) throw new Error("Auth not initialized");

            try {
                await sendPasswordResetEmail(this.authInstance, email);
            } catch (error) {
                throw new Error(
                    this.getErrorMessage((error as AuthError).code)
                );
            }
        },

        async confirmPasswordReset(oobCode: string, newPassword: string) {
            if (!this.authInstance) throw new Error("Auth not initialized");

            try {
                await confirmPasswordReset(
                    this.authInstance,
                    oobCode,
                    newPassword
                );
            } catch (error) {
                throw new Error(
                    this.getErrorMessage((error as AuthError).code)
                );
            }
        },

        handleAuthError(error: AuthError) {
            console.error("Auth error:", error);
            this.error = this.getErrorMessage(error.code);
        },

        getErrorMessage(code: string): string {
            switch (code) {
                case "auth/email-already-in-use":
                    return "This email is already registered. Please sign in or use a different email.";
                case "auth/invalid-email":
                    return "Invalid email address. Please check and try again.";
                case "auth/operation-not-allowed":
                    return "This sign-in method is not enabled. Please contact support.";
                case "auth/weak-password":
                    return "Password is too weak. Please use a stronger password.";
                case "auth/user-disabled":
                    return "This account has been disabled. Please contact support.";
                case "auth/user-not-found":
                    return "No account found with this email. Please sign up.";
                case "auth/wrong-password":
                    return "Incorrect password. Please try again.";
                case "auth/popup-closed-by-user":
                    return "Sign-in popup was closed before completion. Please try again.";
                case "auth/cancelled-popup-request":
                    return "The sign-in process was cancelled. Please try again.";
                case "auth/popup-blocked":
                    return "Sign-in popup was blocked by your browser. Please allow popups and try again.";
                default:
                    return "An error occurred. Please try again.";
            }
        },

        async refreshToken() {
            if (this.isTokenRefreshing || !this.user) return;

            try {
                this.isTokenRefreshing = true;
                const token = await this.user.getIdToken(true);
                if (process.client) {
                    localStorage.setItem("auth_token", token);
                }
                return token;
            } catch (error) {
                console.error("Token refresh error:", error);
                throw error;
            } finally {
                this.isTokenRefreshing = false;
            }
        },
    },
});
