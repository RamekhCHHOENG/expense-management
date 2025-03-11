<template>
    <div class="container py-6">
        <h1 class="text-3xl font-bold">Analytics</h1>
        <div class="mt-6">
            <!-- Analytics content will go here -->
            <p>View your expense analytics and reports here.</p>
        </div>
    </div>
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