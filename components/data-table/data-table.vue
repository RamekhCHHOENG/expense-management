<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <slot name="toolbar" />
        </div>

        <div class="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead
                            v-for="column in columns"
                            :key="getColumnKey(column)"
                            :class="[
                                'cursor-pointer select-none',
                                getSortDirection(column) === 'asc' &&
                                    'sort-asc',
                                getSortDirection(column) === 'desc' &&
                                    'sort-desc',
                            ]"
                            @click="handleSort(column)"
                        >
                            {{ column.header }}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="loading">
                        <TableRow>
                            <TableCell
                                :colspan="columns.length"
                                class="h-24 text-center"
                            >
                                Loading...
                            </TableCell>
                        </TableRow>
                    </template>
                    <template v-else-if="!data.length">
                        <TableRow>
                            <TableCell
                                :colspan="columns.length"
                                class="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    </template>
                    <template v-else>
                        <TableRow v-for="row in data" :key="row.id">
                            <TableCell
                                v-for="column in columns"
                                :key="getColumnKey(column)"
                            >
                                <template
                                    v-if="typeof column.cell === 'function'"
                                >
                                    <component
                                        v-if="
                                            getCellContent(column, row)
                                                .component
                                        "
                                        :is="
                                            getCellContent(column, row)
                                                .component
                                        "
                                        v-bind="
                                            getCellContent(column, row).props ||
                                            {}
                                        "
                                    />
                                    <template v-else>
                                        {{ getCellContent(column, row) }}
                                    </template>
                                </template>
                                <template v-else>
                                    {{
                                        column.accessorKey
                                            ? row[column.accessorKey]
                                            : undefined
                                    }}
                                </template>
                            </TableCell>
                        </TableRow>
                    </template>
                </TableBody>
            </Table>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type {
    Cell,
    Column,
    ColumnDef,
    Row,
    SortingState,
    Table as TableInstance,
} from "@tanstack/vue-table";

type DataTableColumnDef<TData> = ColumnDef<TData, any> & {
    accessorKey?: string;
};

interface Props<TData> {
    columns: DataTableColumnDef<TData>[];
    data: TData[];
    pagination: {
        currentPage: number;
        pageSize: number;
        totalPages: number;
    };
    loading?: boolean;
    sorting?: SortingState;
}

const props = defineProps<Props<any>>();

const emit = defineEmits<{
    (e: "option-change", options: any): void;
    (e: "update:sorting", sorting: SortingState): void;
}>();

const handlePageChange = (page: number) => {
    emit("option-change", {
        page,
        limit: props.pagination.pageSize,
    });
};

const handleSort = (column: DataTableColumnDef<any>) => {
    const columnId = column.id || column.accessorKey;
    if (!columnId) return;

    const currentSort = props.sorting?.[0];

    let newSorting: SortingState = [];

    if (currentSort && currentSort.id === columnId) {
        // Toggle direction if clicking the same column
        newSorting = currentSort.desc ? [] : [{ id: columnId, desc: true }];
    } else {
        // Set new sort column
        newSorting = [{ id: columnId, desc: false }];
    }

    emit("update:sorting", newSorting);
};

const getCellContent = (column: DataTableColumnDef<any>, row: any) => {
    if (typeof column.cell === "function") {
        const context = {
            row: { original: row } as Row<any>,
            column: column as Column<any, any>,
            getValue: () =>
                column.accessorKey ? row[column.accessorKey] : undefined,
            renderValue: () =>
                column.accessorKey ? row[column.accessorKey] : undefined,
            table: {} as TableInstance<any>,
            cell: {} as Cell<any, any>,
        };
        return column.cell(context);
    }
    return column.accessorKey ? row[column.accessorKey] : undefined;
};

const getColumnKey = (column: DataTableColumnDef<any>) => {
    return (
        column.id ||
        (column.accessorKey ? column.accessorKey : String(column.accessorKey))
    );
};

const getSortDirection = (
    column: DataTableColumnDef<any>
): "asc" | "desc" | null => {
    if (!props.sorting?.length) return null;
    const sort = props.sorting[0];
    const columnId = column.id || column.accessorKey;
    if (sort.id !== columnId) return null;
    return sort.desc ? "desc" : "asc";
};
</script>

<style scoped>
.sort-asc::after {
    content: " ↑";
}
.sort-desc::after {
    content: " ↓";
}
</style>
