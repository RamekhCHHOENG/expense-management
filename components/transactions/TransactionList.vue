<!-- components/transactions/TransactionList.vue -->
<template>
    <div class="bg-white shadow rounded-lg">
        <div class="p-6">
            <div v-if="loading" class="text-center py-4">
                Loading transactions...
            </div>
            <div v-else-if="error" class="text-center py-4 text-red-600">
                {{ error }}
            </div>
            <div
                v-else-if="transactions.length === 0"
                class="text-center py-4 text-gray-500"
            >
                {{ emptyMessage }}
            </div>
            <div v-else class="mt-4">
                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div
                        class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8"
                    >
                        <table class="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                                    >
                                        Date
                                    </th>
                                    <th
                                        scope="col"
                                        class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
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
                                        Type
                                    </th>
                                    <th
                                        scope="col"
                                        class="py-3.5 px-3 text-right text-sm font-semibold text-gray-900"
                                    >
                                        Amount
                                    </th>
                                    <th
                                        scope="col"
                                        class="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0"
                                    >
                                        <span class="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                <tr
                                    v-for="transaction in transactions"
                                    :key="transaction.id"
                                >
                                    <td
                                        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0"
                                    >
                                        {{ formatDate(transaction.date) }}
                                    </td>
                                    <td
                                        class="whitespace-nowrap py-4 px-3 text-sm text-gray-500"
                                    >
                                        {{ transaction.description }}
                                    </td>
                                    <td
                                        class="whitespace-nowrap py-4 px-3 text-sm text-gray-500"
                                    >
                                        {{ transaction.category }}
                                    </td>
                                    <td
                                        class="whitespace-nowrap py-4 px-3 text-sm"
                                    >
                                        <span
                                            :class="{
                                                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium': true,
                                                'bg-green-100 text-green-800':
                                                    transaction.type ===
                                                    'income',
                                                'bg-red-100 text-red-800':
                                                    transaction.type ===
                                                    'expense',
                                            }"
                                        >
                                            {{ capitalize(transaction.type) }}
                                        </span>
                                    </td>
                                    <td
                                        class="whitespace-nowrap py-4 px-3 text-sm text-right font-medium"
                                        :class="{
                                            'text-green-600':
                                                transaction.type === 'income',
                                            'text-red-600':
                                                transaction.type === 'expense',
                                        }"
                                    >
                                        {{ formatAmount(transaction.amount) }}
                                    </td>
                                    <td
                                        class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 md:pr-0"
                                    >
                                        <button
                                            @click="$emit('edit', transaction)"
                                            class="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            @click="
                                                $emit('delete', transaction)
                                            "
                                            class="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTransactionFormat } from "~/composables/useTransactionFormat";
import type { Transaction } from "~/types/transaction";

const props = defineProps<{
    transactions: Transaction[];
    loading?: boolean;
    error?: string;
    emptyMessage?: string;
}>();

const emit = defineEmits<{
    (e: "edit", transaction: Transaction): void;
    (e: "delete", transaction: Transaction): void;
}>();

// Use the transaction format composable
const { formatDate, formatAmount, capitalize } = useTransactionFormat();
</script>
