<!-- Dashboard Layout -->
<template>
    <div class="flex-1 overflow-auto bg-gray-50">
        <!-- Main Content -->
        <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <!-- Summary Cards -->
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <!-- Income Card -->
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <svg
                                    class="h-6 w-6 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">
                                        Total Income
                                    </dt>
                                    <dd class="text-lg font-semibold text-gray-900">
                                        ${{ formatAmount(totalIncome) }}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Expenses Card -->
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <svg
                                    class="h-6 w-6 text-red-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M20 12H4"
                                    />
                                </svg>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">
                                        Total Expenses
                                    </dt>
                                    <dd class="text-lg font-semibold text-gray-900">
                                        ${{ formatAmount(totalExpenses) }}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Savings Card -->
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <svg
                                    class="h-6 w-6 text-blue-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">
                                        Net Savings
                                    </dt>
                                    <dd
                                        :class="[
                                            'text-lg font-semibold',
                                            netSavings >= 0
                                                ? 'text-green-600'
                                                : 'text-red-600',
                                        ]"
                                    >
                                        ${{ formatAmount(netSavings) }}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content Slot -->
            <div class="mt-8">
                <slot></slot>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useFinanceStore } from '~/stores/finance';

const authStore = useAuthStore();
const financeStore = useFinanceStore();

// Load transactions when component mounts
onMounted(() => {
    financeStore.fetchTransactions();
});

const totalIncome = computed(() => financeStore.totalIncome);
const totalExpenses = computed(() => financeStore.totalExpenses);
const netSavings = computed(() => financeStore.netSavings);

const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};
</script> 