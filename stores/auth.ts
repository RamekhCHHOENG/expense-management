import {
    browserLocalPersistence,
    browserSessionPersistence,
    confirmPasswordReset,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail as firebaseSendPasswordResetEmail,
    signOut as firebaseSignOut,
    GithubAuthProvider,
    GoogleAuthProvider,
    onAuthStateChanged,
    onIdTokenChanged,
    setPersistence,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
    type Auth,
    type AuthError,
    type User,
} from "firebase/auth";
import { defineStore } from "pinia";
import { useUserService, type UserProfile } from "~/services/user";

interface AuthState {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    isTokenRefreshing: boolean;
    initialized: boolean;
    authInstance: Auth | null;
}

export const useAuthStore = defineStore("auth", {
    state: (): AuthState => ({
        user: null,
        profile: null,
        loading: true,
        error: null,
        isTokenRefreshing: false,
        initialized: false,
        authInstance: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
        currentUser: (state) => state.user,
        currentProfile: (state) => state.profile,
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
                await new Promise<void>((resolve, reject) => {
                    const unsubscribe = onAuthStateChanged(
                        this.authInstance!,
                        async (user) => {
                            try {
                                this.user = user;
                                if (user) {
                                    // Fetch user profile from Firestore
                                    const userService = useUserService();
                                    this.profile = await userService.getUser(
                                        user.uid
                                    );
                                } else {
                                    this.profile = null;
                                }
                                this.loading = false;
                                this.initialized = true;
                                resolve();
                            } catch (error: any) {
                                reject(error);
                            }
                        },
                        reject
                    );

                    // Set up token refresh listener
                    onIdTokenChanged(this.authInstance!, async (user) => {
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

                    // Clean up subscription
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

                // Fetch user profile
                const userService = useUserService();
                this.profile = await userService.getUser(this.user.uid);

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

                // Create or fetch user profile
                const userService = useUserService();
                let profile = await userService.getUser(this.user.uid);

                if (!profile) {
                    profile = await userService.createUser(this.user);
                }

                this.profile = profile;
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

                // Create or fetch user profile
                const userService = useUserService();
                let profile = await userService.getUser(this.user.uid);

                if (!profile) {
                    profile = await userService.createUser(this.user);
                }

                this.profile = profile;
                return this.user;
            } catch (error) {
                this.handleAuthError(error as AuthError);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async signUp(email: string, password: string, displayName: string) {
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

                // Update profile if displayName is provided
                if (displayName && this.user) {
                    await updateProfile(this.user, { displayName });
                }

                // Create user profile in Firestore
                const userService = useUserService();
                this.profile = await userService.createUser(this.user);

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
                this.profile = null;
                localStorage.removeItem("auth_token");
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
                await firebaseSendPasswordResetEmail(this.authInstance, email);
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
                case "auth/invalid-credential":
                    return "Invalid credentials. Please try again.";
                case "auth/too-many-requests":
                    return "Too many attempts. Please try again later.";
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

        async updateProfile(data: Partial<UserProfile>) {
            if (!this.user) throw new Error("No authenticated user");

            try {
                this.loading = true;
                this.error = null;

                const userService = useUserService();
                await userService.updateUser(this.user.uid, data);

                // Refresh profile
                this.profile = await userService.getUser(this.user.uid);
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});
