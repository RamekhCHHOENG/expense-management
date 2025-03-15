import {
    collection,
    getDocs,
    orderBy,
    query,
    Timestamp,
    where,
} from "firebase/firestore";
import { computed, ref } from "vue";
import { db } from "~/plugins/firebase";
import type { Expense } from "~/types/expense";

export function useDashboard() {
    const loading = ref(false);
    const expenses = ref<Expense[]>([]);
    const income = ref<number>(0);

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        loading.value = true;
        try {
            const now = new Date();
            const firstDayOfMonth = new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );
            const lastDayOfMonth = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                0
            );

            // Fetch expenses for current month
            const expensesRef = collection(db, "expenses");
            const expensesQuery = query(
                expensesRef,
                where("date", ">=", Timestamp.fromDate(firstDayOfMonth)),
                where("date", "<=", Timestamp.fromDate(lastDayOfMonth)),
                orderBy("date", "desc")
            );
            const expensesSnap = await getDocs(expensesQuery);
            expenses.value = expensesSnap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Expense[];

            // Calculate total income (you might want to adjust this based on your data structure)
            income.value = 5000; // Example static value - replace with real income calculation
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            loading.value = false;
        }
    };

    // Computed properties
    const totalExpenses = computed(() => {
        return expenses.value.reduce(
            (sum, exp) => sum + (exp.house + exp.electricity),
            0
        );
    });

    const expensesByCategory = computed(() => {
        return [
            {
                name: "House",
                value: expenses.value.reduce((sum, exp) => sum + exp.house, 0),
            },
            {
                name: "Electricity",
                value: expenses.value.reduce(
                    (sum, exp) => sum + exp.electricity,
                    0
                ),
            },
            {
                name: "Water",
                value: expenses.value.reduce(
                    (sum, exp) => sum + (exp.water || 0),
                    0
                ),
            },
            {
                name: "Waste",
                value: expenses.value.reduce(
                    (sum, exp) => sum + (exp.waste || 0),
                    0
                ),
            },
            {
                name: "Additional",
                value: expenses.value.reduce(
                    (sum, exp) => sum + (exp.additional || 0),
                    0
                ),
            },
        ];
    });

    const recentTransactions = computed(() => {
        return expenses.value.slice(0, 5).map((expense) => ({
            description: `Room ${expense.users[0]?.room} Expense`,
            category: "Rental",
            date: expense.date.toDate().toLocaleDateString(),
            amount: (expense.house + expense.electricity).toFixed(2),
            type: "expense",
        }));
    });

    const monthlyComparison = computed(() => {
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            return date.toLocaleString("default", { month: "short" });
        }).reverse();

        return last6Months.map((month) => ({
            month,
            income: income.value, // Replace with actual monthly income
            expense: expenses.value
                .filter((exp) => {
                    const expMonth = exp.date
                        .toDate()
                        .toLocaleString("default", { month: "short" });
                    return expMonth === month;
                })
                .reduce((sum, exp) => sum + (exp.house + exp.electricity), 0),
        }));
    });

    const savingsRate = computed(() => {
        const totalIncome = income.value;
        const totalExp = totalExpenses.value;
        return totalIncome > 0
            ? ((totalIncome - totalExp) / totalIncome) * 100
            : 0;
    });

    return {
        loading,
        totalExpenses,
        expensesByCategory,
        recentTransactions,
        monthlyComparison,
        savingsRate,
        fetchDashboardData,
    };
}
