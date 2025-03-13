<template>
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <!-- Pagination Information -->
        <p class="text-sm text-muted-foreground order-2 sm:order-1">
            Showing <span class="font-medium">{{ startItem }}</span> to
            <span class="font-medium">{{ endItem }}</span> of
            <span class="font-medium">{{ totalItems }}</span> items
            <span class="mx-1">•</span>
            Page <span class="font-medium">{{ currentPage }}</span> of
            <span class="font-medium">{{ totalPages }}</span>
            <span class="mx-1">•</span>
            <span class="font-medium">{{ itemsPerPage }}</span> items per page
        </p>
        <div class="flex items-center justify-center gap-1 order-1 sm:order-2">
            <Button
                variant="outline"
                size="icon"
                :disabled="currentPage === 1"
                @click="currentPage !== 1 && handlePageChange(currentPage - 1)"
            >
                <ChevronLeft class="h-4 w-4" />
            </Button>

            <template v-for="page in pages" :key="page">
                <template v-if="page === 'ellipsis'">
                    <Button variant="ghost" size="icon" disabled>...</Button>
                </template>
                <Button
                    v-else
                    variant="ghost"
                    size="icon"
                    :class="{
                        'bg-primary text-primary-foreground':
                            currentPage === page,
                    }"
                    @click="handlePageChange(page as number)"
                >
                    {{ page }}
                </Button>
            </template>

            <Button
                variant="outline"
                size="icon"
                :disabled="currentPage === totalPages"
                @click="
                    currentPage !== totalPages &&
                    handlePageChange(currentPage + 1)
                "
            >
                <ChevronRight class="h-4 w-4" />
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { computed } from "vue";
import { Button } from "./button";

const props = defineProps<{
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
}>();

const emit = defineEmits<{
    (e: "update:currentPage", page: number): void;
}>();

const totalPages = computed(() =>
    Math.ceil(props.totalItems / props.itemsPerPage)
);

const startItem = computed(() => {
    if (props.totalItems === 0) return 0;
    return (props.currentPage - 1) * props.itemsPerPage + 1;
});

const endItem = computed(() => {
    const end = props.currentPage * props.itemsPerPage;
    return Math.min(end, props.totalItems);
});

const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        emit("update:currentPage", page);
    }
};

const pages = computed(() => {
    const result: (number | string)[] = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let start = Math.max(1, props.currentPage - halfVisible);
    let end = Math.min(totalPages.value, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
    }

    // Add first page
    if (start > 1) {
        result.push(1);
        if (start > 2) result.push("...");
    }

    // Add visible pages
    for (let i = start; i <= end; i++) {
        result.push(i);
    }

    // Add last page
    if (end < totalPages.value) {
        if (end < totalPages.value - 1) result.push("...");
        result.push(totalPages.value);
    }

    return result;
});
</script>
