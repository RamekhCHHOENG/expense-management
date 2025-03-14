<template>
    <div class="container mx-auto p-4">
        <Card class="mb-8">
            <CardHeader>
                <div class="flex items-center justify-between">
                    <div>
                        <CardTitle>Rental House Expenses</CardTitle>
                        <CardDescription>
                            Manage your rental house expenses and payments
                        </CardDescription>
                    </div>
                    <Button @click="openCreateDialog">
                        <PlusIcon class="mr-2 h-4 w-4" />
                        Create Expense
                    </Button>
                </div>
            </CardHeader>
        </Card>

        <Card>
            <CardHeader>
                <div class="flex items-center justify-between">
                    <CardTitle>Expense History</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <ExpenseList
                    :expenses="expenses"
                    :pagination="expensesPagination"
                    :loading="loading"
                    @option-change="handleOptionChange"
                    @view="handleView"
                    @edit="handleEdit"
                    @delete="handleDelete"
                />
            </CardContent>
        </Card>
    </div>

    <!-- Create/Edit Dialog -->
    <Dialog
        :open="isCreateDialogOpen"
        @update:open="isCreateDialogOpen = $event"
    >
        <DialogContent class="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>Create Expense</DialogTitle>
                <DialogDescription>
                    Add a new expense record
                </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
                <ExpenseForm @submit="handleCreate" />
            </div>
        </DialogContent>
    </Dialog>

    <!-- View Dialog -->
    <ExpenseView
        v-if="selectedExpense"
        :expense="selectedExpense"
        :is-open="isViewDialogOpen"
        :is-edit-mode="isEditMode"
        @update:is-open="isViewDialogOpen = $event"
        @update="handleUpdate"
        @cancel-edit="handleCancelEdit"
    />

    <!-- Delete Dialog -->
    <ExpenseDelete
        v-if="expenseToDelete"
        :expense="expenseToDelete"
        v-model:is-open="isDeleteDialogOpen"
        @delete="deleteExpense"
    />
</template>

<script setup lang="ts">
import { PlusIcon } from "@heroicons/vue/20/solid";
import { onMounted, ref } from "vue";
import { useExpenses } from "~/composables/useExpenses";
import type { Expense } from "~/types/expense";

// Import components
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ExpenseDelete from "~/components/rental-expenses/expense-delete.vue";
import ExpenseForm from "~/components/rental-expenses/expense-form.vue";
import ExpenseList from "~/components/rental-expenses/expense-list.vue";
import ExpenseView from "~/components/rental-expenses/expense-view.vue";

const {
    expenses,
    loading,
    pagination: expensesPagination,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense: removeExpense,
    seedInitialData,
} = useExpenses();

const selectedExpense = ref<Expense | null>(null);
const expenseToDelete = ref<Expense | null>(null);
const isViewDialogOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const isEditMode = ref(false);
const isCreateDialogOpen = ref(false);

const openCreateDialog = () => {
    isCreateDialogOpen.value = true;
};

const handleCreate = async (expense: Expense) => {
    await addExpense(expense);
    isCreateDialogOpen.value = false;
    await fetchExpenses();
};

const handleOptionChange = async (options: any) => {
    console.log("Fetching expenses with options:", options);
    await fetchExpenses(options);
};

const handleView = (expense: Expense) => {
    selectedExpense.value = expense;
    isEditMode.value = false;
    isViewDialogOpen.value = true;
};

const handleEdit = (expense: Expense) => {
    selectedExpense.value = expense;
    isEditMode.value = true;
    isViewDialogOpen.value = true;
};

const handleDelete = (expense: Expense) => {
    expenseToDelete.value = expense;
    isDeleteDialogOpen.value = true;
};

const handleUpdate = async (expense: Expense) => {
    await updateExpense(expense);
    selectedExpense.value = null;
    isViewDialogOpen.value = false;
    isEditMode.value = false;
};

const handleCancelEdit = () => {
    isEditMode.value = false;
    isViewDialogOpen.value = false;
    selectedExpense.value = null;
};

const deleteExpense = async (expense: Expense) => {
    await removeExpense(expense);
    expenseToDelete.value = null;
    isDeleteDialogOpen.value = false;
};

const expsenData = [
    {
        date: "10-Mar-2022",
        house: "$ 270.00",
        totalElect: null,
        rtAcFridge: null,
        pheaFridge: null,
        mining: null,
        electricity: "$ 50.00",
        water: "$ 20.00",
        waste: "$ 2.50",
        additional: "$ (10.00)",
        total: "$ 332.50",
    },
    {
        date: "14-Apr-2022",
        house: "$ 270.00",
        totalElect: null,
        rtAcFridge: null,
        pheaFridge: null,
        mining: null,
        electricity: "$ 67.88",
        water: null,
        waste: "$ 2.50",
        additional: "$ 30.00",
        total: "$ 370.38",
    },
    {
        date: "10-May-2022",
        house: "$ 270.00",
        totalElect: "$ 182.50",
        rtAcFridge: "$ 27.38",
        pheaFridge: null,
        mining: "$ 89.35",
        electricity: "$ 65.77",
        water: "$ 18.75",
        waste: "$ 2.50",
        additional: "$ 3.50",
        total: "$ 360.52",
    },
    {
        date: "10-Jun-2022",
        house: "$ 270.00",
        totalElect: "$ 155.00",
        rtAcFridge: "$ 7.30",
        pheaFridge: null,
        mining: "$ 80.00",
        electricity: "$ 67.70",
        water: "$ -",
        waste: "$ 2.50",
        additional: "$ 5.00",
        total: "$ 345.20",
    },
    {
        date: "10-Jul-2022",
        house: "$ 300.00",
        totalElect: "$ 165.18",
        rtAcFridge: "$ 24.09",
        pheaFridge: null,
        mining: "$ 80.00",
        electricity: "$ 60.00",
        water: "$ 20.00",
        waste: "$ 2.50",
        additional: "$ 30.00",
        total: "$ 412.50",
    },
    {
        date: "10-Aug-2022",
        house: "$ 300.00",
        totalElect: "$ 152.08",
        rtAcFridge: "$ 25.55",
        pheaFridge: null,
        mining: "$ 66.53",
        electricity: "$ 60.00",
        water: "$ -",
        waste: "$ 2.50",
        additional: "$ -",
        total: "$ 362.50",
    },
    {
        date: "10-Sep-2022",
        house: "$ 300.00",
        totalElect: "$ 167.74",
        rtAcFridge: "$ 18.25",
        pheaFridge: null,
        mining: "$ 82.49",
        electricity: "$ 67.00",
        water: "$ 20.00",
        waste: "$ 2.50",
        additional: null,
        total: "$ 389.50",
    },
    {
        date: "10-Oct-2022",
        house: "$ 300.00",
        totalElect: "$ 144.93",
        rtAcFridge: "$ 23.73",
        pheaFridge: null,
        mining: "$ 41.20",
        electricity: "$ 80.00",
        water: null,
        waste: "$ 2.50",
        additional: null,
        total: "$ 382.50",
    },
    {
        date: "10-Nov-2022",
        house: "$ 300.00",
        totalElect: "$ 71.70",
        rtAcFridge: "$ 23.90",
        pheaFridge: null,
        mining: null,
        electricity: "$ 47.80",
        water: null,
        waste: "$ 2.50",
        additional: "$ 15.00",
        total: "$ 365.30",
    },
    {
        date: "10-Dec-2022",
        house: "$ 300.00",
        totalElect: "$ 72.07",
        rtAcFridge: "$ 22.86",
        pheaFridge: null,
        mining: null,
        electricity: "$ 49.21",
        water: "$ 17.50",
        waste: "$ 2.50",
        additional: "$ 5.00",
        total: "$ 374.21",
    },
    {
        date: "10-Jan-2023",
        house: "$ 300.00",
        totalElect: "58.1",
        rtAcFridge: "25.48",
        pheaFridge: null,
        mining: null,
        electricity: "32.62",
        water: null,
        waste: "$ 2.50",
        additional: "35",
        total: "$ 370.12",
    },
    {
        date: "10-Feb-2023",
        house: "$ 300.00",
        totalElect: "$ 83.99",
        rtAcFridge: "25.48",
        pheaFridge: null,
        mining: null,
        electricity: "$ 58.51",
        water: "$ 16.65",
        waste: "$ 2.50",
        additional: "$ 5.00",
        total: "$ 382.66",
    },
    {
        date: "10-Mar-2023",
        house: "$ 300.00",
        totalElect: "$ 80.12",
        rtAcFridge: "18",
        pheaFridge: null,
        mining: null,
        electricity: "$ 62.12",
        water: null,
        waste: "$ 2.50",
        additional: null,
        total: "$ 364.62",
    },
    {
        date: "10-Apr-2023",
        house: "$ 300.00",
        totalElect: "$ 88.15",
        rtAcFridge: "$ 7.50",
        pheaFridge: "$ 8.03",
        mining: null,
        electricity: "$ 72.62",
        water: "$ 21.71",
        waste: "$ 2.50",
        additional: null,
        total: "$ 396.83",
    },
    {
        date: "10-May-2023",
        house: "$ 300.00",
        totalElect: "$ 78.48",
        rtAcFridge: "$ 7.50",
        pheaFridge: "$ 8.00",
        mining: null,
        electricity: "$ 62.98",
        water: null,
        waste: "$ 2.50",
        additional: "$ 5.00",
        total: "$ 370.48",
    },
    {
        date: "10-Jun-2023",
        house: "$ 300.00",
        totalElect: "$ 84.63",
        rtAcFridge: "$ 7.50",
        pheaFridge: "$ 8.00",
        mining: null,
        electricity: "$ 69.13",
        water: "$ 38.45",
        waste: "$ 2.50",
        additional: "$ 50.00",
        total: "$ 460.08",
    },
    {
        date: "10-Jul-2023",
        house: "$ 300.00",
        totalElect: "$ 85.78",
        rtAcFridge: "$ 7.50",
        pheaFridge: "$ 8.00",
        mining: null,
        electricity: "$ 70.28",
        water: null,
        waste: "$ 2.50",
        additional: "$ 5.00",
        total: "$ 377.78",
    },
    {
        date: "10-Aug-2023",
        house: "$ 300.00",
        totalElect: "$ 77.93",
        rtAcFridge: "$ 7.50",
        pheaFridge: "$ 8.00",
        mining: null,
        electricity: "$ 62.43",
        water: "$ 29.23",
        waste: "$ 2.50",
        additional: "$ 5.00",
        total: "$ 399.16",
    },
    {
        date: "10-Sep-2023",
        house: "$ 300.00",
        totalElect: "$ 86.03",
        rtAcFridge: "$ 7.50",
        pheaFridge: "$ 8.00",
        mining: null,
        electricity: "$ 78.53",
        water: null,
        waste: "$ 2.50",
        additional: "$ 5.00",
        total: "$ 386.03",
    },
    {
        date: "10-Oct-2023",
        house: "$ 300.00",
        totalElect: "$ 79.93",
        rtAcFridge: "$ 7.50",
        pheaFridge: "$ 8.00",
        mining: null,
        electricity: "$ 72.43",
        water: "35.2875",
        waste: "$ 2.50",
        additional: "$ 20.00",
        total: "$ 430.21",
    },
    {
        date: "10-Dec-2023",
        house: "$ 300.00",
        totalElect: "$ 78.65",
        rtAcFridge: "$ 7.50",
        pheaFridge: "$ 8.00",
        mining: null,
        electricity: "$ 71.15",
        water: "23.67",
        waste: "$ 2.50",
        additional: "$ 5.00",
        total: "$ 402.32",
    },
    {
        date: "10-Feb-2024",
        house: "$ 300.00",
        totalElect: "$ 78.68",
        rtAcFridge: "$ 7.50",
        pheaFridge: "$ 8.00",
        mining: null,
        electricity: "$ 71.18",
        water: null,
        waste: "$ 2.50",
        additional: "$ 5.00",
        total: "$ 378.68",
    },
    {
        date: "10-Mar-2024",
        house: "$ 300.00",
        totalElect: "$ 94.35",
        rtAcFridge: "$ 7.50",
        pheaFridge: "$ 8.00",
        mining: null,
        electricity: "$ 86.85",
        water: "28.6",
        waste: "$ 2.50",
        additional: "$ 5.00",
        total: "$ 422.95",
    },
    {
        date: "10-Apr-2024",
        house: "$ 300.00",
        totalElect: "$ 102.20",
        rtAcFridge: "$ 7.50",
        pheaFridge: "$ 8.00",
        mining: null,
        electricity: "$ 94.70",
        water: null,
        waste: "$ 2.50",
        additional: "$ 5.00",
        total: "$ 402.20",
    },
    {
        date: "10-May-2024",
        house: "$ 300.00",
        totalElect: "$ 91.80",
        rtAcFridge: "$ 25.70",
        pheaFridge: "$ 8.00",
        mining: null,
        electricity: "$ 58.10",
        water: "$ 39.26",
        waste: "$ 2.50",
        additional: "$ 18.00",
        total: "$ 417.86",
    },
    {
        date: "10-Jun-2024",
        house: "$ 300.00",
        totalElect: "$ 113.88",
        rtAcFridge: "$ 30.48",
        pheaFridge: "$ 10.00",
        mining: null,
        electricity: "$ 73.40",
        water: null,
        waste: "$ 2.50",
        additional: "$ 10.00",
        total: "$ 385.90",
    },
    {
        date: "10-Jul-2024",
        house: "$ 300.00",
        totalElect: "$ 113.88",
        rtAcFridge: "$ 23.73",
        pheaFridge: "$ 10.00",
        mining: null,
        electricity: "$ 80.15",
        water: "$ 48.87",
        waste: "$ 2.50",
        additional: "$ 10.00",
        total: "$ 441.52",
    },
    {
        date: "10-Aug-2024",
        house: "$ 300.00",
        totalElect: "$ 100.58",
        rtAcFridge: "$ 22.27",
        pheaFridge: "$ 10.00",
        mining: null,
        electricity: "$ 68.31",
        water: null,
        waste: "$ 2.50",
        additional: "$ 10.00",
        total: "$ 380.81",
    },
    {
        date: "10-Sep-2024",
        house: "$ 300.00",
        totalElect: "$ 112.40",
        rtAcFridge: "$ 22.27",
        pheaFridge: "$ 10.00",
        mining: null,
        electricity: "$ 80.14",
        water: "$ 81.63",
        waste: "$ 2.50",
        additional: "$ 10.00",
        total: "$ 474.26",
    },
    {
        date: "10-Oct-2024",
        house: "$ 300.00",
        totalElect: "$ 124.65",
        rtAcFridge: "$ 20.08",
        pheaFridge: "$ 10.00",
        mining: null,
        electricity: "$ 94.58",
        water: null,
        waste: "$ 2.50",
        additional: "$ 10.00",
        total: "$ 407.08",
    },
    {
        date: "10-Nov-2024",
        house: "$ 300.00",
        totalElect: "$ 84.04",
        rtAcFridge: "$ 20.08",
        pheaFridge: "$ 10.00",
        mining: null,
        electricity: "$ 53.97",
        water: "$ 70.23",
        waste: "$ 2.50",
        additional: "$ 10.00",
        total: "$ 436.70",
    },
    {
        date: "10-Dec-2024",
        house: "$ 300.00",
        totalElect: "$ 105.39",
        rtAcFridge: "$ 20.08",
        pheaFridge: "$ 10.00",
        mining: null,
        electricity: "$ 75.32",
        water: null,
        waste: "$ 2.50",
        additional: "$ 30.00",
        total: "$ 407.82",
    },
    {
        date: "10-Jan-2025",
        house: "$ 300.00",
        totalElect: "$ 98.12",
        rtAcFridge: "$ 20.08",
        pheaFridge: "$ 10.00",
        mining: null,
        electricity: "$ 68.05",
        water: "$ 72.08",
        waste: "$ 2.50",
        additional: "$ 30.00",
        total: "$ 472.62",
    },
    {
        date: "10-Feb-2025",
        house: "$ 300.00",
        totalElect: "$ 100.41",
        rtAcFridge: "$ 20.08",
        pheaFridge: "$ 10.00",
        mining: null,
        electricity: "$ 70.34",
        water: null,
        waste: "$ 2.50",
        additional: "$ 20.00",
        total: "$ 392.84",
    },
    {
        date: "10-Mar-2025",
        house: "$ 300.00",
        totalElect: "$ 100.07",
        rtAcFridge: "$ 20.08",
        pheaFridge: "$ 10.00",
        mining: null,
        electricity: "$ 70.00",
        water: "$ 85.59",
        waste: "$ 2.50",
        additional: "$ 20.00",
        total: "$ 478.09",
    },
];

onMounted(async () => {
    await fetchExpenses();
    if (expenses.value.length === 0) {
        console.log("No expenses found, seeding initial data...");
        await seedInitialData(expsenData);
        await fetchExpenses();
    }
});
</script>
