<script setup lang="ts">
import { Github, Loader2 } from "lucide-vue-next";
import { useToast } from "~/components/ui/toast/use-toast";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const { toast } = useToast();
const loading = ref(false);

const form = ref({
    email: "",
    password: "",
    rememberMe: false,
});

const handleSubmit = async (event: Event) => {
    event.preventDefault();
    loading.value = true;

    try {
        await authStore.signIn(form.value.email, form.value.password);
        const router = useRouter();
        router.push("/dashboard");
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.message || "Failed to sign in",
            variant: "destructive",
        });
    } finally {
        loading.value = false;
    }
};

const handleGithubLogin = async () => {
    try {
        await authStore.signInWithGithub();
        const router = useRouter();
        router.push("/dashboard");
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.message || "Failed to sign in with Github",
            variant: "destructive",
        });
    }
};
</script>

<template>
    <div class="grid gap-6">
        <form @submit="handleSubmit">
            <div class="grid gap-4">
                <div class="grid gap-2">
                    <Label for="email">Email</Label>
                    <Input
                        id="email"
                        v-model="form.email"
                        placeholder="name@example.com"
                        type="email"
                        autocapitalize="none"
                        autocomplete="email"
                        autocorrect="off"
                        required
                    />
                </div>
                <div class="grid gap-2">
                    <div class="flex items-center justify-between">
                        <Label for="password">Password</Label>
                        <NuxtLink
                            to="/forgot-password"
                            class="text-sm text-muted-foreground hover:text-primary"
                        >
                            Forgot password?
                        </NuxtLink>
                    </div>
                    <Input
                        id="password"
                        v-model="form.password"
                        type="password"
                        autocomplete="current-password"
                        required
                    />
                </div>
                <div class="flex items-center space-x-2">
                    <Checkbox id="remember" v-model="form.rememberMe" />
                    <label
                        for="remember"
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Remember me
                    </label>
                </div>
                <Button type="submit" :disabled="loading" class="w-full">
                    <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
                    Sign In
                </Button>
            </div>
        </form>
        <div class="relative">
            <div class="absolute inset-0 flex items-center">
                <span class="w-full border-t" />
            </div>
            <div class="relative flex justify-center text-xs uppercase">
                <span class="bg-background px-2 text-muted-foreground">
                    Or continue with
                </span>
            </div>
        </div>
        <div class="grid gap-4">
            <Button variant="outline" type="button" @click="handleGithubLogin">
                <Github class="mr-2 h-4 w-4" />
                Github
            </Button>
        </div>
        <p class="text-center text-sm text-muted-foreground">
            Don't have an account?
            <NuxtLink
                to="/signup"
                class="hover:text-primary underline underline-offset-4"
            >
                Sign up
            </NuxtLink>
        </p>
    </div>
</template>
