import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    updateDoc,
    where,
} from "firebase/firestore";
import { ref } from "vue";
import type { Expense, FirestoreExpense } from "~/types/expense";
import { useFirebase } from "./useFirebase";

// Collection name constant
const COLLECTION_NAME = "rental-expenses";

export const useExpenses = () => {
    const { db } = useFirebase();
    const expenses = ref<Expense[]>([]);
    const loading = ref(false);
    const pagination = ref({
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalItems: 0,
    });

    const convertToFirestore = (expense: Expense): FirestoreExpense => {
        const { id, createdAt, updatedAt, ...data } = expense;
        return {
            date: data.date,
            house: data.house.toString(),
            totalElect: data.totalElect?.toString() ?? "",
            rtAcFridge: data.rtAcFridge?.toString() ?? "",
            pheaFridge: data.pheaFridge?.toString() ?? "",
            mining: data.mining?.toString() ?? "",
            electricity: data.electricity.toString(),
            water: data.water?.toString() ?? "",
            waste: data.waste?.toString() ?? "",
            additional: data.additional?.toString() ?? "",
        };
    };

    const convertFromFirestore = (doc: any): Expense => {
        const data = doc.data();
        return {
            id: doc.id,
            date: data.date,
            house: parseFloat(data.house),
            totalElect: data.totalElect ? parseFloat(data.totalElect) : null,
            rtAcFridge: data.rtAcFridge ? parseFloat(data.rtAcFridge) : null,
            pheaFridge: data.pheaFridge ? parseFloat(data.pheaFridge) : null,
            mining: data.mining ? parseFloat(data.mining) : null,
            electricity: parseFloat(data.electricity),
            water: data.water ? parseFloat(data.water) : null,
            waste: data.waste ? parseFloat(data.waste) : null,
            additional: data.additional ? parseFloat(data.additional) : null,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
        };
    };

    const fetchExpenses = async (
        options: {
            page?: number;
            limit?: number;
            sort?: { id: string; desc: boolean }[];
            search?: string;
        } = {}
    ) => {
        try {
            loading.value = true;
            console.log("Fetching expenses with options:", options);
            const expensesRef = collection(db, COLLECTION_NAME);

            // Build query with sorting and pagination
            let q = query(expensesRef);

            // Apply sorting
            if (options.sort?.length) {
                const { id, desc } = options.sort[0];
                q = query(q, orderBy(id, desc ? "desc" : "asc"));
            } else {
                // Default sort by date descending
                q = query(q, orderBy("date", "desc"));
            }

            // Apply search if provided
            if (options.search) {
                q = query(
                    q,
                    where("date", ">=", options.search),
                    where("date", "<=", options.search + "\uf8ff")
                );
            }

            // Get total count for pagination
            const totalSnapshot = await getDocs(query(expensesRef));
            const total = totalSnapshot.size;
            console.log("Total documents:", total);

            // Apply pagination
            const pageSize = options.limit || pagination.value.pageSize;
            const currentPage = options.page || pagination.value.currentPage;
            console.log("Current page:", currentPage, "Page size:", pageSize);

            // Calculate the starting position
            const startAt = (currentPage - 1) * pageSize;
            console.log("Starting at position:", startAt);

            // Get documents for the current page
            const paginatedQuery = query(q, limit(pageSize));
            if (startAt > 0) {
                // Get the document to start after
                const snapshot = await getDocs(query(q, limit(startAt)));
                if (snapshot.docs.length === startAt) {
                    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
                    q = query(paginatedQuery, startAfter(lastDoc));
                } else {
                    q = paginatedQuery;
                }
            } else {
                q = paginatedQuery;
            }

            // Get the final results
            const snapshot = await getDocs(q);
            expenses.value = snapshot.docs.map(convertFromFirestore);
            console.log("Fetched", expenses.value.length, "documents");

            // Update pagination
            pagination.value = {
                currentPage,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
                totalItems: total,
            };
            console.log("Updated pagination:", pagination.value);
        } catch (error) {
            console.error("Error fetching expenses:", error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const addExpense = async (expense: Expense) => {
        const firestoreData = {
            ...convertToFirestore(expense),
            createdAt: new Date(),
        };
        await addDoc(collection(db, COLLECTION_NAME), firestoreData);
        await fetchExpenses();
    };

    const updateExpense = async (expense: Expense) => {
        if (!expense.id) return;

        const firestoreData = {
            ...convertToFirestore(expense),
            updatedAt: new Date(),
        };
        await updateDoc(doc(db, COLLECTION_NAME, expense.id), firestoreData);
        await fetchExpenses();
    };

    const deleteExpense = async (expense: Expense) => {
        if (!expense.id) return;
        await deleteDoc(doc(db, COLLECTION_NAME, expense.id));
        await fetchExpenses();
    };

    const seedInitialData = async (expenses: any[]) => {
        console.log("Seeding initial data...");
        for (const expense of expenses) {
            const cleanedExpense = {
                date: expense.date,
                house: parseFloat(
                    expense.house.replace("$", "").replace(",", "")
                ),
                totalElect: expense.totalElect
                    ? parseFloat(
                          expense.totalElect.replace("$", "").replace(",", "")
                      )
                    : null,
                rtAcFridge: expense.rtAcFridge
                    ? parseFloat(
                          expense.rtAcFridge.replace("$", "").replace(",", "")
                      )
                    : null,
                pheaFridge: expense.pheaFridge
                    ? parseFloat(
                          expense.pheaFridge.replace("$", "").replace(",", "")
                      )
                    : null,
                mining: expense.mining
                    ? parseFloat(
                          expense.mining.replace("$", "").replace(",", "")
                      )
                    : null,
                electricity: parseFloat(
                    expense.electricity.replace("$", "").replace(",", "")
                ),
                water:
                    expense.water && expense.water !== "$ -"
                        ? parseFloat(
                              expense.water.replace("$", "").replace(",", "")
                          )
                        : null,
                waste: expense.waste
                    ? parseFloat(
                          expense.waste.replace("$", "").replace(",", "")
                      )
                    : null,
                additional:
                    expense.additional && expense.additional !== "$ -"
                        ? parseFloat(
                              expense.additional
                                  .replace("$", "")
                                  .replace(",", "")
                          )
                        : null,
                createdAt: new Date(),
            };
            await addDoc(collection(db, COLLECTION_NAME), cleanedExpense);
        }
        console.log("Initial data seeded");
    };

    return {
        expenses,
        loading,
        pagination,
        fetchExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        seedInitialData,
    };
};
