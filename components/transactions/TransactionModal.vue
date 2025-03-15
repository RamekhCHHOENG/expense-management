<!-- components/transactions/TransactionModal.vue -->
<template>
    <div v-if="modelValue" class="fixed inset-0 z-10 overflow-y-auto">
        <div
            class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
            <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                <div
                    class="absolute inset-0 bg-gray-500 opacity-75"
                    @click="close"
                ></div>
            </div>

            <span
                class="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
                >&#8203;</span
            >

            <div
                class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
            >
                <div>
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                        {{ title }}
                    </h3>
                    <div class="mt-4">
                        <TransactionForm
                            :transaction="transaction"
                            :submit-button-text="submitButtonText"
                            @submit="handleSubmit"
                            @cancel="close"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Transaction } from "~/types/transaction";
import TransactionForm from "./TransactionForm.vue";

const props = defineProps<{
    modelValue: boolean;
    transaction?: Transaction;
    mode: "add" | "edit";
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "submit", transaction: Transaction): void;
}>();

// Computed properties for title and button text
const title = computed(() =>
    props.mode === "add" ? "Add Transaction" : "Edit Transaction"
);
const submitButtonText = computed(() =>
    props.mode === "add" ? "Add" : "Update"
);

// Close the modal
const close = () => {
    emit("update:modelValue", false);
};

// Handle form submission
const handleSubmit = (transaction: Transaction) => {
    emit("submit", transaction);
    close();
};
</script>
