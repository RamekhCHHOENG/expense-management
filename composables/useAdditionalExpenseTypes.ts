import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc,
} from "firebase/firestore";
import { ref } from "vue";
import type {
    AdditionalExpenseType,
    FirestoreAdditionalExpenseType,
} from "~/types/additional-expense-type";
import { useFirebase } from "./useFirebase";

const COLLECTION_NAME = "additional-expense-types";

export const useAdditionalExpenseTypes = () => {
    const { db } = useFirebase();
    const expenseTypes = ref<AdditionalExpenseType[]>([]);
    const loading = ref(false);

    const convertToFirestore = (
        type: AdditionalExpenseType
    ): FirestoreAdditionalExpenseType => {
        const { id, createdAt, updatedAt, ...data } = type;
        return {
            ...data,
            description: data.description || "",
        };
    };

    const convertFromFirestore = (doc: any): AdditionalExpenseType => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            description: data.description || "",
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
        };
    };

    const fetchExpenseTypes = async () => {
        try {
            loading.value = true;
            const snapshot = await getDocs(collection(db, COLLECTION_NAME));
            expenseTypes.value = snapshot.docs.map(convertFromFirestore);
        } catch (error) {
            console.error("Error fetching expense types:", error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const addExpenseType = async (type: AdditionalExpenseType) => {
        const firestoreData = {
            ...convertToFirestore(type),
            createdAt: new Date(),
        };
        await addDoc(collection(db, COLLECTION_NAME), firestoreData);
        await fetchExpenseTypes();
    };

    const updateExpenseType = async (type: AdditionalExpenseType) => {
        if (!type.id) return;

        const firestoreData = {
            ...convertToFirestore(type),
            updatedAt: new Date(),
        };
        await updateDoc(doc(db, COLLECTION_NAME, type.id), firestoreData);
        await fetchExpenseTypes();
    };

    const deleteExpenseType = async (type: AdditionalExpenseType) => {
        if (!type.id) return;
        await deleteDoc(doc(db, COLLECTION_NAME, type.id));
        await fetchExpenseTypes();
    };

    // Initialize with default expense types if none exist
    const initializeDefaultTypes = async () => {
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));
        if (snapshot.empty) {
            const defaultTypes = [
                { name: "Mining", description: "Mining equipment expenses" },
                {
                    name: "Air Conditioning",
                    description: "AC usage and maintenance",
                },
                {
                    name: "Fridge",
                    description: "Refrigerator usage and maintenance",
                },
                {
                    name: "Cloth Wash",
                    description: "Laundry and washing machine usage",
                },
            ];

            for (const type of defaultTypes) {
                await addExpenseType(type);
            }
        }
    };

    return {
        expenseTypes,
        loading,
        fetchExpenseTypes,
        addExpenseType,
        updateExpenseType,
        deleteExpenseType,
        initializeDefaultTypes,
    };
};
