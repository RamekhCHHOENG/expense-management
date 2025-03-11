<script setup lang="ts">
import { colors } from "@unovis/ts";
import { VisArea, VisXYContainer } from "@unovis/vue";
import { ref } from "vue";

const props = defineProps<{
    data: Array<{ month: string; total: number }>;
    xKey?: string;
    yKey?: string;
    color?: string;
}>();

const containerRef = ref<HTMLElement | null>(null);

const xAxis = {
    tickFormat: (d: string) => d,
    tickRotation: -45,
    tickSize: 5,
};

const yAxis = {
    tickFormat: (d: number) => d.toString(),
    tickSize: 5,
    title: "Total Users",
};

const areaAccessors = {
    x: (d: any) => d[props.xKey || "month"],
    y: (d: any) => d[props.yKey || "total"],
    showDots: true,
    fillOpacity: 0.2,
    curve: "monotoneX",
};
</script>

<template>
    <div ref="containerRef" class="w-full h-full">
        <VisXYContainer
            :data="data"
            :margins="{ left: 50, bottom: 50, right: 20, top: 20 }"
        >
            <VisArea
                :x-axis="xAxis"
                :y-axis="yAxis"
                :color="props.color || colors[0]"
                v-bind="areaAccessors"
            />
        </VisXYContainer>
    </div>
</template>
