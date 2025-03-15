<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent class="!max-w-sm">
            <DialogHeader>
                <DialogTitle>
                    {{ expenseType ? "Edit" : "Add" }} Expense Type
                </DialogTitle>
            </DialogHeader>
            <ExpenseTypeForm
                :expense-type="expenseType"
                @submit="handleSubmit"
            />
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import type { AdditionalExpenseType } from "~/types/additional-expense-type";
import ExpenseTypeForm from "./expense-type-form.vue";

defineProps<{
    open: boolean;
    expenseType?: AdditionalExpenseType;
}>();

const emit = defineEmits<{
    (e: "update:open", value: boolean): void;
    (
        e: "submit",
        type: Omit<AdditionalExpenseType, "id" | "createdAt" | "updatedAt">
    ): void;
}>();

const handleSubmit = (
    type: Omit<AdditionalExpenseType, "id" | "createdAt" | "updatedAt">
) => {
    emit("submit", type);
};
</script>
