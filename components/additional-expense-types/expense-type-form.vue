<template>
    <form @submit.prevent="onSubmit" class="space-y-4">
        <FormField name="name" v-slot="{ value }">
            <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                    <Input
                        :model-value="String(value || '')"
                        @update:model-value="(v) => setFieldValue('name', v)"
                        placeholder="Enter expense type name"
                        :disabled="disabled"
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField name="description" v-slot="{ value }">
            <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Textarea
                        :model-value="String(value || '')"
                        @update:model-value="
                            (v) => setFieldValue('description', v)
                        "
                        placeholder="Enter description"
                        :disabled="disabled"
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <div class="flex justify-end space-x-2">
            <Button type="submit" :disabled="isSubmitting || disabled">
                {{
                    isSubmitting ? "Saving..." : expenseType ? "Update" : "Add"
                }}
            </Button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ref } from "vue";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import type { AdditionalExpenseType } from "~/types/additional-expense-type";

interface Props {
    expenseType?: AdditionalExpenseType;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
});

const emit = defineEmits<{
    (
        e: "submit",
        expenseType: Omit<
            AdditionalExpenseType,
            "id" | "createdAt" | "updatedAt"
        >
    ): void;
}>();

const formSchema = toTypedSchema(
    z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().optional(),
    })
);

const { handleSubmit, setFieldValue } = useForm({
    validationSchema: formSchema,
    initialValues: {
        name: props.expenseType?.name || "",
        description: props.expenseType?.description || "",
    },
});

const isSubmitting = ref(false);

const onSubmit = handleSubmit(async (values) => {
    isSubmitting.value = true;
    try {
        emit("submit", values);
    } finally {
        isSubmitting.value = false;
    }
});
</script>
