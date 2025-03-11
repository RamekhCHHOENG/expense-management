<!-- components/ui/confirm-dialog.vue -->
<template>
    <Dialog v-if="isOpen" :open="isOpen" @update:open="handleUpdateOpen">
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{{ title }}</DialogTitle>
                <DialogDescription>{{ description }}</DialogDescription>
            </DialogHeader>
            <div class="py-4">
                <slot></slot>
            </div>
            <DialogFooter class="flex justify-end gap-3">
                <Button
                    variant="outline"
                    @click="handleCancel"
                    :disabled="loading"
                >
                    {{ cancelText }}
                </Button>
                <Button
                    :variant="variant"
                    @click="handleConfirm"
                    :disabled="loading"
                >
                    <template v-if="loading">
                        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                        {{ loadingText }}
                    </template>
                    <template v-else>
                        {{ confirmText }}
                    </template>
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";

type ButtonVariant =
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";

const props = withDefaults(
    defineProps<{
        isOpen: boolean;
        title: string;
        description: string;
        confirmText?: string;
        cancelText?: string;
        loadingText?: string;
        loading?: boolean;
        variant?: ButtonVariant;
    }>(),
    {
        confirmText: "Confirm",
        cancelText: "Cancel",
        loadingText: "Please wait...",
        loading: false,
        variant: "default",
    }
);

const emit = defineEmits<{
    "update:isOpen": [value: boolean];
    confirm: [];
    cancel: [];
}>();

const handleUpdateOpen = (value: boolean) => {
    emit("update:isOpen", value);
};

const handleConfirm = () => {
    emit("confirm");
};

const handleCancel = () => {
    emit("cancel");
    emit("update:isOpen", false);
};
</script>
