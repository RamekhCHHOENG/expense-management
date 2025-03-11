<template>
    <AuthLayout>
        <template #title>Reset Password</template>
        <template #description>Enter your email to receive a password reset link</template>
        <template #quote>
            "Security is not just a feature, it's a commitment. We're here to help you regain access safely."
        </template>
        <template #quote-author>Security Team</template>

        <div class="w-full max-w-[400px] mx-auto">
            <Card class="border-0 shadow-lg">
                <CardContent class="pt-6">
                    <form @submit.prevent="handleSubmit" class="space-y-4">
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    id="email"
                                    v-model="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    :disabled="loading"
                                    class="w-full"
                                />
                            </FormControl>
                        </FormItem>

                        <Button type="submit" :disabled="loading || !email" class="w-full" size="lg">
                            <template v-if="loading">
                                <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                                Sending reset link...
                            </template>
                            <template v-else>
                                <Mail class="mr-2 h-4 w-4" />
                                Send Reset Link
                            </template>
                        </Button>
                    </form>

                    <Alert v-if="error" variant="destructive" class="mt-4">
                        <AlertCircle class="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{{ error }}</AlertDescription>
                    </Alert>

                    <Alert v-if="emailSent" variant="success" class="mt-4 border-green-500">
                        <CheckCircle class="h-4 w-4 text-green-500" />
                        <AlertTitle class="text-green-500">Success</AlertTitle>
                        <AlertDescription>
                            Password reset link has been sent to your email.
                            Please check your inbox and spam folder.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>

            <p class="mt-6 text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <NuxtLink to="/login" class="font-medium text-primary hover:text-primary/80 transition-colors">
                    Sign in
                </NuxtLink>
            </p>
        </div>
    </AuthLayout>
</template>

<script setup lang="ts">
import { AlertCircle, CheckCircle, Loader2, Mail } from "lucide-vue-next";

const authStore = useAuthStore();
const email = ref("");
const loading = ref(false);
const error = ref("");
const emailSent = ref(false);

const handleSubmit = async () => {
    if (!email.value || loading.value) return;

    try {
        loading.value = true;
        error.value = "";
        emailSent.value = false;
        await authStore.sendPasswordResetEmail(email.value);
        emailSent.value = true;
    } catch (err: any) {
        error.value = err.message || "Failed to send reset link. Please try again.";
    } finally {
        loading.value = false;
    }
};
</script> 