<!-- pages/dashboard.vue -->
<template>
    <div class="container mx-auto p-6 space-y-8">
        <!-- Header Section -->
        <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
            <div>
                <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p class="text-muted-foreground mt-1">
                    Welcome back! Here's an overview of your finances.
                </p>
            </div>
            <div class="flex items-center gap-2">
                <Button variant="outline" size="sm">
                    <CalendarIcon class="h-4 w-4 mr-2" />
                    <span>This Month</span>
                    <ChevronDownIcon class="h-4 w-4 ml-2" />
                </Button>
                <Button size="sm">
                    <DownloadIcon class="h-4 w-4 mr-2" />
                    Export
                </Button>
            </div>
        </div>

        <!-- Overview Cards -->
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <!-- Total Balance Card -->
            <Card>
                <CardHeader
                    class="flex flex-row items-center justify-between pb-2"
                >
                    <CardTitle class="text-sm font-medium">
                        Total Balance
                    </CardTitle>
                    <DollarSignIcon class="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold">
                        ${{ totalExpenses.toFixed(2) }}
                    </div>
                    <div
                        v-if="loading"
                        class="animate-pulse bg-muted h-4 w-24 rounded mt-1"
                    ></div>
                    <Progress v-else class="mt-2" :value="65" />
                </CardContent>
            </Card>

            <!-- Income Card -->
            <Card>
                <CardHeader
                    class="flex flex-row items-center justify-between pb-2"
                >
                    <CardTitle class="text-sm font-medium">
                        Monthly Income
                    </CardTitle>
                    <TrendingUpIcon class="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold">$4,980.00</div>
                    <p class="text-xs text-muted-foreground mt-1">
                        <span class="text-emerald-500 font-medium">+5.2%</span>
                        from last month
                    </p>
                    <Progress class="mt-2" value="{85}" />
                </CardContent>
            </Card>

            <!-- Expenses Card -->
            <Card>
                <CardHeader
                    class="flex flex-row items-center justify-between pb-2"
                >
                    <CardTitle class="text-sm font-medium">
                        Monthly Expenses
                    </CardTitle>
                    <TrendingDownIcon class="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold">$3,450.00</div>
                    <p class="text-xs text-muted-foreground mt-1">
                        <span class="text-rose-500 font-medium">+8.1%</span>
                        from last month
                    </p>
                    <Progress class="mt-2" value="{45}" />
                </CardContent>
            </Card>

            <!-- Savings Rate Card -->
            <Card>
                <CardHeader
                    class="flex flex-row items-center justify-between pb-2"
                >
                    <CardTitle class="text-sm font-medium">
                        Savings Rate
                    </CardTitle>
                    <PiggyBankIcon class="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold">30.7%</div>
                    <p class="text-xs text-muted-foreground mt-1">
                        <span class="text-emerald-500 font-medium">+2.3%</span>
                        from last month
                    </p>
                    <Progress class="mt-2" value="{30}" />
                </CardContent>
            </Card>
        </div>

        <!-- Charts and Tables Section -->
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <!-- Expense vs Income Chart -->
            <Card class="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Expense vs Income</CardTitle>
                    <CardDescription
                        >Monthly comparison over the last 6
                        months</CardDescription
                    >
                </CardHeader>
                <CardContent>
                    <div
                        v-if="loading"
                        class="h-[300px] flex items-center justify-center"
                    >
                        <span class="text-muted-foreground"
                            >Loading chart data...</span
                        >
                    </div>
                    <BarChart
                        v-else
                        :data="monthlyComparison"
                        :x-key="'month'"
                        :y-keys="['income', 'expense']"
                        :colors="[
                            'hsl(var(--primary))',
                            'hsl(var(--destructive))',
                        ]"
                        class="h-[300px]"
                    />
                </CardContent>
            </Card>

            <!-- Expense Breakdown Chart -->
            <Card class="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Expense Breakdown</CardTitle>
                    <CardDescription>Current month by category</CardDescription>
                </CardHeader>
                <CardContent>
                    <DonutChart
                        :data="expenseByCategory"
                        :valueKey="'value'"
                        :nameKey="'name'"
                        :colors="[
                            'hsl(var(--primary))',
                            'hsl(var(--destructive))',
                            'hsl(var(--warning))',
                            'hsl(var(--secondary))',
                            'hsl(var(--accent))',
                        ]"
                        class="h-[300px]"
                    />
                </CardContent>
            </Card>
        </div>

        <!-- Recent Transactions -->
        <Card>
            <CardHeader class="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription
                        >Your latest financial activities</CardDescription
                    >
                </div>
                <Button variant="ghost" size="sm" class="gap-1">
                    View All
                    <ArrowRightIcon class="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <div v-if="loading" class="space-y-4">
                    <div
                        v-for="i in 5"
                        :key="i"
                        class="animate-pulse flex items-center gap-4"
                    >
                        <div class="h-4 bg-muted rounded w-1/3"></div>
                        <div class="h-4 bg-muted rounded w-24"></div>
                        <div class="h-4 bg-muted rounded w-24"></div>
                        <div class="h-4 bg-muted rounded w-24 ml-auto"></div>
                    </div>
                </div>
                <Table v-else>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead class="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow
                            v-for="(transaction, i) in recentTransactions"
                            :key="i"
                        >
                            <TableCell>{{ transaction.description }}</TableCell>
                            <TableCell>
                                <Badge
                                    :variant="
                                        transaction.type === 'expense'
                                            ? 'destructive'
                                            : 'default'
                                    "
                                    class="font-normal"
                                >
                                    {{ transaction.category }}
                                </Badge>
                            </TableCell>
                            <TableCell>{{ transaction.date }}</TableCell>
                            <TableCell
                                class="text-right font-medium"
                                :class="
                                    transaction.type === 'expense'
                                        ? 'text-destructive'
                                        : 'text-emerald-600'
                                "
                            >
                                {{
                                    transaction.type === "expense" ? "-" : "+"
                                }}${{ transaction.amount }}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { BarChart, DonutChart } from "@/components/ui/charts";
import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ArrowRightIcon,
    CalendarIcon,
    ChevronDownIcon,
    DollarSignIcon,
    DownloadIcon,
    PiggyBankIcon,
    TrendingDownIcon,
    TrendingUpIcon,
} from "lucide-vue-next";
import { onMounted } from "vue";
import { useDashboard } from "~/composables/useDashboard";

const {
    loading,
    totalExpenses,
    expensesByCategory,
    recentTransactions,
    monthlyComparison,
    savingsRate,
    fetchDashboardData,
} = useDashboard();

// Fetch data on mount
onMounted(() => {
    fetchDashboardData();
});

// Remove the static ref data and use computed values instead
const incomeVsExpense = monthlyComparison;
const expenseByCategory = expensesByCategory;
</script>
