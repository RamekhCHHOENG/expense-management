<template>
    <div class="space-y-4 mt-4">
        <DataTable
            :columns="columns"
            :data="expenses"
            :pagination="pagination"
            :loading="loading"
            :sorting="sorting"
            @option-change="handleOptionChange"
            @update:sorting="sorting = $event"
        >
            <template #toolbar>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <Input
                            v-model="search"
                            placeholder="Search expenses..."
                            class="h-8 w-[150px] lg:w-[250px]"
                        >
                            <template #prefix>
                                <MagnifyingGlassIcon class="h-4 w-4" />
                            </template>
                        </Input>
                    </div>
                </div>
            </template>
        </DataTable>

        <!-- Pagination -->
        <DataPagination
            :current-page="pagination.currentPage"
            :items-per-page="pagination.pageSize"
            :total-items="pagination.totalItems"
            @update:current-page="handlePageChange"
        />
    </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from "@heroicons/vue/20/solid";
import type { ColumnDef, SortingState } from "@tanstack/table-core";
import { computed, markRaw, ref, watch } from "vue";
import { DataTable } from "~/components/data-table";
import DataPagination from "~/components/ui/data-pagination.vue";
import { Input } from "~/components/ui/input";
import type { Expense } from "~/types/expense";
import type { Pagination } from "~/types/table";
import { formatNumber } from "~/utils/format";
import ExpenseActions from "./expense-actions.vue";

const props = defineProps<{
    expenses: Expense[];
    pagination: Pagination;
    loading?: boolean;
    totalItems?: number;
}>();

const emit = defineEmits<{
    (e: "option-change", options: any): void;
    (e: "view", expense: Expense): void;
    (e: "edit", expense: Expense): void;
    (e: "delete", expense: Expense): void;
}>();

const search = ref("");
const sorting = ref<SortingState>([{ id: "date", desc: true }]); // Default sort by date descending

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
};

const calculateTotal = (expense: Expense): number => {
    return (
        expense.house +
        (expense.totalElect || 0) +
        (expense.rtAcFridge || 0) +
        (expense.pheaFridge || 0) +
        (expense.mining || 0) +
        expense.electricity +
        (expense.water || 0) +
        (expense.waste || 0) +
        (expense.additional || 0)
    );
};

interface Row {
    getValue<T>(key: string): T;
    original: Expense;
}

const columns = computed<ColumnDef<Expense>[]>(() => [
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => formatDate(row.original.date),
        sortingFn: (rowA, rowB) => {
            const dateA = new Date(rowA.original.date);
            const dateB = new Date(rowB.original.date);
            return dateB.getTime() - dateA.getTime(); // Descending by default
        },
    },
    {
        accessorKey: "house",
        header: "House",
        cell: ({ row }) => formatNumber(row.original.house),
    },
    {
        accessorKey: "totalElect",
        header: "Total Elect",
        cell: ({ row }) => formatNumber(row.original.totalElect),
    },
    {
        accessorKey: "rtAcFridge",
        header: "RT AC & Fridge",
        cell: ({ row }) => formatNumber(row.original.rtAcFridge),
    },
    {
        accessorKey: "pheaFridge",
        header: "Phea Fridge",
        cell: ({ row }) => formatNumber(row.original.pheaFridge),
    },
    {
        accessorKey: "mining",
        header: "Mining",
        cell: ({ row }) => formatNumber(row.original.mining),
    },
    {
        accessorKey: "electricity",
        header: "Electricity",
        cell: ({ row }) => formatNumber(row.original.electricity),
    },
    {
        accessorKey: "water",
        header: "Water",
        cell: ({ row }) => formatNumber(row.original.water),
    },
    {
        accessorKey: "waste",
        header: "Waste",
        cell: ({ row }) => formatNumber(row.original.waste),
    },
    {
        accessorKey: "additional",
        header: "Additional",
        cell: ({ row }) => formatNumber(row.original.additional),
    },
    {
        id: "total",
        header: "Total",
        cell: ({ row }) => formatNumber(calculateTotal(row.original)),
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => ({
            component: markRaw(ExpenseActions),
            props: {
                expense: row.original,
                onView: (expense: Expense) => emit("view", expense),
                onEdit: (expense: Expense) => emit("edit", expense),
                onDelete: (expense: Expense) => emit("delete", expense),
            },
        }),
    },
]);

const handleOptionChange = (options: any) => {
    emit("option-change", {
        ...options,
        sort: sorting.value,
        search: search.value,
    });
};

// Watch for changes in sorting or search to trigger a refresh
watch(
    [sorting, search],
    () => {
        handleOptionChange({
            page: 1, // Reset to first page when sorting or searching
            limit: props.pagination.pageSize,
        });
    },
    { deep: true }
);

const totalItems = computed(() => props.totalItems || props.expenses.length);

const handlePageChange = (page: number) => {
    emit("option-change", {
        page,
        limit: props.pagination.pageSize,
        sort: sorting.value,
        search: search.value,
    });
};
</script>
