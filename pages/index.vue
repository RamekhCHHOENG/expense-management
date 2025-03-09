<!-- pages/index.vue -->
<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

// Redirect based on authentication state
onMounted(() => {
    if (authStore.isAuthenticated) {
        navigateTo("/dashboard");
    } else {
        navigateTo("/login");
    }
});
</script>

<template>
    <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <p class="text-gray-600">Redirecting...</p>
        </div>
    </div>
</template>
