<template>
    <Dialog :open="isOpen" @update:open="$emit('update:is-open', $event)">
        <DialogContent class="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>View Expense</DialogTitle>
                <DialogDescription>
                    View and edit expense details
                </DialogDescription>
            </DialogHeader>

            <div class="grid gap-4 py-4">
                <ExpenseForm :expense="expense" @submit="handleUpdate" />
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ExpenseForm from "./expense-form.vue";

interface Expense {
    id?: string;
    date: string;
    house: number;
    totalElect: number | null;
    rtAcFridge: number | null;
    pheaFridge: number | null;
    mining: number | null;
    electricity: number;
    water: number | null;
    waste: number | null;
    additional: number | null;
    createdAt?: Date;
    updatedAt?: Date;
}

const props = defineProps<{
    expense: Expense;
    isOpen: boolean;
}>();

const emit = defineEmits<{
    (e: "update:is-open", value: boolean): void;
    (e: "update", expense: Expense): void;
}>();

const handleUpdate = (updatedExpense: Expense) => {
    emit("update", {
        ...updatedExpense,
        id: props.expense.id,
    });
};
</script>
