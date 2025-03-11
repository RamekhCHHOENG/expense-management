import type { User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

interface UserProfile {
    id: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    createdAt: Date;
    updatedAt: Date;
    preferences: {
        currency: string;
        language: string;
        notifications: boolean;
    };
}

interface ProfileState {
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
}

export const useProfileStore = defineStore("profile", {
    state: (): ProfileState => ({
        profile: null,
        loading: false,
        error: null,
    }),

    getters: {
        hasProfile: (state) => !!state.profile,
    },

    actions: {
        async fetchProfile() {
            const authStore = useAuthStore();
            const { $firebaseFirestore } = useNuxtApp();

            if (!authStore.user || !$firebaseFirestore) return;

            this.loading = true;
            this.error = null;

            try {
                const docRef = doc(
                    $firebaseFirestore,
                    "users",
                    authStore.user.uid
                );
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    this.profile = {
                        ...(docSnap.data() as UserProfile),
                        id: docSnap.id,
                    };
                } else {
                    // Create new profile if it doesn't exist
                    await this.createProfile(authStore.user);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                this.error = "Failed to fetch profile";
            } finally {
                this.loading = false;
            }
        },

        async createProfile(user: User) {
            const { $firebaseFirestore } = useNuxtApp();
            if (!$firebaseFirestore) return;

            this.loading = true;
            this.error = null;

            try {
                const newProfile: UserProfile = {
                    id: user.uid,
                    email: user.email!,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    preferences: {
                        currency: "USD",
                        language: "en",
                        notifications: true,
                    },
                };

                await setDoc(
                    doc($firebaseFirestore, "users", user.uid),
                    newProfile
                );
                this.profile = newProfile;
            } catch (error) {
                console.error("Error creating profile:", error);
                this.error = "Failed to create profile";
            } finally {
                this.loading = false;
            }
        },

        async updateProfile(updates: Partial<UserProfile>) {
            const { $firebaseFirestore } = useNuxtApp();
            if (!this.profile?.id || !$firebaseFirestore) return;

            this.loading = true;
            this.error = null;

            try {
                const docRef = doc(
                    $firebaseFirestore,
                    "users",
                    this.profile.id
                );
                await updateDoc(docRef, {
                    ...updates,
                    updatedAt: new Date(),
                });

                this.profile = {
                    ...this.profile,
                    ...updates,
                    updatedAt: new Date(),
                };
            } catch (error) {
                console.error("Error updating profile:", error);
                this.error = "Failed to update profile";
            } finally {
                this.loading = false;
            }
        },

        async updatePreferences(
            preferences: Partial<UserProfile["preferences"]>
        ) {
            if (!this.profile) return;

            await this.updateProfile({
                preferences: {
                    ...this.profile.preferences,
                    ...preferences,
                },
            });
        },
    },
});
