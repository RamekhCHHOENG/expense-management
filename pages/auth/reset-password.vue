<!-- pages/reset-password.vue -->
<template>
    <div
        class="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0"
    >
        <!-- Left side - Dark section -->
        <div
            class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex"
        >
            <div class="absolute inset-0 bg-zinc-900" />
            <div class="relative z-20 flex items-center text-lg font-medium">
                <img src="/logo.svg" alt="Logo" class="mr-2 h-8 w-8" />
                <span class="text-xl font-bold">Expense Management</span>
            </div>
            <div class="relative z-20 mt-auto">
                <blockquote class="space-y-2">
                    <p class="text-lg">
                        "Choose a strong password to keep your account secure.
                        Your financial data's security is our top priority."
                    </p>
                    <footer class="text-sm">Security Team</footer>
                </blockquote>
            </div>
        </div>

        <!-- Right side - Reset Password form -->
        <div class="lg:p-8">
            <div
                class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
            >
                <div class="flex flex-col space-y-2 text-center">
                    <h1 class="text-2xl font-semibold tracking-tight">
                        Reset your password
                    </h1>
                    <p class="text-sm text-muted-foreground">
                        Enter your new password below
                    </p>
                </div>

                <Card>
                    <CardContent class="pt-6">
                        <form @submit.prevent="handleSubmit" class="space-y-4">
                            <div class="space-y-2">
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="password"
                                            v-model="form.password"
                                            type="password"
                                            required
                                            :disabled="loading"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Password must be at least 8 characters
                                        long
                                    </FormDescription>
                                </FormItem>
                            </div>

                            <div class="space-y-2">
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="confirmPassword"
                                            v-model="form.confirmPassword"
                                            type="password"
                                            required
                                            :disabled="loading"
                                        />
                                    </FormControl>
                                </FormItem>
                            </div>

                            <Button
                                type="submit"
                                :disabled="loading || !isFormValid"
                                class="w-full"
                            >
                                <template v-if="loading">
                                    <Loader2
                                        class="mr-2 h-4 w-4 animate-spin"
                                    />
                                    Resetting password...
                                </template>
                                <template v-else>
                                    <Key class="mr-2 h-4 w-4" />
                                    Reset Password
                                </template>
                            </Button>
                        </form>

                        <Alert v-if="error" variant="destructive" class="mt-4">
                            <AlertCircle class="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{{ error }}</AlertDescription>
                        </Alert>

                        <Alert
                            v-if="success"
                            variant="default"
                            class="mt-4 border-green-500"
                        >
                            <CheckCircle2 class="h-4 w-4 text-green-500" />
                            <AlertTitle class="text-green-500"
                                >Success</AlertTitle
                            >
                            <AlertDescription>
                                Your password has been reset successfully. You
                                can now sign in with your new password.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>

                <div class="text-center text-sm text-muted-foreground">
                    Remember your password?{" "}
                    <NuxtLink
                        to="/auth/login"
                        class="font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                        Sign in
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AlertCircle, CheckCircle2, Key, Loader2 } from "lucide-vue-next";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const form = reactive({
    password: "",
    confirmPassword: "",
});

const loading = ref(false);
const error = ref("");
const success = ref(false);

const isFormValid = computed(() => {
    return (
        form.password &&
        form.confirmPassword &&
        form.password === form.confirmPassword &&
        form.password.length >= 8
    );
});

const handleSubmit = async () => {
    if (loading.value || !isFormValid.value) return;

    const oobCode = route.query.oobCode as string;
    if (!oobCode) {
        error.value = "Invalid reset link. Please request a new one.";
        return;
    }

    try {
        loading.value = true;
        error.value = "";
        success.value = false;
        await authStore.confirmPasswordReset(oobCode, form.password);
        success.value = true;
        // Redirect to login after 2 seconds
        setTimeout(() => {
            router.push("/auth/login");
        }, 2000);
    } catch (err: any) {
        error.value =
            err.message || "Failed to reset password. Please try again.";
    } finally {
        loading.value = false;
    }
};
</script>
