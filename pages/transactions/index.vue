<!-- pages/transactions/index.vue -->
<template>
    <DashboardLayout>
        <div class="space-y-6">
            <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto">
                    <h1 class="text-xl font-semibold text-gray-900">
                        Transactions
                    </h1>
                    <p class="mt-2 text-sm text-gray-700">
                        A list of all your transactions including their amount,
                        type, and category.
                    </p>
                </div>
                <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        @click="openModal('add')"
                        class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        Add Transaction
                    </button>
                </div>
            </div>

            <!-- Transactions List -->
            <TransactionList
                :transactions="transactionsForDisplay"
                :loading="financeStore.loading"
                :error="financeStore.error || ''"
                empty-message="No transactions found. Add your first transaction to get started!"
                @edit="editTransaction"
                @delete="deleteTransaction"
            />
        </div>

        <!-- Transaction Modal -->
        <TransactionModal
            v-model="showModal"
            :mode="modalMode"
            :transaction="currentTransaction"
            @submit="saveTransaction"
        />
    </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from "@/layouts/dashboard.vue";
import { computed, reactive, ref } from "vue";
import TransactionList from "~/components/transactions/TransactionList.vue";
import TransactionModal from "~/components/transactions/TransactionModal.vue";
import type { Transaction as StoreTransaction } from "~/stores/finance";
import { useFinanceStore } from "~/stores/finance";
import type { Transaction } from "~/types/transaction";

// Define the page meta for middleware
definePageMeta({
    middleware: ["auth"],
});

const financeStore = useFinanceStore();
const showModal = ref(false);
const modalMode = ref<"add" | "edit">("add");
const currentTransaction = reactive<Transaction>({
    id: "",
    description: "",
    amount: 0,
    type: "expense",
    category: "",
    date: new Date().toISOString().slice(0, 10),
});

// Fetch transactions when component mounts
financeStore.fetchTransactions();

// Convert store transactions to Transaction type format
const transactionsForDisplay = computed(() => {
    return financeStore.transactions.map((t) => ({
        id: t.id,
        description: t.description,
        amount: t.amount,
        type: t.type,
        category: t.category,
        date:
            typeof t.date === "string"
                ? t.date
                : t.date.toISOString().split("T")[0],
    }));
});

// Open modal for adding or editing
const openModal = (mode: "add" | "edit") => {
    modalMode.value = mode;
    if (mode === "add") {
        resetTransaction();
    }
    showModal.value = true;
};

// Edit transaction
const editTransaction = (transaction: Transaction) => {
    Object.assign(currentTransaction, {
        ...transaction,
        date: new Date(transaction.date).toISOString().slice(0, 10),
    });
    openModal("edit");
};

// Delete transaction
const deleteTransaction = async (transaction: Transaction) => {
    if (
        transaction.id &&
        confirm("Are you sure you want to delete this transaction?")
    ) {
        await financeStore.deleteTransaction(transaction.id);
    }
};

// Save transaction
const saveTransaction = async (transaction: Transaction) => {
    try {
        if (modalMode.value === "edit" && transaction.id) {
            // Convert to the format needed by updateTransaction
            const storeUpdates: Partial<StoreTransaction> = {
                description: transaction.description,
                amount: transaction.amount,
                type: transaction.type,
                category: transaction.category,
                date: new Date(transaction.date),
            };

            // Call updateTransaction with id and updates
            await financeStore.updateTransaction(transaction.id, storeUpdates);
        } else {
            // Convert to the format needed by addTransaction
            const storeTransaction = {
                description: transaction.description,
                amount: transaction.amount,
                type: transaction.type,
                category: transaction.category,
                date: new Date(transaction.date),
            };

            // Call addTransaction with the transaction data
            await financeStore.addTransaction(storeTransaction);
        }
        resetTransaction();
    } catch (error) {
        console.error("Error saving transaction:", error);
    }
};

// Reset transaction form
const resetTransaction = () => {
    Object.assign(currentTransaction, {
        id: "",
        description: "",
        amount: 0,
        type: "expense",
        category: "",
        date: new Date().toISOString().slice(0, 10),
    });
};
</script>
