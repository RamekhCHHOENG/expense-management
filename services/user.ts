import { useNuxtApp } from "#app";
import type { User } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
} from "firebase/firestore";

export interface UserProfile {
    uid: string;
    email: string;
    username: string;
    displayName: string | null;
    photoURL: string | null;
    createdAt: Date;
    updatedAt: Date;
    preferences: {
        theme: "light" | "dark";
        currency: string;
        language: string;
    };
    // Add any other user-specific fields here
}

export class UserService {
    constructor(private db: Firestore) {}

    private getUserRef(uid: string) {
        return doc(this.db, "users", uid);
    }

    private getUsersRef() {
        return collection(this.db, "users");
    }

    async getAllUsers(): Promise<UserProfile[]> {
        const usersRef = this.getUsersRef();
        const q = query(usersRef);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                ...data,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate(),
            } as UserProfile;
        });
    }

    async createUser(
        user: User,
        additionalData: Partial<UserProfile> = {}
    ): Promise<UserProfile> {
        const userRef = this.getUserRef(user.uid);
        const now = new Date();

        const userData: UserProfile = {
            uid: user.uid,
            email: user.email!,
            username: additionalData.username || user.displayName || "",
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: now,
            updatedAt: now,
            preferences: {
                theme: "light",
                currency: "USD",
                language: "en",
                ...additionalData.preferences,
            },
        };

        await setDoc(userRef, userData);
        return userData;
    }

    async getUser(uid: string): Promise<UserProfile | null> {
        const userRef = this.getUserRef(uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) return null;

        const data = userDoc.data();
        return {
            ...data,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
        } as UserProfile;
    }

    async updateUser(uid: string, data: Partial<UserProfile>): Promise<void> {
        const userRef = this.getUserRef(uid);
        const updateData = {
            ...data,
            updatedAt: new Date(),
        };
        await updateDoc(userRef, updateData);
    }

    async deleteUser(uid: string): Promise<void> {
        const userRef = this.getUserRef(uid);
        await deleteDoc(userRef);
    }
}

// Create a composable to use the UserService
export const useUserService = () => {
    const nuxtApp = useNuxtApp();
    const firestore = nuxtApp.$firebaseDb;

    if (!firestore) {
        throw new Error("Firestore not initialized");
    }

    return new UserService(firestore);
};
