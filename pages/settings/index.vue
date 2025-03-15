<template>
    <div class="container py-6">
        <h1 class="text-3xl font-bold">Settings</h1>
        <div class="mt-6">
            <!-- Settings content will go here -->
            <p>Configure your account and application settings here.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

definePageMeta({
    middleware: ["auth"],
});

const authStore = useAuthStore();
const userEmail = computed(() => authStore.user?.email || "");
</script>
