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
                this.users = querySnapshot.docs.map(
                    (doc) =>
                        ({
                            id: doc.id,
                            ...doc.data(),
                        }) as User
                );
            } catch (error) {
                console.error("Error fetching users:", error);
                this.error = "Failed to fetch users";
            } finally {
                this.loading = false;
            }
        },
    },
});
