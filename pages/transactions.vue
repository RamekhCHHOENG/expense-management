<!-- pages/transactions.vue -->
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
                        @click="showAddTransactionModal = true"
                        class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        Add Transaction
                    </button>
                </div>
            </div>

            <!-- Transactions Table -->
            <div class="bg-white shadow rounded-lg">
                <div class="p-6">
                    <div v-if="financeStore.loading" class="text-center py-4">
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
                        No transactions found. Add your first transaction to get
                        started!
                    </div>
                    <div v-else class="mt-4">
                        <div
                            class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8"
                        >
                            <div
                                class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8"
                            >
                                <table
                                    class="min-w-full divide-y divide-gray-300"
                                >
                                    <thead>
                                        <tr>
                                            <th
                                                scope="col"
                                                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                                            >
                                                Description
                                            </th>
                                            <th
                                                scope="col"
                                                class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Category
                                            </th>
                                            <th
                                                scope="col"
                                                class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Date
                                            </th>
                                            <th
                                                scope="col"
                                                class="py-3.5 px-3 text-right text-sm font-semibold text-gray-900"
                                            >
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200">
                                        <tr
                                            v-for="transaction in sortedTransactions"
                                            :key="transaction.id"
                                        >
                                            <td
                                                class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0"
                                            >
                                                {{ transaction.description }}
                                            </td>
                                            <td
                                                class="whitespace-nowrap py-4 px-3 text-sm text-gray-500"
                                            >
                                                {{ transaction.category }}
                                            </td>
                                            <td
                                                class="whitespace-nowrap py-4 px-3 text-sm text-gray-500"
                                            >
                                                {{
                                                    formatDate(transaction.date)
                                                }}
                                            </td>
                                            <td
                                                :class="[
                                                    'whitespace-nowrap py-4 px-3 text-sm text-right font-medium',
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
                                                }}${{
                                                    formatAmount(
                                                        transaction.amount
                                                    )
                                                }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
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

// Sort transactions by date (most recent first)
const sortedTransactions = computed(() => {
    return [...financeStore.transactions].sort(
        (a, b) => b.date.getTime() - a.date.getTime()
    );
});

const formatAmount = (amount: number) => {
    return amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};
</script>
