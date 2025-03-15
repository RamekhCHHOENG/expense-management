<template>
    <Dialog v-model:open="isOpen">
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>
                    {{ isEditMode ? "Edit" : "View" }} Expense
                </DialogTitle>
                <DialogDescription>
                    {{
                        isEditMode
                            ? "Edit expense details"
                            : "View expense details"
                    }}
                </DialogDescription>
            </DialogHeader>
            <div class="flex-1 overflow-y-auto">
                <ExpenseForm
                    v-if="expense"
                    :expense="expense"
                    :disabled="!isEditMode"
                    @submit="handleUpdate"
                />
            </div>
            <DialogFooter v-if="!isEditMode">
                <Button @click="isEditMode = true">Edit</Button>
                <Button variant="outline" @click="isOpen = false">Close</Button>
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
import { computed, ref, watch } from "vue";
import type { Expense } from "~/types/expense";
import ExpenseForm from "./expense-form.vue";

interface Props {
    expense: Expense;
    modelValue?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "update", expense: Expense): void;
}>();

const isOpen = computed({
    get: () => props.modelValue ?? false,
    set: (value) => emit("update:modelValue", value),
});

const isEditMode = ref(false);

const handleUpdate = async (updatedExpense: Expense) => {
    emit("update", {
        ...updatedExpense,
        id: props.expense.id,
    });
    isEditMode.value = false;
    isOpen.value = false;
};

watch(isOpen, (value) => {
    if (!value) {
        isEditMode.value = false;
    }
});
</script>
