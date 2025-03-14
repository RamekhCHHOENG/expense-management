<template>
    <Dialog :open="isOpen" @update:open="$emit('update:is-open', $event)">
        <DialogContent class="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle
                    >{{ isEditMode ? "Edit" : "View" }} Expense</DialogTitle
                >
                <DialogDescription>
                    {{
                        isEditMode
                            ? "Edit expense details"
                            : "View expense details"
                    }}
                </DialogDescription>
            </DialogHeader>

            <div class="grid gap-4 py-4">
                <ExpenseForm
                    :expense="expense"
                    :disabled="!isEditMode"
                    @submit="handleUpdate"
                />
            </div>

            <DialogFooter v-if="isEditMode">
                <Button type="button" variant="outline" @click="cancelEdit"
                    >Cancel</Button
                >
                <Button type="submit" form="expense-form">Save changes</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
    isEditMode: boolean;
}>();

const emit = defineEmits<{
    (e: "update:is-open", value: boolean): void;
    (e: "update", expense: Expense): void;
    (e: "cancel-edit"): void;
}>();

const handleUpdate = (updatedExpense: Expense) => {
    emit("update", {
        ...updatedExpense,
        id: props.expense.id,
    });
};

const cancelEdit = () => {
    emit("cancel-edit");
};
</script>
