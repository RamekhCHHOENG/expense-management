<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Date -->
            <div class="form-group">
                <Label for="date">Date</Label>
                <Input
                    id="date"
                    v-model="form.date"
                    type="date"
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
                    v-model="form.house"
                    type="number"
                    step="0.01"
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
                    v-model="form.totalElect"
                    type="number"
                    step="0.01"
                />
            </div>

            <!-- RT AC & Fridge -->
            <div class="form-group">
                <Label for="rtAcFridge">RT AC & Fridge</Label>
                <Input
                    id="rtAcFridge"
                    v-model="form.rtAcFridge"
                    type="number"
                    step="0.01"
                />
            </div>

            <!-- Phea Fridge -->
            <div class="form-group">
                <Label for="pheaFridge">Phea Fridge</Label>
                <Input
                    id="pheaFridge"
                    v-model="form.pheaFridge"
                    type="number"
                    step="0.01"
                />
            </div>

            <!-- Mining -->
            <div class="form-group">
                <Label for="mining">Mining</Label>
                <Input
                    id="mining"
                    v-model="form.mining"
                    type="number"
                    step="0.01"
                />
            </div>

            <!-- Electricity -->
            <div class="form-group">
                <Label for="electricity">Electricity</Label>
                <Input
                    id="electricity"
                    v-model="form.electricity"
                    type="number"
                    step="0.01"
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
                    v-model="form.water"
                    type="number"
                    step="0.01"
                />
            </div>

            <!-- Waste -->
            <div class="form-group">
                <Label for="waste">Waste</Label>
                <Input
                    id="waste"
                    v-model="form.waste"
                    type="number"
                    step="0.01"
                />
            </div>

            <!-- Additional -->
            <div class="form-group">
                <Label for="additional">Additional</Label>
                <Input
                    id="additional"
                    v-model="form.additional"
                    type="number"
                    step="0.01"
                />
            </div>
        </div>

        <div class="flex justify-end space-x-2">
            <Button type="submit" :disabled="isSubmitting">
                {{
                    isSubmitting ? "Saving..." : expense ? "Update" : "Add"
                }}
                Expense
            </Button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { onMounted, ref } from "vue";

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
}

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: "submit", expense: Expense): void;
}>();

const form = ref<Expense>({
    date: new Date().toISOString().split("T")[0],
    house: 0,
    totalElect: null,
    rtAcFridge: null,
    pheaFridge: null,
    mining: null,
    electricity: 0,
    water: null,
    waste: null,
    additional: null,
});

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
        emit("submit", {
            ...form.value,
            house: Number(form.value.house),
            totalElect: form.value.totalElect
                ? Number(form.value.totalElect)
                : null,
            rtAcFridge: form.value.rtAcFridge
                ? Number(form.value.rtAcFridge)
                : null,
            pheaFridge: form.value.pheaFridge
                ? Number(form.value.pheaFridge)
                : null,
            mining: form.value.mining ? Number(form.value.mining) : null,
            electricity: Number(form.value.electricity),
            water: form.value.water ? Number(form.value.water) : null,
            waste: form.value.waste ? Number(form.value.waste) : null,
            additional: form.value.additional
                ? Number(form.value.additional)
                : null,
        });

        if (!props.expense) {
            // Reset form if adding new expense
            form.value = {
                date: new Date().toISOString().split("T")[0],
                house: 0,
                totalElect: null,
                rtAcFridge: null,
                pheaFridge: null,
                mining: null,
                electricity: 0,
                water: null,
                waste: null,
                additional: null,
            };
        }
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(() => {
    if (props.expense) {
        form.value = { ...props.expense };
    }
});
</script>

<style scoped>
.form-group {
    @apply flex flex-col gap-1.5;
}
</style>
