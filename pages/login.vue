<!-- pages/login.vue -->
<template>
    <div
        class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2
                    class="mt-6 text-center text-3xl font-extrabold text-gray-900"
                >
                    Sign in to your account
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Or
                    <NuxtLink
                        to="/signup"
                        class="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        create a new account
                    </NuxtLink>
                </p>
            </div>

            <!-- Social Login Buttons -->
            <div class="space-y-3">
                <button
                    type="button"
                    @click="handleGoogleSignIn"
                    :disabled="loading"
                    class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        class="h-5 w-5 mr-2"
                    />
                    Continue with Google
                </button>

                <button
                    type="button"
                    @click="handleGithubSignIn"
                    :disabled="loading"
                    class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <svg
                        class="h-5 w-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                            clip-rule="evenodd"
                        />
                    </svg>
                    Continue with GitHub
                </button>
            </div>

            <div class="relative">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-gray-50 text-gray-500"
                        >Or continue with</span
                    >
                </div>
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
                        placeholder="Enter your password"
                        required
                        :validation-rules="{ required: true }"
                        :disabled="loading"
                    />
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input
                            id="remember-me"
                            v-model="form.rememberMe"
                            type="checkbox"
                            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            :disabled="loading"
                        />
                        <label
                            for="remember-me"
                            class="ml-2 block text-sm text-gray-900"
                        >
                            Remember me
                        </label>
                    </div>

                    <div class="text-sm">
                        <NuxtLink
                            to="/forgot-password"
                            class="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Forgot your password?
                        </NuxtLink>
                    </div>
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
                                aria-hidden="true"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clip-rule="evenodd"
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
                        {{ loading ? "Signing in..." : "Sign in with email" }}
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
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
    email: "",
    password: "",
    rememberMe: false,
});

const loading = ref(false);
const error = ref("");

const isFormValid = computed(() => {
    return form.email && form.password;
});

const handleSubmit = async () => {
    if (!isFormValid.value || loading.value) return;

    try {
        loading.value = true;
        error.value = "";
        await authStore.signIn(form.email, form.password);
        router.push("/dashboard");
    } catch (err: any) {
        error.value = err.message || "Failed to sign in. Please try again.";
    } finally {
        loading.value = false;
    }
};

const handleGoogleSignIn = async () => {
    try {
        loading.value = true;
        error.value = "";
        await authStore.signInWithGoogle();
        router.push("/dashboard");
    } catch (err: any) {
        error.value =
            err.message || "Failed to sign in with Google. Please try again.";
    } finally {
        loading.value = false;
    }
};

const handleGithubSignIn = async () => {
    try {
        loading.value = true;
        error.value = "";
        await authStore.signInWithGithub();
        router.push("/dashboard");
    } catch (err: any) {
        error.value =
            err.message || "Failed to sign in with GitHub. Please try again.";
    } finally {
        loading.value = false;
    }
};
</script>
