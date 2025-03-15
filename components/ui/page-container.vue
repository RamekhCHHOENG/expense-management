<template>
    <div class="container mx-auto p-4">
        <!-- Header Card -->
        <Card class="my-8">
            <CardHeader>
                <div class="flex items-center justify-between">
                    <div>
                        <CardTitle>{{ title }}</CardTitle>
                        <CardDescription v-if="description">
                            {{ description }}
                        </CardDescription>
                    </div>
                    <Button v-if="showAddButton" @click="$emit('add')">
                        <PlusIcon class="mr-2 h-4 w-4" />
                        {{ addButtonText }}
                    </Button>
                </div>
            </CardHeader>
        </Card>

        <!-- Content Card -->
        <Card>
            <CardContent>
                <slot></slot>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { Button } from "./button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./card";

defineProps<{
    title: string;
    description?: string;
    showAddButton?: boolean;
    addButtonText?: string;
}>();

defineEmits<{
    (e: "add"): void;
}>();
</script>
