<template>
    <Dialog :open="isOpen" @update:open="$emit('update:is-open', $event)">
        <DialogContent :class="DIALOG_SIZES.sm">
            <DialogHeader>
                <DialogTitle>Delete Expense</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this expense? This action
                    cannot be undone.
                </DialogDescription>
            </DialogHeader>

            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label class="text-right">Date</Label>
                    <div class="col-span-3">
                        {{ formatDate(expense.date) }}
                    </div>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label class="text-right">House Rent</Label>
                    <div class="col-span-3">
                        {{ formatNumber(expense.house) }}
                    </div>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label class="text-right">Total</Label>
                    <div class="col-span-3">
                        {{ formatNumber(calculateTotal(expense)) }}
                    </div>
                </div>
            </div>

            <DialogFooter>
                <Button
                    variant="outline"
                    @click="$emit('update:is-open', false)"
                >
                    Cancel
                </Button>
                <Button
                    variant="destructive"
                    :disabled="isDeleting"
                    @click="handleDelete"
                >
                    {{ isDeleting ? "Deleting..." : "Delete" }}
                </Button>
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
import { Label } from "@/components/ui/label";
import { ref } from "vue";
import { DIALOG_SIZES } from "~/constants/dialog";

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
    (e: "delete", expense: Expense): void;
}>();

const isDeleting = ref(false);

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
};

const formatNumber = (value: number | null): string => {
    if (value === null) return "-";
    return value.toFixed(2);
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

const handleDelete = async () => {
    isDeleting.value = true;
    try {
        emit("delete", props.expense);
    } finally {
        isDeleting.value = false;
    }
};
</script>
