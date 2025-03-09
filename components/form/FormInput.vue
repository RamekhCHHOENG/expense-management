<template>
    <div class="space-y-1">
        <label
            v-if="label"
            :for="id"
            class="block text-sm font-medium text-gray-700"
        >
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>
        <div class="relative">
            <input
                :id="id"
                :type="inputType"
                :value="modelValue"
                @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
                @blur="validate"
                :class="[
                    'block w-full rounded-md shadow-sm sm:text-sm',
                    'focus:ring-2 focus:ring-offset-2 focus:outline-none',
                    errors.length > 0
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
                ]"
                :placeholder="placeholder"
                :disabled="disabled"
                :required="required"
            />
            <button
                v-if="type === 'password'"
                type="button"
                class="absolute inset-y-0 right-0 flex items-center pr-3"
                @click="togglePasswordVisibility"
            >
                <svg
                    v-if="inputType === 'password'"
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                </svg>
                <svg
                    v-else
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                </svg>
            </button>
        </div>
        <div v-if="errors.length > 0" class="space-y-1">
            <p
                v-for="(error, index) in errors"
                :key="index"
                class="text-sm text-red-600"
            >
                {{ error }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useFormValidation } from '~/composables/useFormValidation';

const props = defineProps<{
    modelValue: string;
    label?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    validationRules?: {
        required?: boolean;
        email?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        match?: Ref<string>;
    };
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const { validateField, validatePassword } = useFormValidation();
const errors = ref<string[]>([]);
const inputType = ref(props.type || 'text');
const id = `input-${Math.random().toString(36).substring(2, 11)}`;

const validate = () => {
    if (props.type === 'password') {
        errors.value = validatePassword(props.modelValue);
    } else if (props.validationRules) {
        errors.value = validateField(props.modelValue, props.validationRules);
    } else {
        errors.value = [];
    }
};

const togglePasswordVisibility = () => {
    inputType.value = inputType.value === 'password' ? 'text' : 'password';
};
</script> 