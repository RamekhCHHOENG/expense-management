<!-- pages/dashboard.vue -->
<template>
    <div class="container mx-auto p-8 space-y-8">
        <div class="flex items-center justify-between mb-8">
            <h1 class="text-4xl font-bold tracking-tight">Dashboard</h1>
            <Button v-if="!loading" variant="outline" @click="fetchUsers">
                <RefreshCcw class="mr-2 h-4 w-4" />
                Refresh
            </Button>
        </div>

        <div v-if="loading" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card v-for="i in 3" :key="i" class="shadow-md">
                <CardHeader>
                    <CardTitle>
                        <div
                            class="h-4 w-24 bg-muted animate-pulse rounded"
                        ></div>
                    </CardTitle>
                    <CardDescription>
                        <div
                            class="h-3 w-32 bg-muted animate-pulse rounded"
                        ></div>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="h-[200px] bg-muted animate-pulse rounded"></div>
                </CardContent>
            </Card>
        </div>

        <div v-else class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card class="shadow-md">
                <CardHeader>
                    <CardTitle>Total Users</CardTitle>
                    <CardDescription>Overall user count</CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="flex items-center space-x-4">
                        <Users class="h-8 w-8 text-primary" />
                        <div class="text-4xl font-bold">{{ totalUsers }}</div>
                    </div>
                </CardContent>
            </Card>

            <Card class="shadow-md">
                <CardHeader>
                    <CardTitle>Active vs Inactive Users</CardTitle>
                    <CardDescription
                        >Based on last login activity</CardDescription
                    >
                </CardHeader>
                <CardContent class="h-[200px]">
                    <DonutChart
                        :data="activeInactiveUsers"
                        :colors="['hsl(var(--primary))', 'hsl(var(--muted))']"
                    />
                </CardContent>
            </Card>

            <Card class="shadow-md">
                <CardHeader>
                    <CardTitle>New Users by Month</CardTitle>
                    <CardDescription
                        >Monthly registration trend</CardDescription
                    >
                </CardHeader>
                <CardContent class="h-[200px]">
                    <BarChart
                        :data="usersByMonth"
                        :x-key="'month'"
                        :y-key="'count'"
                        :color="'hsl(var(--primary))'"
                    />
                </CardContent>
            </Card>
        </div>

        <Card class="shadow-md">
            <CardHeader>
                <CardTitle>User Growth Over Time</CardTitle>
                <CardDescription>Cumulative user growth trend</CardDescription>
            </CardHeader>
            <CardContent class="h-[300px]">
                <AreaChart
                    :data="userGrowthData"
                    :x-key="'month'"
                    :y-key="'total'"
                    :color="'hsl(var(--primary))'"
                />
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { RefreshCcw, Users } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { Button } from "~/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { AreaChart, BarChart, DonutChart } from "~/components/ui/charts";
import { getUsersService, initializeFirestore } from "~/services/firestore";
import type { UserProfile } from "~/types/user";

const { $firebase } = useNuxtApp();
initializeFirestore($firebase);

const users = ref<UserProfile[]>([]);
const loading = ref(true);

// Fetch users data
const fetchUsers = async () => {
    try {
        loading.value = true;
        users.value = await getUsersService();
    } catch (error) {
        console.error("Error fetching users:", error);
    } finally {
        loading.value = false;
    }
};

// Analytics computed properties
const totalUsers = computed(() => users.value.length);

const usersByMonth = computed(() => {
    const months: Record<string, number> = {};
    users.value.forEach((user) => {
        const date = user.createdAt;
        const monthYear = date.toLocaleString("default", {
            month: "short",
            year: "numeric",
        });
        months[monthYear] = (months[monthYear] || 0) + 1;
    });
    return Object.entries(months).map(([month, count]) => ({
        month,
        count,
    }));
});

const activeInactiveUsers = computed(() => {
    const active = users.value.filter((user) => user.lastLoginAt).length;
    const inactive = users.value.length - active;
    return [
        { name: "Active", value: active },
        { name: "Inactive", value: inactive },
    ];
});

const userGrowthData = computed(() => {
    const monthlyData: Record<string, number> = {};
    users.value.forEach((user) => {
        const date = user.createdAt;
        const monthYear = date.toLocaleString("default", {
            month: "short",
            year: "numeric",
        });
        monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
    });

    let cumulative = 0;
    return Object.entries(monthlyData).map(([month, count]) => {
        cumulative += count;
        return {
            month,
            total: cumulative,
        };
    });
});

onMounted(() => {
    fetchUsers();
});
</script>
