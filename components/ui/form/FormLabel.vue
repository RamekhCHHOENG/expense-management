<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { useFormField } from "./useFormField";

interface Props {
    class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
    class: undefined,
});

const { error, formItemId } = useFormField();
</script>

<template>
    <Label
        :class="cn(error && 'text-destructive', props.class)"
        :for="formItemId"
    >
        <slot />
    </Label>
</template>
