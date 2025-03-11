<template>
    <div class="flex flex-col gap-6">
        <Card>
            <CardHeader class="text-center">
                <CardTitle class="text-xl">Forgot Password</CardTitle>
                <CardDescription>
                    Enter your email to reset your password
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form v-if="!emailSent" @submit.prevent="handleSubmit" class="space-y-4">
                    <div class="grid gap-2">
                        <Label html-for="email">Email</Label>
                        <Input
                            id="email"
                            v-model="email"
                            type="email"
                            placeholder="Enter your email"
                            required
                            :disabled="loading"
                        />
                    </div>
                    <Button type="submit" :disabled="loading" class="w-full">
                        <template v-if="loading">
                            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                            Sending reset email...
                        </template>
                        <template v-else>
                            <Mail class="mr-2 h-4 w-4" />
                            Send Reset Email
                        </template>
                    </Button>
                </form>

                <div v-else class="space-y-4">
                    <Alert>
                        <Mail class="h-4 w-4" />
                        <AlertTitle>Check your email</AlertTitle>
                        <AlertDescription>
                            We've sent you a password reset link. Please check your inbox.
                        </AlertDescription>
                    </Alert>
                    <Button variant="outline" class="w-full" @click="emailSent = false">
                        <Mail class="mr-2 h-4 w-4" />
                        Send another email
                    </Button>
                </div>

                <Alert v-if="error" variant="destructive" class="mt-4">
                    <AlertCircle class="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{{ error }}</AlertDescription>
                </Alert>
            </CardContent>
        </Card>
        <div class="text-center text-sm text-muted-foreground">
            <NuxtLink
                to="/login"
                class="inline-flex items-center font-medium text-primary hover:text-primary/80 transition-colors"
            >
                <ArrowLeft class="mr-2 h-4 w-4" />
                Back to login
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AlertCircle, ArrowLeft, Loader2, Mail } from "lucide-vue-next";
import { useToast } from "~/components/ui/toast/use-toast";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
    layout: "auth",
    middleware: "auth"
});

const authStore = useAuthStore();
const { toast } = useToast();
const router = useRouter();

const email = ref("");
const loading = ref(false);
const error = ref("");
const emailSent = ref(false);

const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (loading.value) return;

    try {
        loading.value = true;
        error.value = "";
        await authStore.sendPasswordResetEmail(email.value);
        emailSent.value = true;
        toast({
            title: "Success",
            description: "Password reset email sent. Please check your inbox.",
        });
    } catch (err: any) {
        error.value = err.message;
        toast({
            title: "Error",
            description: err.message || "Failed to send reset email",
            variant: "destructive",
        });
    } finally {
        loading.value = false;
    }
};
</script> 