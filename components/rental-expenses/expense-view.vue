<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent class="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle
                    >{{ isEdit ? "Edit" : "View" }} Expense</DialogTitle
                >
                <DialogDescription>
                    {{
                        isEdit ? "Edit expense details" : "View expense details"
                    }}
                </DialogDescription>
            </DialogHeader>

            <ExpenseForm
                :expense="expense"
                :disabled="!isEdit"
                @submit="handleSubmit"
            />
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
import type { Expense } from "~/types/expense";
import ExpenseForm from "./expense-form.vue";

interface Props {
    expense?: Expense;
    open: boolean;
    isEdit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    isEdit: false,
});

const emit = defineEmits<{
    (e: "update:open", value: boolean): void;
    (e: "save", expense: Omit<Expense, "id" | "createdAt" | "updatedAt">): void;
}>();

const handleSubmit = (
    updatedExpense: Omit<Expense, "id" | "createdAt" | "updatedAt">
) => {
    emit("save", updatedExpense);
    emit("update:open", false);
};
</script>
