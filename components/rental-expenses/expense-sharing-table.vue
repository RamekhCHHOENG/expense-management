<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">Expense Sharing</h3>
            <div class="text-sm text-muted-foreground">
                Total Amount: {{ formatCurrency(totalAmount) }}
            </div>
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
                    <!-- Add User Row -->
                    <TableRow v-if="!disabled && availableUsers.length > 0">
                        <TableCell>
                            <Select v-model="selectedUserId">
                                <SelectTrigger class="w-[200px]">
                                    <SelectValue placeholder="Add a user..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem
                                            v-for="user in availableUsers"
                                            :key="user.id"
                                            :value="user.id"
                                        >
                                            {{ user.name }}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell class="text-right">
                            {{
                                selectedUserId
                                    ? formatCurrency(
                                          calculateShareAmount(
                                              modelValue?.length
                                                  ? modelValue.length + 1
                                                  : 1
                                          )
                                      )
                                    : "-"
                            }}
                        </TableCell>
                        <TableCell class="w-[50px]">
                            <Button
                                variant="ghost"
                                size="icon"
                                @click="addSelectedUser"
                                :disabled="!selectedUserId"
                            >
                                <PlusIcon class="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PlusIcon, XIcon } from "lucide-vue-next";
import { computed, onMounted, ref, watch } from "vue";
import type { User } from "~/stores/users";
import { useUsersStore } from "~/stores/users";
import type { Expense, ExpenseShare } from "~/types/expense";
import { formatCurrency } from "~/utils/format";

interface Props {
    modelValue?: ExpenseShare[];
    totalAmount: number;
    disabled?: boolean;
    expense?: Expense;
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
});

const emit = defineEmits<{
    (e: "update:modelValue", value: ExpenseShare[]): void;
}>();

const usersStore = useUsersStore();
const selectedUserId = ref<string | null>(null);

const availableUsers = computed(() => {
    const currentUserIds = new Set(
        props.modelValue?.map((share) => share.userId) || []
    );
    return usersStore.users.filter(
        (user: User) => !currentUserIds.has(user.id)
    );
});

const addSelectedUser = () => {
    if (!selectedUserId.value) return;

    const user = usersStore.users.find((u) => u.id === selectedUserId.value);
    if (!user) return;

    const newShares = [...(props.modelValue || [])];
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
    selectedUserId.value = null;
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

// Watch for changes in totalAmount to recalculate shares
watch(
    () => props.totalAmount,
    (newAmount) => {
        if (!props.modelValue?.length) return;

        const newShares = [...props.modelValue];
        newShares.forEach((share) => {
            share.amount = calculateShareAmount(newShares.length);
        });

        emit("update:modelValue", newShares);
    },
    { immediate: true }
);

onMounted(async () => {
    await usersStore.fetchUsers();
});
</script>
