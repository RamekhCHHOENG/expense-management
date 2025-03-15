<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent class="!max-w-sm">
            <DialogHeader>
                <DialogTitle>Delete Expense Type</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this expense type? This
                    action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button
                    variant="outline"
                    @click="$emit('update:open', false)"
                    :disabled="isDeleting"
                >
                    Cancel
                </Button>
                <Button
                    variant="destructive"
                    @click="$emit('delete')"
                    :disabled="isDeleting"
                >
                    {{ isDeleting ? "Deleting..." : "Delete" }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";

defineProps<{
    open: boolean;
    isDeleting: boolean;
}>();

defineEmits<{
    (e: "update:open", value: boolean): void;
    (e: "delete"): void;
}>();
</script>
