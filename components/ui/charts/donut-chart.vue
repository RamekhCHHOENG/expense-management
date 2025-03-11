<script setup lang="ts">
import { colors } from "@unovis/ts";
import { VisDonut, VisSingleContainer } from "@unovis/vue";
import { ref } from "vue";

const props = defineProps<{
    data: Array<{ name: string; value: number }>;
    colors?: string[];
}>();

const containerRef = ref<HTMLElement | null>(null);

const donutAccessors = {
    name: (d: any) => d.name,
    value: (d: any) => d.value,
    arcWidth: 30,
    showLabels: true,
    showTooltip: true,
    labelText: (d: any) => `${d.name}: ${d.value}`,
};
</script>

<template>
    <div ref="containerRef" class="w-full h-full">
        <VisSingleContainer :data="data">
            <VisDonut
                :colors="props.colors || [colors[0], colors[1]]"
                v-bind="donutAccessors"
            />
        </VisSingleContainer>
    </div>
</template>
