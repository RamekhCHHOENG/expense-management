<!-- layouts/default.vue -->
<template>
    <div class="min-h-screen flex flex-col">
        <header class="border-b">
            <nav
                class="container mx-auto h-16 flex items-center justify-between"
            >
                <NuxtLink to="/" class="font-semibold text-lg">
                    Expense Manager
                </NuxtLink>
                <div class="flex items-center gap-4">
                    <template v-if="authStore.isAuthenticated">
                        <NuxtLink to="/dashboard" class="hover:text-primary">
                            Dashboard
                        </NuxtLink>
                        <NuxtLink to="/transactions" class="hover:text-primary">
                            Transactions
                        </NuxtLink>
                        <NuxtLink to="/categories" class="hover:text-primary">
                            Categories
                        </NuxtLink>
                        <button
                            @click="handleSignOut"
                            class="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
                        >
                            Sign Out
                        </button>
                    </template>
                    <template v-else>
                        <NuxtLink
                            to="/login"
                            class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                        >
                            Login
                        </NuxtLink>
                    </template>
                </div>
            </nav>
        </header>
        <main class="flex-1 container mx-auto py-8">
            <Sidebar v-if="authStore.isAuthenticated">
                <slot />
            </Sidebar>
            <div v-else>
                <slot />
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import Sidebar from "~/components/dashboard/Sidebar.vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const router = useRouter();

const handleSignOut = async () => {
    try {
        await authStore.signOut();
        router.push("/login");
    } catch (error) {
        console.error("Failed to sign out:", error);
    }
};

// Initialize auth state when the app loads
onMounted(() => {
    authStore.init();
});
</script>
