<template>
    <div class="rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead class="w-[150px]">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow v-if="loading">
                    <TableCell colspan="3" class="text-center py-4">
                        Loading...
                    </TableCell>
                </TableRow>
                <TableRow v-else-if="!expenseTypes.length">
                    <TableCell colspan="3" class="text-center py-4">
                        No expense types found
                    </TableCell>
                </TableRow>
                <TableRow v-for="type in expenseTypes" :key="type.id">
                    <TableCell>{{ type.name }}</TableCell>
                    <TableCell>{{ type.description }}</TableCell>
                    <TableCell>
                        <div class="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                @click="$emit('edit', type)"
                            >
                                <PencilIcon class="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                @click="$emit('delete', type)"
                            >
                                <TrashIcon class="h-4 w-4" />
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </div>
</template>

<script setup lang="ts">
import { PencilIcon, TrashIcon } from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import type { AdditionalExpenseType } from "~/types/additional-expense-type";

defineProps<{
    expenseTypes: AdditionalExpenseType[];
    loading: boolean;
}>();

defineEmits<{
    (e: "edit", type: AdditionalExpenseType): void;
    (e: "delete", type: AdditionalExpenseType): void;
}>();
</script>
