<!-- pages/signup.vue -->
<template>
    <div class="flex flex-col gap-6">
        <Card>
            <CardHeader class="text-center">
                <CardTitle class="text-xl">Create an account</CardTitle>
                <CardDescription>
                    Sign up to start managing your expenses
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
                                <Label html-for="name">Full Name</Label>
                                <Input
                                    id="name"
                                    v-model="form.name"
                                    type="text"
                                    placeholder="Enter your name"
                                    required
                                    :disabled="loading"
                                />
                            </div>
                            <div class="grid gap-2">
                                <Label html-for="email">Email</Label>
                                <Input
                                    id="email"
                                    v-model="form.email"
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    :disabled="loading"
                                />
                            </div>
                            <div class="grid gap-2">
                                <Label html-for="password">Password</Label>
                                <div class="relative">
                                    <Input
                                        id="password"
                                        v-model="form.password"
                                        placeholder="Create a password"
                                        :type="
                                            showPassword ? 'text' : 'password'
                                        "
                                        required
                                        :disabled="loading"
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
                            </div>
                            <div class="grid gap-2">
                                <Label html-for="confirmPassword"
                                    >Confirm Password</Label
                                >
                                <div class="relative">
                                    <Input
                                        id="confirmPassword"
                                        v-model="form.confirmPassword"
                                        placeholder="Confirm your password"
                                        :type="
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        "
                                        required
                                        :disabled="loading"
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
                            </div>
                        </div>
                        <Button
                            type="submit"
                            :disabled="loading"
                            class="w-full"
                        >
                            <template v-if="loading">
                                <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </template>
                            <template v-else>
                                <UserPlus class="mr-2 h-4 w-4" />
                                Sign Up
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
import { useToast } from "~/components/ui/toast/use-toast";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
    layout: "auth",
    middleware: "auth",
});

const authStore = useAuthStore();
const { toast } = useToast();
const router = useRouter();

const form = reactive({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
});

const loading = ref(false);
const error = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (loading.value) return;

    if (form.password !== form.confirmPassword) {
        error.value = "Passwords do not match";
        toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive",
        });
        return;
    }

    try {
        loading.value = true;
        error.value = "";
        await authStore.signUp(form.email, form.password, form.name);
        toast({
            title: "Success",
            description: "Account created successfully",
        });
        router.push("/dashboard");
    } catch (err: any) {
        error.value = err.message;
        toast({
            title: "Error",
            description: err.message || "Failed to create account",
            variant: "destructive",
        });
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
        error.value = err.message;
        toast({
            title: "Error",
            description: err.message || "Failed to sign in with Google",
            variant: "destructive",
        });
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
        error.value = err.message;
        toast({
            title: "Error",
            description: err.message || "Failed to sign in with GitHub",
            variant: "destructive",
        });
    } finally {
        loading.value = false;
    }
};
</script>
