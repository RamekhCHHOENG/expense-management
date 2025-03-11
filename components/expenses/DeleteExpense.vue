<template>
    <div>
        <Button variant="destructive" size="sm" @click="handleDeleteClick">
            <Trash2 class="h-4 w-4 mr-2" />
            Delete Expense
        </Button>

        <ConfirmDialog
            v-model:isOpen="confirmation.isOpen"
            :title="confirmation.options.title"
            :description="confirmation.options.description"
            :confirm-text="confirmation.options.confirmText"
            :cancel-text="confirmation.options.cancelText"
            :loading-text="confirmation.options.loadingText"
            :loading="confirmation.loading"
            @confirm="handleConfirm"
        />
    </div>
</template>

<script setup lang="ts">
import { Trash2 } from "lucide-vue-next";
import { useConfirmation } from "~/composables/useConfirmation";

const props = defineProps<{
    expenseId: string;
    expenseName: string;
}>();

const emit = defineEmits<{
    delete: [id: string];
}>();

const confirmation = useConfirmation();

const handleDeleteClick = async () => {
    const confirmed = await confirmation.confirm({
        title: "Delete Expense",
        description: `Are you sure you want to delete "${props.expenseName}"? This action cannot be undone.`,
        confirmText: "Delete",
        cancelText: "Cancel",
        loadingText: "Deleting...",
    });

    if (confirmed) {
        emit("delete", props.expenseId);
    }
};

const handleConfirm = () => {
    // The confirmation dialog will handle the loading state and closing
    // We just need to wait for the result in handleDeleteClick
};
</script>
