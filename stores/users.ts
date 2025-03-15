import { collection, getDocs } from "firebase/firestore";
import { defineStore } from "pinia";
import { useFirebase } from "~/composables/useFirebase";

export interface User {
    id: string;
    name: string;
    email: string;
}

export const useUsersStore = defineStore("users", {
    state: () => ({
        users: [] as User[],
        loading: false,
        error: null as string | null,
    }),

    actions: {
        async fetchUsers() {
            this.loading = true;
            this.error = null;
            try {
                const { db } = useFirebase();
                const querySnapshot = await getDocs(collection(db, "users"));
                this.users = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: data.displayName || data.name || "Unknown User",
                        email: data.email || "",
                    } as User;
                });
                console.log("Fetched users:", this.users);
            } catch (error) {
                console.error("Error fetching users:", error);
                this.error = "Failed to fetch users";
            } finally {
                this.loading = false;
            }
        },
    },
});
