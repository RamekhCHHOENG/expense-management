<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">Expense Sharing</h3>
            <Button
                variant="outline"
                size="sm"
                @click="addUser"
                :disabled="disabled"
            >
                <PlusIcon class="h-4 w-4 mr-2" />
                Add User
            </Button>
        </div>

        <div class="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead class="w-[100px] text-right"
                            >Share Amount</TableHead
                        >
                        <TableHead class="w-[100px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="(share, index) in shares" :key="index">
                        <TableCell @click.stop>
                            <ComboBox
                                v-model="share.userId"
                                :options="users"
                                :disabled="disabled"
                                @update:model-value="updateShares"
                            />
                        </TableCell>
                        <TableCell class="text-right">
                            $ {{ formatAmount(share.amount) }}
                        </TableCell>
                        <TableCell>
                            <Button
                                v-if="!disabled"
                                variant="ghost"
                                size="icon"
                                @click="removeUser(index)"
                            >
                                <TrashIcon class="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                    <TableRow v-if="shares.length === 0">
                        <TableCell
                            colspan="3"
                            class="text-center text-muted-foreground"
                        >
                            No users added
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { ComboBox } from "@/components/ui/combobox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PlusIcon, TrashIcon } from "@heroicons/vue/20/solid";
import { collection, getDocs } from "firebase/firestore";
import { ref, watch } from "vue";
import type { ExpenseShare } from "~/types/expense";
const { db } = useFirebase();

interface Props {
    totalAmount: number;
    disabled?: boolean;
    modelValue?: ExpenseShare[];
}

interface User {
    id: string;
    name: string;
    email: string;
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    modelValue: () => [],
});

const emit = defineEmits<{
    (e: "update:modelValue", shares: ExpenseShare[]): void;
}>();

const users = ref<User[]>([]);
const shares = ref<ExpenseShare[]>(props.modelValue);

// Fetch users from Firebase
const fetchUsers = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        users.value = querySnapshot.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                }) as User
        );
    } catch (error) {
        console.error("Error fetching users:", error);
    }
};

// Format amount to 2 decimal places
const formatAmount = (amount: number) => {
    return amount.toFixed(2);
};

// Add new user to shares
const addUser = () => {
    shares.value.push({
        userId: "",
        userName: "",
        amount: calculateShareAmount(shares.value.length + 1),
    });
    updateShares();
};

// Remove user from shares
const removeUser = (index: number) => {
    shares.value.splice(index, 1);
    updateShares();
};

// Calculate share amount per user
const calculateShareAmount = (numberOfUsers: number) => {
    return numberOfUsers > 0 ? props.totalAmount / numberOfUsers : 0;
};

// Update share amounts when users change
const updateShares = () => {
    const amount = calculateShareAmount(shares.value.length);
    shares.value = shares.value.map((share) => {
        const user = users.value.find((u) => u.id === share.userId);
        return {
            ...share,
            amount,
            userName: user ? user.name || user.email : "",
        };
    });
    emit("update:modelValue", shares.value);
};

// Watch for changes in total amount
watch(
    () => props.totalAmount,
    () => {
        updateShares();
    }
);

// Initialize component
onMounted(async () => {
    await fetchUsers();
});
</script>
