<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Reset your password
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
                <div class="space-y-4">
                    <FormInput
                        v-model="email"
                        label="Email address"
                        type="email"
                        placeholder="Enter your email"
                        required
                        :validation-rules="{ required: true, email: true }"
                        :disabled="loading || emailSent"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        :disabled="loading || !isFormValid || emailSent"
                        :class="[
                            'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white',
                            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                            loading || !isFormValid || emailSent
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                        ]"
                    >
                        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                            <svg
                                v-if="!loading"
                                class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            <svg
                                v-else
                                class="animate-spin h-5 w-5 text-indigo-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    class="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    stroke-width="4"
                                ></circle>
                                <path
                                    class="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        </span>
                        {{ loading ? 'Sending...' : emailSent ? 'Email sent!' : 'Send reset link' }}
                    </button>
                </div>

                <!-- Success Alert -->
                <div v-if="emailSent" class="rounded-md bg-green-50 p-4">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-green-800">
                                Password reset link has been sent to your email address.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Error Alert -->
                <div v-if="error" class="rounded-md bg-red-50 p-4">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg
                                class="h-5 w-5 text-red-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-red-800">{{ error }}</p>
                        </div>
                    </div>
                </div>

                <div class="text-center">
                    <NuxtLink to="/login" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        Back to login
                    </NuxtLink>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const email = ref('');
const loading = ref(false);
const error = ref('');
const emailSent = ref(false);

const isFormValid = computed(() => {
    return email.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
});

const handleSubmit = async () => {
    if (!isFormValid.value || loading.value) return;

    try {
        loading.value = true;
        error.value = '';
        const { $auth } = useNuxtApp();
        await sendPasswordResetEmail($auth, email.value);
        emailSent.value = true;
    } catch (err: any) {
        error.value = err.message || 'Failed to send reset link. Please try again.';
    } finally {
        loading.value = false;
    }
};
</script> 