<!-- pages/categories.vue -->
<template>
    <DashboardLayout>
        <div class="space-y-6">
            <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto">
                    <h1 class="text-xl font-semibold text-gray-900">
                        Categories
                    </h1>
                    <p class="mt-2 text-sm text-gray-700">
                        Manage your income and expense categories.
                    </p>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <!-- Income Categories -->
                <div class="bg-white shadow rounded-lg">
                    <div class="p-6">
                        <h2 class="text-lg font-medium text-gray-900 mb-4">
                            Income Categories
                        </h2>
                        <div class="space-y-4">
                            <div
                                v-for="category in incomeCategories"
                                :key="category"
                                class="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                            >
                                <span
                                    class="text-sm font-medium text-gray-900"
                                    >{{ category }}</span
                                >
                                <span class="text-sm text-gray-500">
                                    ${{
                                        formatAmount(
                                            getCategoryTotal("income", category)
                                        )
                                    }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Expense Categories -->
                <div class="bg-white shadow rounded-lg">
                    <div class="p-6">
                        <h2 class="text-lg font-medium text-gray-900 mb-4">
                            Expense Categories
                        </h2>
                        <div class="space-y-4">
                            <div
                                v-for="category in expenseCategories"
                                :key="category"
                                class="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                            >
                                <span
                                    class="text-sm font-medium text-gray-900"
                                    >{{ category }}</span
                                >
                                <span class="text-sm text-gray-500">
                                    ${{
                                        formatAmount(
                                            getCategoryTotal(
                                                "expense",
                                                category
                                            )
                                        )
                                    }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { useFinanceStore } from "~/stores/finance";

definePageMeta({
    middleware: ["auth"],
});

const financeStore = useFinanceStore();

const incomeCategories = ["Salary", "Freelance", "Investments", "Other Income"];

const expenseCategories = [
    "Food",
    "Transport",
    "Bills",
    "Shopping",
    "Entertainment",
    "Healthcare",
    "Other Expenses",
];

const getCategoryTotal = (type: "income" | "expense", category: string) => {
    return financeStore.transactions
        .filter((t) => t.type === type && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
};

const formatAmount = (amount: number) => {
    return amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};
</script>
