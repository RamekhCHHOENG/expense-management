<template>
    <PageContainer
        title="Additional Expense Types"
        description="Manage additional expense types for rental expenses"
        :show-add-button="true"
        add-button-text="Add Type"
        @add="handleAddType"
    >
        <ExpenseTypeList
            :expense-types="expenseTypes"
            :loading="loading"
            @edit="handleEditType"
            @delete="handleDeleteType"
        />
    </PageContainer>

    <ExpenseTypeFormDialog
        v-model:open="showForm"
        :expense-type="selectedType"
        @submit="handleSubmitType"
    />

    <ExpenseTypeDelete
        v-model:open="showDeleteConfirm"
        :is-deleting="isDeleting"
        @delete="confirmDelete"
    />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import ExpenseTypeDelete from "~/components/additional-expense-types/expense-type-delete.vue";
import ExpenseTypeFormDialog from "~/components/additional-expense-types/expense-type-form-dialog.vue";
import ExpenseTypeList from "~/components/additional-expense-types/expense-type-list.vue";
import PageContainer from "~/components/ui/page-container.vue";
import { useAdditionalExpenseTypes } from "~/composables/useAdditionalExpenseTypes";
import type { AdditionalExpenseType } from "~/types/additional-expense-type";

const {
    expenseTypes,
    loading,
    fetchExpenseTypes,
    addExpenseType,
    updateExpenseType,
    deleteExpenseType,
    initializeDefaultTypes,
} = useAdditionalExpenseTypes();

const showForm = ref(false);
const showDeleteConfirm = ref(false);
const selectedType = ref<AdditionalExpenseType | undefined>();
const isDeleting = ref(false);

const handleAddType = () => {
    selectedType.value = undefined;
    showForm.value = true;
};

const handleEditType = (type: AdditionalExpenseType) => {
    selectedType.value = type;
    showForm.value = true;
};

const handleDeleteType = (type: AdditionalExpenseType) => {
    selectedType.value = type;
    showDeleteConfirm.value = true;
};

const handleSubmitType = async (
    type: Omit<AdditionalExpenseType, "id" | "createdAt" | "updatedAt">
) => {
    try {
        if (selectedType.value) {
            await updateExpenseType({
                ...type,
                id: selectedType.value.id,
            } as AdditionalExpenseType);
        } else {
            await addExpenseType(type as AdditionalExpenseType);
        }
        showForm.value = false;
        selectedType.value = undefined;
    } catch (error) {
        console.error("Error submitting expense type:", error);
    }
};

const confirmDelete = async () => {
    if (!selectedType.value) return;

    try {
        isDeleting.value = true;
        await deleteExpenseType(selectedType.value);
        showDeleteConfirm.value = false;
        selectedType.value = undefined;
    } catch (error) {
        console.error("Error deleting expense type:", error);
    } finally {
        isDeleting.value = false;
    }
};

onMounted(async () => {
    await initializeDefaultTypes();
    await fetchExpenseTypes();
});
</script>
