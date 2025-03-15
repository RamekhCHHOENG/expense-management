<template>
    <PageContainer
        title="Additional Expense Types"
        description="Manage additional expense types for rental expenses"
        :show-add-button="true"
        add-button-text="Add Type"
        @add="handleAddType"
    >
        <div class="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead class="w-[150px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-if="loading">
                        <TableCell colspan="3" class="text-center py-4">
                            Loading...
                        </TableCell>
                    </TableRow>
                    <TableRow v-else-if="!expenseTypes.length">
                        <TableCell colspan="3" class="text-center py-4">
                            No expense types found
                        </TableCell>
                    </TableRow>
                    <TableRow v-for="type in expenseTypes" :key="type.id">
                        <TableCell>{{ type.name }}</TableCell>
                        <TableCell>{{ type.description }}</TableCell>
                        <TableCell>
                            <div class="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    @click="handleEditType(type)"
                                >
                                    <PencilIcon class="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    @click="handleDeleteType(type)"
                                >
                                    <TrashIcon class="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    </PageContainer>

    <!-- Add/Edit Dialog -->
    <Dialog v-model:open="showForm">
        <DialogContent :class="DIALOG_SIZES.sm">
            <DialogHeader>
                <DialogTitle>
                    {{ selectedType ? "Edit" : "Add" }} Expense Type
                </DialogTitle>
            </DialogHeader>
            <ExpenseTypeForm
                :expense-type="selectedType"
                @submit="handleSubmitType"
            />
        </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="showDeleteConfirm">
        <DialogContent :class="DIALOG_SIZES.sm">
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
                    @click="showDeleteConfirm = false"
                    :disabled="isDeleting"
                >
                    Cancel
                </Button>
                <Button
                    variant="destructive"
                    @click="confirmDelete"
                    :disabled="isDeleting"
                >
                    {{ isDeleting ? "Deleting..." : "Delete" }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { PencilIcon, TrashIcon } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import ExpenseTypeForm from "~/components/additional-expense-types/expense-type-form.vue";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import PageContainer from "~/components/ui/page-container.vue";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import { useAdditionalExpenseTypes } from "~/composables/useAdditionalExpenseTypes";
import { DIALOG_SIZES } from "~/constants/dialog";
import type { AdditionalExpenseType } from "~/types/additional-expense-type";

const {
    expenseTypes,
    loading,
    fetchExpenseTypes,
    addExpenseType,
    updateExpenseType,
    deleteExpenseType,
    initializeDefaultTypes,
} = useAdditionalExpenseTypes();

const showForm = ref(false);
const showDeleteConfirm = ref(false);
const selectedType = ref<AdditionalExpenseType | undefined>();
const isDeleting = ref(false);

const handleAddType = () => {
    selectedType.value = undefined;
    showForm.value = true;
};

const handleEditType = (type: AdditionalExpenseType) => {
    selectedType.value = type;
    showForm.value = true;
};

const handleDeleteType = (type: AdditionalExpenseType) => {
    selectedType.value = type;
    showDeleteConfirm.value = true;
};

const handleSubmitType = async (
    type: Omit<AdditionalExpenseType, "id" | "createdAt" | "updatedAt">
) => {
    try {
        if (selectedType.value) {
            await updateExpenseType({
                ...type,
                id: selectedType.value.id,
            } as AdditionalExpenseType);
        } else {
            await addExpenseType(type as AdditionalExpenseType);
        }
        showForm.value = false;
        selectedType.value = undefined;
    } catch (error) {
        console.error("Error submitting expense type:", error);
    }
};

const confirmDelete = async () => {
    if (!selectedType.value) return;

    try {
        isDeleting.value = true;
        await deleteExpenseType(selectedType.value);
        showDeleteConfirm.value = false;
        selectedType.value = undefined;
    } catch (error) {
        console.error("Error deleting expense type:", error);
    } finally {
        isDeleting.value = false;
    }
};

onMounted(async () => {
    await initializeDefaultTypes();
    await fetchExpenseTypes();
});
</script>
