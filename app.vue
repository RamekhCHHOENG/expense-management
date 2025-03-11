<script setup lang="ts">
import Toaster from "@/components/ui/toast/Toaster.vue";
</script>

<template>
    <Toaster />
    <div class="min-h-screen bg-background">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
