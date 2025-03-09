<template>
    <div v-if="modelValue" class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <!-- Background overlay -->
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('update:modelValue', false)"></div>

            <!-- Modal panel -->
            <div class="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
                <div class="absolute right-0 top-0 pr-4 pt-4">
                    <button
                        type="button"
                        class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        @click="$emit('update:modelValue', false)"
                    >
                        <span class="sr-only">Close</span>
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="sm:flex sm:items-start">
                    <div class="mt-3 w-full text-center sm:mt-0 sm:text-left">
                        <h3 class="text-lg font-medium leading-6 text-gray-900">
                            Add Transaction
                        </h3>
                        <div class="mt-6 space-y-4">
                            <!-- Transaction Type -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700">
                                    Type
                                </label>
                                <div class="mt-1 flex space-x-4">
                                    <label class="inline-flex items-center">
                                        <input
                                            type="radio"
                                            v-model="form.type"
                                            value="income"
                                            class="form-radio text-indigo-600"
                                        />
                                        <span class="ml-2">Income</span>
                                    </label>
                                    <label class="inline-flex items-center">
                                        <input
                                            type="radio"
                                            v-model="form.type"
                                            value="expense"
                                            class="form-radio text-indigo-600"
                                        />
                                        <span class="ml-2">Expense</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Amount -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700">
                                    Amount
                                </label>
                                <div class="mt-1">
                                    <input
                                        type="number"
                                        v-model="form.amount"
                                        step="0.01"
                                        min="0"
                                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <!-- Category -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700">
                                    Category
                                </label>
                                <div class="mt-1">
                                    <select
                                        v-model="form.category"
                                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Select a category</option>
                                        <option
                                            v-for="category in categories[form.type]"
                                            :key="category"
                                            :value="category"
                                        >
                                            {{ category }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <!-- Description -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <div class="mt-1">
                                    <input
                                        type="text"
                                        v-model="form.description"
                                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Enter description"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                        :disabled="!isFormValid || loading"
                        @click="handleSubmit"
                    >
                        {{ loading ? 'Adding...' : 'Add Transaction' }}
                    </button>
                    <button
                        type="button"
                        class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                        @click="$emit('update:modelValue', false)"
                        :disabled="loading"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useFinanceStore } from '~/stores/finance';

const props = defineProps<{
    modelValue: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

const financeStore = useFinanceStore();
const loading = ref(false);

const categories = {
    income: [
        'Salary',
        'Freelance',
        'Investments',
        'Other Income'
    ],
    expense: [
        'Food',
        'Transport',
        'Bills',
        'Shopping',
        'Entertainment',
        'Healthcare',
        'Other Expenses'
    ]
};

const form = reactive({
    type: 'expense' as 'income' | 'expense',
    amount: 0,
    category: '',
    description: ''
});

const isFormValid = computed(() => {
    return form.amount > 0 && form.category && form.description;
});

const handleSubmit = async () => {
    if (!isFormValid.value) return;

    try {
        loading.value = true;
        await financeStore.addTransaction({
            type: form.type,
            amount: form.amount,
            category: form.category,
            description: form.description,
            date: new Date()
        });

        // Reset form and close modal
        form.amount = 0;
        form.category = '';
        form.description = '';
        emit('update:modelValue', false);
    } catch (error) {
        console.error('Failed to add transaction:', error);
    } finally {
        loading.value = false;
    }
};
</script> 