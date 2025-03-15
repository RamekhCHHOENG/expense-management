<template>
    <PageContainer
        title="Rental House Expenses"
        description="Manage your rental house expenses"
        show-add-button
        add-button-text="Add Expense"
        @add="handleAddClick"
    >
        <ExpenseList
            :expenses="expenses"
            :loading="loading"
            :pagination="pagination"
            @view="handleViewExpense"
            @edit="handleEditClick"
            @delete="handleDeleteClick"
            @option-change="handleOptionChange"
        />

        <ExpenseView
            v-if="showViewDialog"
            :expense="selectedExpense"
            :open="showViewDialog"
            :is-edit="isEdit"
            @update:open="showViewDialog = $event"
            @save="handleSaveExpense"
        />

        <ExpenseDelete
            v-if="selectedExpense"
            :expense="selectedExpense"
            :is-open="showDeleteDialog"
            @update:is-open="showDeleteDialog = $event"
            @delete="handleDeleteExpense"
        />
    </PageContainer>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import ExpenseDelete from "~/components/rental-expenses/expense-delete.vue";
import ExpenseList from "~/components/rental-expenses/expense-list.vue";
import ExpenseView from "~/components/rental-expenses/expense-view.vue";
import PageContainer from "~/components/ui/page-container.vue";
import { useExpenses } from "~/composables/useExpenses";
import { useOfflineDetection } from "~/composables/useOfflineDetection";
import type { Expense } from "~/types/expense";

// Component setup
const {
    expenses,
    loading,
    pagination,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
} = useExpenses();

const { handleFirebaseError } = useOfflineDetection();

// State management
const selectedExpense = ref<Expense | undefined>();
const showViewDialog = ref(false);
const showDeleteDialog = ref(false);
const isEdit = ref(false);

// Fetch expenses on mount
onMounted(async () => {
    try {
        await fetchExpenses();
    } catch (error) {
        handleFirebaseError(error);
    }
});

// Event handlers
const handleSaveExpense = async (
    formData: Omit<Expense, "id" | "createdAt" | "updatedAt">
) => {
    try {
        if (isEdit.value && selectedExpense.value) {
            await updateExpense({
                ...selectedExpense.value,
                ...formData,
                totalElect: formData.totalElect || null,
                rtAcFridge: formData.rtAcFridge || null,
                pheaFridge: formData.pheaFridge || null,
                mining: formData.mining || null,
                water: formData.water || null,
                waste: formData.waste || null,
                additional: formData.additional || null,
                users: formData.users.map((user) => ({
                    ...user,
                    email: user.email || "",
                    electricityShare: user.electricityShare || 0,
                })),
            });
        } else {
            await addExpense({
                ...formData,
                totalElect: null,
                rtAcFridge: null,
                pheaFridge: null,
                mining: null,
                water: formData.water || null,
                waste: formData.waste || null,
                additional: formData.additional || null,
                users: formData.users.map((user) => ({
                    ...user,
                    email: user.email || "",
                    electricityShare: user.electricityShare || 0,
                })),
            } as Expense);
        }
        showViewDialog.value = false;
        selectedExpense.value = undefined;
        isEdit.value = false;
    } catch (error) {
        handleFirebaseError(error);
    }
};

const handleDeleteExpense = async (expense: Expense) => {
    try {
        await deleteExpense(expense);
        showDeleteDialog.value = false;
        selectedExpense.value = undefined;
    } catch (error) {
        handleFirebaseError(error);
    }
};

const handleViewExpense = (expense: Expense) => {
    selectedExpense.value = expense;
    isEdit.value = false;
    showViewDialog.value = true;
};

const handleEditClick = (expense: Expense) => {
    selectedExpense.value = expense;
    isEdit.value = true;
    showViewDialog.value = true;
};

const handleDeleteClick = (expense: Expense) => {
    selectedExpense.value = expense;
    showDeleteDialog.value = true;
};

const handleAddClick = () => {
    selectedExpense.value = undefined;
    isEdit.value = true;
    showViewDialog.value = true;
};

const handleOptionChange = async (options: any) => {
    try {
        await fetchExpenses(options);
    } catch (error) {
        handleFirebaseError(error);
    }
};
</script>
