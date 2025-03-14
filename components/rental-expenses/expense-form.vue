<template>
    <form id="expense-form" @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Date -->
            <div class="form-group">
                <Label for="date">Date</Label>
                <DatePicker
                    id="date"
                    v-model="formData.date"
                    :disabled="disabled"
                    :class="{ 'border-red-500': errors.date }"
                />
                <span v-if="errors.date" class="text-sm text-red-500">{{
                    errors.date
                }}</span>
            </div>

            <!-- House Rent -->
            <div class="form-group">
                <Label for="house">House Rent</Label>
                <Input
                    id="house"
                    v-model="formData.house"
                    type="number"
                    step="0.01"
                    :disabled="disabled"
                    :class="{ 'border-red-500': errors.house }"
                />
                <span v-if="errors.house" class="text-sm text-red-500">{{
                    errors.house
                }}</span>
            </div>

            <!-- Total Electricity -->
            <div class="form-group">
                <Label for="totalElect">Total Electricity</Label>
                <Input
                    id="totalElect"
                    v-model="formData.totalElect"
                    type="number"
                    step="0.01"
                    :disabled="disabled"
                />
            </div>

            <!-- RT AC & Fridge -->
            <div class="form-group">
                <Label for="rtAcFridge">RT AC & Fridge</Label>
                <Input
                    id="rtAcFridge"
                    v-model="formData.rtAcFridge"
                    type="number"
                    step="0.01"
                    :disabled="disabled"
                />
            </div>

            <!-- Phea Fridge -->
            <div class="form-group">
                <Label for="pheaFridge">Phea Fridge</Label>
                <Input
                    id="pheaFridge"
                    v-model="formData.pheaFridge"
                    type="number"
                    step="0.01"
                    :disabled="disabled"
                />
            </div>

            <!-- Mining -->
            <div class="form-group">
                <Label for="mining">Mining</Label>
                <Input
                    id="mining"
                    v-model="formData.mining"
                    type="number"
                    step="0.01"
                    :disabled="disabled"
                />
            </div>

            <!-- Electricity -->
            <div class="form-group">
                <Label for="electricity">Electricity</Label>
                <Input
                    id="electricity"
                    v-model="formData.electricity"
                    type="number"
                    step="0.01"
                    :disabled="disabled"
                    :class="{ 'border-red-500': errors.electricity }"
                />
                <span v-if="errors.electricity" class="text-sm text-red-500">{{
                    errors.electricity
                }}</span>
            </div>

            <!-- Water -->
            <div class="form-group">
                <Label for="water">Water</Label>
                <Input
                    id="water"
                    v-model="formData.water"
                    type="number"
                    step="0.01"
                    :disabled="disabled"
                />
            </div>

            <!-- Waste -->
            <div class="form-group">
                <Label for="waste">Waste</Label>
                <Input
                    id="waste"
                    v-model="formData.waste"
                    type="number"
                    step="0.01"
                    :disabled="disabled"
                />
            </div>

            <!-- Additional -->
            <div class="form-group">
                <Label for="additional">Additional</Label>
                <Input
                    id="additional"
                    v-model="formData.additional"
                    type="number"
                    step="0.01"
                    :disabled="disabled"
                />
            </div>
        </div>

        <div v-if="!disabled" class="flex justify-end space-x-2">
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { computed, onMounted, ref } from "vue";

interface Expense {
    id?: string;
    date: string;
    house: number;
    totalElect: number | null;
    rtAcFridge: number | null;
    pheaFridge: number | null;
    mining: number | null;
    electricity: number;
    water: number | null;
    waste: number | null;
    additional: number | null;
    createdAt?: Date;
    updatedAt?: Date;
}

interface Props {
    expense?: Expense;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
});

const emit = defineEmits<{
    (e: "submit", expense: Expense): void;
}>();

const formData = ref({
    date: new Date().toISOString().split("T")[0],
    house: "0",
    totalElect: "",
    rtAcFridge: "",
    pheaFridge: "",
    mining: "",
    electricity: "0",
    water: "",
    waste: "",
    additional: "",
});

// Computed properties to handle the conversion between string and number | null
const form = computed<Expense>(() => ({
    date: formData.value.date,
    house: Number(formData.value.house),
    totalElect: formData.value.totalElect
        ? Number(formData.value.totalElect)
        : null,
    rtAcFridge: formData.value.rtAcFridge
        ? Number(formData.value.rtAcFridge)
        : null,
    pheaFridge: formData.value.pheaFridge
        ? Number(formData.value.pheaFridge)
        : null,
    mining: formData.value.mining ? Number(formData.value.mining) : null,
    electricity: Number(formData.value.electricity),
    water: formData.value.water ? Number(formData.value.water) : null,
    waste: formData.value.waste ? Number(formData.value.waste) : null,
    additional: formData.value.additional
        ? Number(formData.value.additional)
        : null,
}));

const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);

const validateForm = () => {
    errors.value = {};

    if (!form.value.date) {
        errors.value.date = "Date is required";
    }

    if (!form.value.house || form.value.house <= 0) {
        errors.value.house = "House rent must be greater than 0";
    }

    if (!form.value.electricity || form.value.electricity < 0) {
        errors.value.electricity = "Electricity must be 0 or greater";
    }

    return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
    if (!validateForm()) return;

    isSubmitting.value = true;
    try {
        emit("submit", form.value);

        if (!props.expense) {
            // Reset form if adding new expense
            formData.value = {
                date: new Date().toISOString().split("T")[0],
                house: "0",
                totalElect: "",
                rtAcFridge: "",
                pheaFridge: "",
                mining: "",
                electricity: "0",
                water: "",
                waste: "",
                additional: "",
            };
        }
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(() => {
    if (props.expense) {
        formData.value = {
            date: props.expense.date,
            house: props.expense.house.toString(),
            totalElect: props.expense.totalElect?.toString() ?? "",
            rtAcFridge: props.expense.rtAcFridge?.toString() ?? "",
            pheaFridge: props.expense.pheaFridge?.toString() ?? "",
            mining: props.expense.mining?.toString() ?? "",
            electricity: props.expense.electricity.toString(),
            water: props.expense.water?.toString() ?? "",
            waste: props.expense.waste?.toString() ?? "",
            additional: props.expense.additional?.toString() ?? "",
        };
    }
});
</script>

<style scoped>
.form-group {
    @apply flex flex-col gap-1.5;
}
</style>
