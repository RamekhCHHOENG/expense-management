<template>
    <div class="container py-6">
        <h1 class="text-3xl font-bold">Profile</h1>
        <div class="mt-6">
            <!-- Settings content will go here -->
            <p>Welcome {{ userEmail }}</p>
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
