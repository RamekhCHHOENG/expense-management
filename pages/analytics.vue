<template>
    <DashboardLayout>
        <div class="space-y-6">
            <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto">
                    <h1 class="text-xl font-semibold text-gray-900">Analytics</h1>
                    <p class="mt-2 text-sm text-gray-700">
                        View detailed insights about your income and expenses.
                    </p>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <!-- Monthly Overview -->
                <div class="bg-white shadow rounded-lg">
                    <div class="p-6">
                        <h2 class="text-lg font-medium text-gray-900 mb-4">Monthly Overview</h2>
                        <div class="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                            <p class="text-gray-500">Monthly trend chart coming soon...</p>
                        </div>
                    </div>
                </div>

                <!-- Category Distribution -->
                <div class="bg-white shadow rounded-lg">
                    <div class="p-6">
                        <h2 class="text-lg font-medium text-gray-900 mb-4">Expense Distribution</h2>
                        <div class="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                            <p class="text-gray-500">Category pie chart coming soon...</p>
                        </div>
                    </div>
                </div>

                <!-- Income vs Expenses -->
                <div class="bg-white shadow rounded-lg">
                    <div class="p-6">
                        <h2 class="text-lg font-medium text-gray-900 mb-4">Income vs Expenses</h2>
                        <div class="space-y-4">
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-sm font-medium text-gray-900">Income</span>
                                    <span class="text-sm text-green-600">${{ formatAmount(totalIncome) }}</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        class="bg-green-500 h-2 rounded-full"
                                        :style="{ width: incomePercentage + '%' }"
                                    ></div>
                                </div>
                            </div>
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-sm font-medium text-gray-900">Expenses</span>
                                    <span class="text-sm text-red-600">${{ formatAmount(totalExpenses) }}</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        class="bg-red-500 h-2 rounded-full"
                                        :style="{ width: expensePercentage + '%' }"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Top Categories -->
                <div class="bg-white shadow rounded-lg">
                    <div class="p-6">
                        <h2 class="text-lg font-medium text-gray-900 mb-4">Top Expense Categories</h2>
                        <div class="space-y-4">
                            <div
                                v-for="category in topExpenseCategories"
                                :key="category.name"
                                class="bg-gray-50 p-4 rounded-lg"
                            >
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-sm font-medium text-gray-900">{{ category.name }}</span>
                                    <span class="text-sm text-gray-600">${{ formatAmount(category.amount) }}</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        class="bg-indigo-500 h-2 rounded-full"
                                        :style="{ width: (category.amount / totalExpenses * 100) + '%' }"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { useFinanceStore } from '~/stores/finance';

definePageMeta({
    middleware: ['auth']
});

const financeStore = useFinanceStore();

const totalIncome = computed(() => financeStore.totalIncome);
const totalExpenses = computed(() => financeStore.totalExpenses);

const total = computed(() => totalIncome.value + totalExpenses.value);
const incomePercentage = computed(() => total.value ? (totalIncome.value / total.value) * 100 : 0);
const expensePercentage = computed(() => total.value ? (totalExpenses.value / total.value) * 100 : 0);

// Calculate top expense categories
const topExpenseCategories = computed(() => {
    const categories = new Map<string, number>();
    
    financeStore.transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            categories.set(
                t.category,
                (categories.get(t.category) || 0) + t.amount
            );
        });

    return Array.from(categories.entries())
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);
});

const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};
</script> 