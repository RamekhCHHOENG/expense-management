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
                        <TableHead>Additional Expense Type</TableHead>
                        <TableHead class="text-right"
                            >Additional Amount</TableHead
                        >
                        <TableHead v-if="!disabled"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-if="!modelValue?.length">
                        <TableCell
                            colspan="5"
                            class="text-center text-muted-foreground"
                        >
                            No users added yet
                        </TableCell>
                    </TableRow>
                    <TableRow v-for="user in modelValue" :key="user.id">
                        <TableCell>{{ user.name }}</TableCell>
                        <TableCell class="text-right">{{
                            formatCurrency(user.amount)
                        }}</TableCell>
                        <TableCell>
                            <Select
                                v-model="user.additionalExpenseType"
                                :disabled="disabled"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem
                                            v-for="type in additionalExpenseTypes"
                                            :key="type.uuid"
                                            :value="type.uuid"
                                        >
                                            {{ type.name }}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell>
                            <NumberField
                                v-if="user.additionalExpenseType"
                                :model-value="user.additionalAmount"
                                @update:model-value="
                                    (v) => updateAdditionalAmount(user.id, v)
                                "
                                :disabled="disabled"
                                :format-options="{
                                    style: 'currency',
                                    currency: 'USD',
                                }"
                            >
                                <NumberFieldContent>
                                    <FormControl>
                                        <NumberFieldInput class="text-right" />
                                    </FormControl>
                                </NumberFieldContent>
                            </NumberField>
                        </TableCell>
                        <TableCell v-if="!disabled" class="w-[50px]">
                            <Button
                                variant="ghost"
                                size="icon"
                                @click="removeUser(user.id)"
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
                                            :key="user.uid"
                                            :value="user.uid"
                                        >
                                            {{
                                                user.displayName ||
                                                user.username
                                            }}
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
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell class="w-[50px]">
                            <Button
                                variant="ghost"
                                size="icon"
                                @click="addSelectedUser"
                                :disabled="!selectedUserId"
                            >
                                <span class="sr-only">Add user</span>
                                <XIcon class="h-4 w-4 rotate-45" />
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { XIcon } from "lucide-vue-next";
import { computed, onMounted, ref, watch } from "vue";
import { Button } from "~/components/ui/button";
import { FormControl } from "~/components/ui/form";
import {
    NumberField,
    NumberFieldContent,
    NumberFieldInput,
} from "~/components/ui/number-field";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import type { UserProfile } from "~/services/user";
import { useUserService } from "~/services/user";

interface ExpenseUser {
    id: string;
    name: string;
    amount: number;
    additionalExpenseType?: string;
    additionalAmount?: number;
}

interface AdditionalExpenseType {
    uuid: string;
    name: string;
}

const additionalExpenseTypes = [
    { uuid: "fridge", name: "Fridge" },
    { uuid: "mining", name: "Mining" },
    { uuid: "ac", name: "Air Conditioning" },
];

const props = defineProps<{
    modelValue: ExpenseUser[];
    totalAmount: number;
    disabled?: boolean;
}>();

const emit = defineEmits<{
    (e: "update:model-value", value: ExpenseUser[]): void;
}>();

const userService = useUserService();
const users = ref<UserProfile[]>([]);
const selectedUserId = ref("");

const recalculateAllShares = () => {
    if (!props.modelValue?.length) return;

    const numUsers = props.modelValue.length;
    const newUsers = props.modelValue.map((user) => ({
        ...user,
        amount: calculateShareAmount(numUsers),
    }));

    emit("update:model-value", newUsers);
};

// Watch for changes in total amount
watch(() => props.totalAmount, recalculateAllShares);

// Fetch all users and initialize shares
onMounted(async () => {
    try {
        users.value = await userService.getAllUsers();
        recalculateAllShares();
    } catch (error) {
        console.error("Failed to fetch users:", error);
    }
});

const availableUsers = computed(() => {
    return users.value.filter(
        (user) =>
            !props.modelValue?.some(
                (expenseUser) => expenseUser.id === user.uid
            )
    );
});

const calculateShareAmount = (numUsers: number) => {
    if (numUsers <= 0) return 0;
    return props.totalAmount / numUsers;
};

const updateAdditionalAmount = (userId: string, amount: number) => {
    const newUsers = props.modelValue.map((user) => {
        if (user.id === userId) {
            return {
                ...user,
                additionalAmount: amount,
            };
        }
        return user;
    });
    emit("update:model-value", newUsers);
};

const addSelectedUser = () => {
    if (!selectedUserId.value) return;

    const user = users.value.find((u) => u.uid === selectedUserId.value);
    if (!user) return;

    const newUsers = [...(props.modelValue || [])];
    const numUsers = newUsers.length + 1;

    // Recalculate shares for all users
    newUsers.forEach((u) => {
        u.amount = calculateShareAmount(numUsers);
    });

    // Add new user
    newUsers.push({
        id: user.uid,
        name: user.displayName || user.username,
        amount: calculateShareAmount(numUsers),
    });

    emit("update:model-value", newUsers);
    selectedUserId.value = "";
};

const removeUser = (userId: string) => {
    const newUsers = props.modelValue.filter((u) => u.id !== userId);
    const numUsers = newUsers.length;

    // Recalculate shares for remaining users
    newUsers.forEach((u) => {
        u.amount = calculateShareAmount(numUsers);
    });

    emit("update:model-value", newUsers);
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};
</script>
