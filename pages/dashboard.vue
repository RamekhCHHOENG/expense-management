<!-- pages/dashboard.vue -->
<template>
    <DashboardLayout>
        <div class="space-y-6">
            <!-- Recent Transactions -->
            <div class="bg-white shadow rounded-lg">
                <div class="p-6">
                    <h2 class="text-lg font-medium text-gray-900">
                        Recent Transactions
                    </h2>
                    <div class="mt-4">
                        <div
                            v-if="financeStore.loading"
                            class="text-center py-4"
                        >
                            Loading transactions...
                        </div>
                        <div
                            v-else-if="financeStore.error"
                            class="text-center py-4 text-red-600"
                        >
                            {{ financeStore.error }}
                        </div>
                        <div
                            v-else-if="financeStore.transactions.length === 0"
                            class="text-center py-4 text-gray-500"
                        >
                            No transactions found. Add your first transaction to
                            get started!
                        </div>
                        <div v-else class="flow-root">
                            <ul
                                role="list"
                                class="-my-5 divide-y divide-gray-200"
                            >
                                <li
                                    v-for="transaction in recentTransactions"
                                    :key="transaction.id"
                                    class="py-4"
                                >
                                    <div class="flex items-center space-x-4">
                                        <div class="flex-shrink-0">
                                            <span
                                                :class="[
                                                    'inline-flex items-center justify-center h-8 w-8 rounded-full',
                                                    transaction.type ===
                                                    'income'
                                                        ? 'bg-green-100'
                                                        : 'bg-red-100',
                                                ]"
                                            >
                                                <span
                                                    :class="[
                                                        'text-xs font-medium',
                                                        transaction.type ===
                                                        'income'
                                                            ? 'text-green-600'
                                                            : 'text-red-600',
                                                    ]"
                                                >
                                                    {{
                                                        transaction.type ===
                                                        "income"
                                                            ? "+"
                                                            : "-"
                                                    }}
                                                </span>
                                            </span>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p
                                                class="text-sm font-medium text-gray-900 truncate"
                                            >
                                                {{ transaction.description }}
                                            </p>
                                            <p
                                                class="text-sm text-gray-500 truncate"
                                            >
                                                {{ transaction.category }}
                                            </p>
                                        </div>
                                        <div>
                                            <span
                                                :class="[
                                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                                    transaction.type ===
                                                    'income'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800',
                                                ]"
                                            >
                                                ${{
                                                    formatAmount(
                                                        transaction.amount
                                                    )
                                                }}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Add Transaction Button -->
            <div class="flex justify-end">
                <button
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    @click="showAddTransactionModal = true"
                >
                    Add Transaction
                </button>
            </div>
        </div>

        <!-- Add Transaction Modal -->
        <AddTransactionModal v-model="showAddTransactionModal" />
    </DashboardLayout>
</template>

<script setup lang="ts">
import AddTransactionModal from "~/components/dashboard/AddTransactionModal.vue";
import { useFinanceStore } from "~/stores/finance";

definePageMeta({
    middleware: ["auth"],
});

const financeStore = useFinanceStore();
const showAddTransactionModal = ref(false);

// Get the 5 most recent transactions
const recentTransactions = computed(() => {
    return [...financeStore.transactions]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5);
});

const formatAmount = (amount: number) => {
    return amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};
</script>
