import {
    collection,
    getDocs,
    getFirestore,
    query,
    Timestamp,
} from "firebase/firestore";
import type { UserProfile } from "~/types/user";

// Initialize Firestore
let db: ReturnType<typeof getFirestore>;

// Initialize the database
export const initializeFirestore = (firebaseApp: any) => {
    db = getFirestore(firebaseApp);
};

// Collection references
const getUsersCollection = () => collection(db, "users");

// User service functions
export const getUsersService = async (): Promise<UserProfile[]> => {
    try {
        const q = query(getUsersCollection());
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                uid: doc.id,
                ...data,
                createdAt:
                    data.createdAt instanceof Timestamp
                        ? data.createdAt.toDate()
                        : data.createdAt,
                updatedAt:
                    data.updatedAt instanceof Timestamp
                        ? data.updatedAt.toDate()
                        : data.updatedAt,
                lastLoginAt:
                    data.lastLoginAt instanceof Timestamp
                        ? data.lastLoginAt.toDate()
                        : data.lastLoginAt,
            } as UserProfile;
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};
