<!-- pages/signup.vue -->
<template>
    <div class="flex flex-col gap-6">
        <Card>
            <CardHeader class="text-center">
                <CardTitle class="text-xl">Create an account</CardTitle>
                <CardDescription>
                    Enter your details to get started
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <div class="grid gap-6">
                        <div class="grid gap-4">
                            <Button
                                variant="outline"
                                type="button"
                                @click="handleGoogleSignIn"
                                :disabled="loading"
                                class="w-full"
                            >
                                <img
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                    class="mr-2 h-5 w-5"
                                    alt="Google"
                                />
                                Continue with Google
                            </Button>
                            <Button
                                variant="outline"
                                type="button"
                                @click="handleGithubSignIn"
                                :disabled="loading"
                                class="w-full"
                            >
                                <Github class="mr-2 h-4 w-4" />
                                Continue with GitHub
                            </Button>
                        </div>
                        <div class="relative">
                            <div class="absolute inset-0 flex items-center">
                                <span class="w-full border-t" />
                            </div>
                            <div
                                class="relative flex justify-center text-xs uppercase"
                            >
                                <span
                                    class="bg-background px-2 text-muted-foreground"
                                >
                                    Or continue with
                                </span>
                            </div>
                        </div>
                        <div class="grid gap-4">
                            <div class="grid gap-2">
                                <Label html-for="email">Email</Label>
                                <Input
                                    id="email"
                                    v-model="form.email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    :disabled="loading"
                                    :class="{
                                        'border-destructive': errors.email,
                                    }"
                                />
                                <p
                                    v-if="errors.email"
                                    class="text-sm text-destructive"
                                >
                                    {{ errors.email }}
                                </p>
                            </div>
                            <div class="grid gap-2">
                                <Label html-for="password">Password</Label>
                                <div class="relative">
                                    <Input
                                        id="password"
                                        v-model="form.password"
                                        :type="
                                            showPassword ? 'text' : 'password'
                                        "
                                        placeholder="At least 8 characters"
                                        required
                                        :disabled="loading"
                                        :class="{
                                            'border-destructive':
                                                errors.password,
                                        }"
                                        class="pr-10"
                                    />
                                    <button
                                        type="button"
                                        @click="showPassword = !showPassword"
                                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        <Eye
                                            v-if="showPassword"
                                            class="h-4 w-4"
                                        />
                                        <EyeOff v-else class="h-4 w-4" />
                                    </button>
                                </div>
                                <p
                                    v-if="errors.password"
                                    class="text-sm text-destructive"
                                >
                                    {{ errors.password }}
                                </p>
                            </div>
                            <div class="grid gap-2">
                                <Label html-for="confirmPassword"
                                    >Confirm Password</Label
                                >
                                <div class="relative">
                                    <Input
                                        id="confirmPassword"
                                        v-model="form.confirmPassword"
                                        :type="
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        "
                                        placeholder="Re-enter your password"
                                        required
                                        :disabled="loading"
                                        :class="{
                                            'border-destructive':
                                                errors.confirmPassword,
                                        }"
                                        class="pr-10"
                                    />
                                    <button
                                        type="button"
                                        @click="
                                            showConfirmPassword =
                                                !showConfirmPassword
                                        "
                                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        <Eye
                                            v-if="showConfirmPassword"
                                            class="h-4 w-4"
                                        />
                                        <EyeOff v-else class="h-4 w-4" />
                                    </button>
                                </div>
                                <p
                                    v-if="errors.confirmPassword"
                                    class="text-sm text-destructive"
                                >
                                    {{ errors.confirmPassword }}
                                </p>
                            </div>
                            <div class="flex items-center space-x-2">
                                <Checkbox
                                    id="terms"
                                    v-model="form.acceptTerms"
                                    :disabled="loading"
                                    required
                                    :class="{
                                        'border-destructive':
                                            errors.acceptTerms,
                                    }"
                                />
                                <Label
                                    for="terms"
                                    class="text-sm font-medium"
                                    :class="{
                                        'text-destructive': errors.acceptTerms,
                                    }"
                                >
                                    I accept the
                                    <NuxtLink
                                        to="/terms"
                                        class="text-primary hover:text-primary/80 transition-colors"
                                    >
                                        terms and conditions
                                    </NuxtLink>
                                </Label>
                            </div>
                            <p
                                v-if="errors.acceptTerms"
                                class="text-sm text-destructive"
                            >
                                {{ errors.acceptTerms }}
                            </p>
                        </div>
                        <Button
                            type="submit"
                            :disabled="loading || !isFormValid"
                            class="w-full"
                        >
                            <template v-if="loading">
                                <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </template>
                            <template v-else>
                                <UserPlus class="mr-2 h-4 w-4" />
                                Create Account
                            </template>
                        </Button>
                    </div>
                </form>

                <Alert v-if="error" variant="destructive" class="mt-4">
                    <AlertCircle class="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{{ error }}</AlertDescription>
                </Alert>
            </CardContent>
        </Card>
        <div class="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <NuxtLink
                to="/login"
                class="font-medium text-primary hover:text-primary/80 transition-colors"
            >
                Sign in
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    AlertCircle,
    Eye,
    EyeOff,
    Github,
    Loader2,
    UserPlus,
} from "lucide-vue-next";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
    layout: "auth",
    middleware: "auth",
    meta: {
        guest: true,
    },
});

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
});

const loading = ref(false);
const error = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const errors = reactive({
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: "",
});

const validateForm = () => {
    let isValid = true;
    errors.email = "";
    errors.password = "";
    errors.confirmPassword = "";
    errors.acceptTerms = "";

    // Email validation
    if (!form.email) {
        errors.email = "Email is required";
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = "Please enter a valid email address";
        isValid = false;
    }

    // Password validation
    if (!form.password) {
        errors.password = "Password is required";
        isValid = false;
    } else if (form.password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
        isValid = false;
    }

    // Confirm password validation
    if (!form.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
        isValid = false;
    } else if (form.password !== form.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
        isValid = false;
    }

    // Terms acceptance validation
    if (!form.acceptTerms) {
        errors.acceptTerms = "You must accept the terms and conditions";
        isValid = false;
    }

    return isValid;
};

const isFormValid = computed(() => {
    return (
        form.email &&
        form.password &&
        form.confirmPassword &&
        form.password === form.confirmPassword &&
        form.acceptTerms
    );
});

const handleSubmit = async () => {
    if (!validateForm() || loading.value) return;

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

const handleGoogleSignIn = async () => {
    if (loading.value) return;

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
    if (loading.value) return;

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
