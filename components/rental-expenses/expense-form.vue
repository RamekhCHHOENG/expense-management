<template>
    <form id="expense-form" @submit.prevent="onSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Date -->
            <FormField name="date" v-slot="{ value }">
                <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                        <DatePicker
                            :model-value="value"
                            @update:model-value="
                                (v) => setFieldValue('date', v)
                            "
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>

            <!-- House Rent -->
            <FormField name="house" v-slot="{ value }">
                <FormItem>
                    <FormLabel>House Rent</FormLabel>
                    <NumberField
                        class="gap-2"
                        :min="0"
                        :format-options="{
                            style: 'currency',
                            currency: 'USD',
                            currencyDisplay: 'symbol',
                            currencySign: 'accounting',
                        }"
                        :model-value="value"
                        :disabled="disabled"
                        @update:model-value="
                            (v) => setFieldValue('house', v ?? 0)
                        "
                    >
                        <NumberFieldContent>
                            <FormControl>
                                <NumberFieldInput class="text-left pl-3" />
                            </FormControl>
                        </NumberFieldContent>
                    </NumberField>
                    <FormMessage />
                </FormItem>
            </FormField>

            <!-- Electricity -->
            <FormField name="electricity" v-slot="{ value }">
                <FormItem>
                    <FormLabel>Electricity</FormLabel>
                    <NumberField
                        class="gap-2"
                        :min="0"
                        :format-options="{
                            style: 'currency',
                            currency: 'USD',
                            currencyDisplay: 'symbol',
                            currencySign: 'accounting',
                        }"
                        :model-value="value"
                        :disabled="disabled"
                        @update:model-value="
                            (v) => setFieldValue('electricity', v ?? 0)
                        "
                    >
                        <NumberFieldContent>
                            <FormControl>
                                <NumberFieldInput class="text-left pl-3" />
                            </FormControl>
                        </NumberFieldContent>
                    </NumberField>
                    <FormMessage />
                </FormItem>
            </FormField>

            <!-- Water -->
            <FormField name="water" v-slot="{ value }">
                <FormItem>
                    <FormLabel>Water</FormLabel>
                    <NumberField
                        class="gap-2"
                        :min="0"
                        :format-options="{
                            style: 'currency',
                            currency: 'USD',
                            currencyDisplay: 'symbol',
                            currencySign: 'accounting',
                        }"
                        :model-value="value"
                        :disabled="disabled"
                        @update:model-value="(v) => setFieldValue('water', v)"
                    >
                        <NumberFieldContent>
                            <FormControl>
                                <NumberFieldInput class="text-left pl-3" />
                            </FormControl>
                        </NumberFieldContent>
                    </NumberField>
                    <FormMessage />
                </FormItem>
            </FormField>

            <!-- Waste -->
            <FormField name="waste" v-slot="{ value }">
                <FormItem>
                    <FormLabel>Waste</FormLabel>
                    <NumberField
                        class="gap-2"
                        :min="0"
                        :format-options="{
                            style: 'currency',
                            currency: 'USD',
                            currencyDisplay: 'symbol',
                            currencySign: 'accounting',
                        }"
                        :model-value="value"
                        :disabled="disabled"
                        @update:model-value="(v) => setFieldValue('waste', v)"
                    >
                        <NumberFieldContent>
                            <FormControl>
                                <NumberFieldInput class="text-left pl-3" />
                            </FormControl>
                        </NumberFieldContent>
                    </NumberField>
                    <FormMessage />
                </FormItem>
            </FormField>

            <!-- Additional -->
            <FormField name="additional" v-slot="{ value }">
                <FormItem>
                    <FormLabel>Additional</FormLabel>
                    <NumberField
                        class="gap-2"
                        :min="0"
                        :format-options="{
                            style: 'currency',
                            currency: 'USD',
                            currencyDisplay: 'symbol',
                            currencySign: 'accounting',
                        }"
                        :model-value="value"
                        :disabled="disabled"
                        @update:model-value="
                            (v) => setFieldValue('additional', v)
                        "
                    >
                        <NumberFieldContent>
                            <FormControl>
                                <NumberFieldInput class="text-left pl-3" />
                            </FormControl>
                        </NumberFieldContent>
                    </NumberField>
                    <FormMessage />
                </FormItem>
            </FormField>
        </div>

        <!-- Expense Sharing Table -->
        <div class="col-span-full">
            <FormField name="users" v-slot="{ value }">
                <FormItem>
                    <FormLabel>Expense Sharing</FormLabel>
                    <FormControl>
                        <ExpenseSharingTable
                            :model-value="value || []"
                            :total-amount="totalAmount"
                            :disabled="disabled"
                            @update:model-value="
                                (v) => setFieldValue('users', v)
                            "
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
        </div>

        <div v-if="!disabled" class="flex justify-end space-x-2 mt-6">
            <Button type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? "Saving..." : expense ? "Update" : "Add" }}
                Expense
            </Button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    NumberField,
    NumberFieldContent,
    NumberFieldInput,
} from "@/components/ui/number-field";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { computed, onMounted, ref } from "vue";
import * as z from "zod";
import type { ExpenseUser } from "~/types/expense";
import ExpenseSharingTable from "./expense-sharing-table.vue";

interface Props {
    expense?: {
        date: string;
        house: number;
        electricity: number;
        water: number | null;
        waste: number | null;
        additional: number | null;
        users: ExpenseUser[];
    };
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
});

const emit = defineEmits<{
    (e: "submit", expense: Props["expense"]): void;
}>();

const formSchema = toTypedSchema(
    z.object({
        date: z.string().min(1, "Date is required"),
        house: z.number().min(0.01, "House rent must be greater than 0"),
        electricity: z
            .number()
            .min(0, "Electricity must be greater than or equal to 0"),
        water: z.number().nullable().default(null),
        waste: z.number().nullable().default(null),
        additional: z.number().nullable().default(null),
        users: z
            .array(
                z.object({
                    id: z.string(),
                    name: z.string(),
                    email: z.string(),
                    amount: z.number(),
                    electricityShare: z.number(),
                    additionalExpenseType: z.string().optional(),
                    additionalAmount: z.number().optional(),
                })
            )
            .default([]),
    })
);

const { handleSubmit, setFieldValue, values } = useForm({
    validationSchema: formSchema,
    initialValues: {
        date: new Date().toISOString().split("T")[0],
        house: 0,
        electricity: 0,
        water: null,
        waste: null,
        additional: null,
        users: [],
    },
});

// Computed property for total amount
const totalAmount = computed(() => {
    return (
        (values.house || 0) +
        (values.electricity || 0) +
        (values.water || 0) +
        (values.waste || 0) +
        (values.additional || 0)
    );
});

const isSubmitting = ref(false);

const onSubmit = handleSubmit(async (formValues) => {
    isSubmitting.value = true;
    try {
        // Ensure all numeric values are initialized
        const expense = {
            date: formValues.date,
            house: formValues.house || 0,
            electricity: formValues.electricity || 0,
            water: formValues.water,
            waste: formValues.waste,
            additional: formValues.additional,
            users: formValues.users.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                amount: user.amount || 0,
                electricityShare: user.electricityShare || 0,
                additionalExpenseType: user.additionalExpenseType,
                additionalAmount: user.additionalAmount,
            })),
        };

        emit("submit", expense);
    } finally {
        isSubmitting.value = false;
    }
});

// Initialize form with expense data if editing
const initializeForm = () => {
    if (props.expense) {
        setFieldValue("date", props.expense.date);
        setFieldValue("house", props.expense.house);
        setFieldValue("electricity", props.expense.electricity);
        setFieldValue("water", props.expense.water);
        setFieldValue("waste", props.expense.waste);
        setFieldValue("additional", props.expense.additional);
        setFieldValue("users", props.expense.users || []);
    }
};

onMounted(initializeForm);
</script>

<style scoped>
.form-group {
    @apply flex flex-col gap-1.5;
}
</style>
