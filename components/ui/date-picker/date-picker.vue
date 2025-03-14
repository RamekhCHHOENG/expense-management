<template>
    <Popover>
        <PopoverTrigger as-child>
            <Button
                :variant="'outline'"
                :class="[
                    'w-full justify-start text-left font-normal',
                    !modelValue && 'text-muted-foreground',
                ]"
                :disabled="disabled"
            >
                <CalendarIcon class="mr-2 h-4 w-4" />
                <span>{{
                    modelValue
                        ? format(new Date(modelValue), "PPP")
                        : placeholder
                }}</span>
            </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
            <Calendar v-model="selectedDate" :defaultValue="selectedDate" />
        </PopoverContent>
    </Popover>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { parseDate, type DateValue } from "@internationalized/date";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-vue-next";
import { computed } from "vue";

const props = withDefaults(
    defineProps<{
        modelValue?: string;
        placeholder?: string;
        disabled?: boolean;
    }>(),
    {
        placeholder: "Pick a date",
        disabled: false,
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();

const selectedDate = computed<DateValue | undefined>({
    get: () => {
        if (!props.modelValue) return undefined;
        try {
            return parseDate(props.modelValue);
        } catch {
            return undefined;
        }
    },
    set: (value: DateValue | undefined) => {
        if (!value) {
            emit("update:modelValue", "");
            return;
        }
        emit("update:modelValue", value.toString());
    },
});
</script>
