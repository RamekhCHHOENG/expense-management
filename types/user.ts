import { Timestamp } from "firebase/firestore";

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    createdAt: Timestamp | Date;
    updatedAt: Timestamp | Date;
    lastLoginAt?: Timestamp | Date;
    preferences: {
        theme: "light" | "dark";
        currency: string;
        language: string;
    };
}
