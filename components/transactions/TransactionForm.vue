<!-- components/transactions/TransactionForm.vue -->
<template>
    <div class="space-y-4">
        <form @submit.prevent="onSubmit">
            <div class="space-y-4">
                <div>
                    <label
                        for="description"
                        class="block text-sm font-medium text-gray-700"
                        >Description</label
                    >
                    <input
                        type="text"
                        id="description"
                        v-model="formData.description"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label
                        for="amount"
                        class="block text-sm font-medium text-gray-700"
                        >Amount</label
                    >
                    <input
                        type="number"
                        id="amount"
                        v-model="formData.amount"
                        min="0.01"
                        step="0.01"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label
                        for="type"
                        class="block text-sm font-medium text-gray-700"
                        >Type</label
                    >
                    <select
                        id="type"
                        v-model="formData.type"
                        @change="handleTypeChange"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
                <div>
                    <label
                        for="category"
                        class="block text-sm font-medium text-gray-700"
                        >Category</label
                    >
                    <select
                        id="category"
                        v-model="formData.category"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    >
                        <option
                            v-if="formData.type === 'income'"
                            v-for="category in incomeCategories"
                            :key="category"
                            :value="category"
                        >
                            {{ category }}
                        </option>
                        <option
                            v-if="formData.type === 'expense'"
                            v-for="category in expenseCategories"
                            :key="category"
                            :value="category"
                        >
                            {{ category }}
                        </option>
                    </select>
                </div>
                <div>
                    <label
                        for="date"
                        class="block text-sm font-medium text-gray-700"
                        >Date</label
                    >
                    <input
                        type="date"
                        id="date"
                        v-model="formData.date"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>
            </div>
            <div
                class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense"
            >
                <button
                    type="submit"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                >
                    {{ submitButtonText }}
                </button>
                <button
                    type="button"
                    @click="emitCancel"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                    Cancel
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";
import type { Transaction } from "~/types/transaction";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "~/types/transaction";

const props = defineProps<{
    transaction?: Transaction;
    submitButtonText?: string;
}>();

const emit = defineEmits<{
    (e: "submit", transaction: Transaction): void;
    (e: "cancel"): void;
}>();

// Set default values
const defaultTransaction: Transaction = {
    description: "",
    amount: 0,
    type: "expense",
    category: "",
    date: new Date().toISOString().slice(0, 10),
};

// Use reactive to track form data
const formData = reactive<Transaction>({
    ...defaultTransaction,
    ...props.transaction,
});

// Category options
const incomeCategories = INCOME_CATEGORIES;
const expenseCategories = EXPENSE_CATEGORIES;

// Set default category when type changes
const handleTypeChange = () => {
    // Reset category when type changes
    formData.category =
        formData.type === "income" ? incomeCategories[0] : expenseCategories[0];
};

// Set the default category when component mounts
onMounted(() => {
    if (!formData.category) {
        formData.category =
            formData.type === "income"
                ? incomeCategories[0]
                : expenseCategories[0];
    }
});

// Default submit button text
const submitButtonText = computed(
    () => props.submitButtonText || (props.transaction?.id ? "Update" : "Add")
);

// Handle form submission
const onSubmit = () => {
    emit("submit", { ...formData });
};

// Handle cancel button
const emitCancel = () => {
    emit("cancel");
};
</script>
