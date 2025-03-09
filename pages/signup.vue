<!-- pages/signup.vue -->
<template>
    <div
        class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2
                    class="mt-6 text-center text-3xl font-extrabold text-gray-900"
                >
                    Create your account
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Or
                    <NuxtLink
                        to="/login"
                        class="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        sign in to your existing account
                    </NuxtLink>
                </p>
            </div>

            <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
                <div class="space-y-4">
                    <FormInput
                        v-model="form.email"
                        label="Email address"
                        type="email"
                        placeholder="Enter your email"
                        required
                        :validation-rules="{ required: true, email: true }"
                        :disabled="loading"
                    />

                    <FormInput
                        v-model="form.password"
                        label="Password"
                        type="password"
                        placeholder="Create a strong password"
                        required
                        :disabled="loading"
                    />

                    <FormInput
                        v-model="form.confirmPassword"
                        label="Confirm password"
                        type="password"
                        placeholder="Confirm your password"
                        required
                        :validation-rules="{
                            required: true,
                            match: toRef(form, 'password'),
                        }"
                        :disabled="loading"
                    />

                    <!-- Password Strength Indicator -->
                    <div v-if="form.password" class="space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium text-gray-700"
                                >Password strength</span
                            >
                            <span
                                :class="[
                                    'text-sm font-medium',
                                    passwordStrength === 'strong'
                                        ? 'text-green-600'
                                        : passwordStrength === 'medium'
                                          ? 'text-yellow-600'
                                          : 'text-red-600',
                                ]"
                            >
                                {{
                                    passwordStrength.charAt(0).toUpperCase() +
                                    passwordStrength.slice(1)
                                }}
                            </span>
                        </div>
                        <div
                            class="h-2 bg-gray-200 rounded-full overflow-hidden"
                        >
                            <div
                                :class="[
                                    'h-full transition-all duration-300',
                                    passwordStrength === 'strong'
                                        ? 'bg-green-500 w-full'
                                        : passwordStrength === 'medium'
                                          ? 'bg-yellow-500 w-2/3'
                                          : 'bg-red-500 w-1/3',
                                ]"
                            ></div>
                        </div>
                    </div>
                </div>

                <div class="flex items-center">
                    <input
                        id="terms"
                        v-model="form.acceptTerms"
                        type="checkbox"
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        :disabled="loading"
                        required
                    />
                    <label for="terms" class="ml-2 block text-sm text-gray-900">
                        I agree to the
                        <a
                            href="#"
                            class="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Terms of Service
                        </a>
                        and
                        <a
                            href="#"
                            class="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Privacy Policy
                        </a>
                    </label>
                </div>

                <div>
                    <button
                        type="submit"
                        :disabled="loading || !isFormValid"
                        :class="[
                            'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white',
                            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                            loading || !isFormValid
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700',
                        ]"
                    >
                        <span
                            class="absolute left-0 inset-y-0 flex items-center pl-3"
                        >
                            <svg
                                v-if="!loading"
                                class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"
                                />
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
                        {{ loading ? "Creating account..." : "Create account" }}
                    </button>
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
                            <p class="text-sm font-medium text-red-800">
                                {{ error }}
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useFormValidation } from "~/composables/useFormValidation";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const router = useRouter();
const { validatePassword } = useFormValidation();

const form = reactive({
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
});

const loading = ref(false);
const error = ref("");

const passwordStrength = computed(() => {
    if (!form.password) return "weak";

    const errors = validatePassword(form.password);
    if (errors.length === 0) return "strong";
    if (errors.length <= 2) return "medium";
    return "weak";
});

const isFormValid = computed(() => {
    return (
        form.email &&
        form.password &&
        form.confirmPassword &&
        form.password === form.confirmPassword &&
        passwordStrength.value !== "weak" &&
        form.acceptTerms
    );
});

const handleSubmit = async () => {
    if (!isFormValid.value || loading.value) return;

    try {
        loading.value = true;
        error.value = "";
        await authStore.signUp(form.email, form.password);
        router.push("/dashboard");
    } catch (err: any) {
        error.value =
            err.message || "Failed to create account. Please try again.";
    } finally {
        loading.value = false;
    }
};
</script>
