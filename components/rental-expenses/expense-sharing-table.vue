<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">Expense Sharing</h3>
            <Button
                v-if="!disabled"
                @click="showAddUser = true"
                variant="outline"
                size="sm"
            >
                Add User
            </Button>
        </div>

        <!-- Users Table -->
        <div class="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead class="text-right">Share Amount</TableHead>
                        <TableHead v-if="!disabled"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-if="!modelValue?.length">
                        <TableCell
                            colspan="3"
                            class="text-center text-muted-foreground"
                        >
                            No users added yet
                        </TableCell>
                    </TableRow>
                    <TableRow v-for="share in modelValue" :key="share.userId">
                        <TableCell>{{ share.userName }}</TableCell>
                        <TableCell class="text-right">{{
                            formatCurrency(share.amount)
                        }}</TableCell>
                        <TableCell v-if="!disabled" class="w-[50px]">
                            <Button
                                variant="ghost"
                                size="icon"
                                @click="removeUser(share.userId)"
                            >
                                <XIcon class="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

        <!-- Add User Dialog -->
        <Dialog v-model:open="showAddUser">
            <DialogContent class="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add User</DialogTitle>
                    <DialogDescription>
                        Select a user to add to expense sharing
                    </DialogDescription>
                </DialogHeader>
                <div class="grid gap-4 py-4">
                    <Combobox
                        v-model="selectedUser"
                        :options="availableUsers"
                        display-field="name"
                        value-field="id"
                        placeholder="Select a user..."
                    />
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        @click="addUser"
                        :disabled="!selectedUser"
                    >
                        Add User
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { XIcon } from "lucide-vue-next";
import { computed, ref } from "vue";
import type { User } from "~/stores/users";
import { useUsersStore } from "~/stores/users";
import type { ExpenseShare } from "~/types/expense";
import { formatCurrency } from "~/utils/format";

interface Props {
    modelValue?: ExpenseShare[];
    totalAmount: number;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
});

const emit = defineEmits<{
    (e: "update:modelValue", value: ExpenseShare[]): void;
}>();

const usersStore = useUsersStore();
const showAddUser = ref(false);
const selectedUser = ref<string | null>(null);

const availableUsers = computed(() => {
    const currentUserIds = new Set(
        props.modelValue?.map((share) => share.userId) || []
    );
    return usersStore.users.filter(
        (user: User) => !currentUserIds.has(user.id)
    );
});

const addUser = () => {
    if (!selectedUser.value || !props.modelValue) return;

    const user = usersStore.users.find(
        (u: User) => u.id === selectedUser.value
    );
    if (!user) return;

    const newShares = [...props.modelValue];
    newShares.push({
        userId: user.id,
        userName: user.name,
        amount: calculateShareAmount(newShares.length + 1),
    });

    // Recalculate amounts for all shares
    newShares.forEach((share) => {
        share.amount = calculateShareAmount(newShares.length);
    });

    emit("update:modelValue", newShares);
    selectedUser.value = null;
    showAddUser.value = false;
};

const removeUser = (userId: string) => {
    if (!props.modelValue) return;

    const newShares = props.modelValue.filter(
        (share) => share.userId !== userId
    );

    // Recalculate amounts for remaining shares
    newShares.forEach((share) => {
        share.amount = calculateShareAmount(newShares.length);
    });

    emit("update:modelValue", newShares);
};

const calculateShareAmount = (numberOfShares: number) => {
    return numberOfShares > 0 ? props.totalAmount / numberOfShares : 0;
};
</script>
