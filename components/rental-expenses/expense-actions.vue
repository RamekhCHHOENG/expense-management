<template>
    <div class="flex items-center gap-2">
        <Button variant="ghost" size="icon" @click="$emit('view', expense)">
            <EyeIcon class="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" @click="$emit('delete', expense)">
            <TrashIcon class="h-4 w-4" />
        </Button>
    </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { EyeIcon, TrashIcon } from "@heroicons/vue/20/solid";
import type { Expense } from "~/types/expense";

defineProps<{
    expense: Expense;
}>();

defineEmits<{
    (e: "view", expense: Expense): void;
    (e: "delete", expense: Expense): void;
}>();
</script>
