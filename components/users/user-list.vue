<script setup lang="ts">
import { Eye, Loader2, Pencil, Search, Trash } from "lucide-vue-next";
import { computed, ref, watch } from "vue";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
    Pagination,
    PaginationEllipsis,
    PaginationList,
    PaginationListItem,
    PaginationNext,
    PaginationPrev,
} from "~/components/ui/pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import type { UserProfile } from "~/services/user";

const props = defineProps<{
    users: UserProfile[];
    loading: boolean;
    itemsPerPage?: number;
}>();

const emit = defineEmits<{
    (e: "view", user: UserProfile): void;
    (e: "edit", user: UserProfile): void;
    (e: "delete", user: UserProfile): void;
    (e: "page", page: number): void;
}>();

const search = ref("");
const currentPage = ref(1);
const itemsPerPage = computed(() => props.itemsPerPage || 10);

const filteredUsers = computed(() => {
    if (!search.value) return props.users;
    const searchLower = search.value.toLowerCase();
    return props.users.filter(
        (user) =>
            user.displayName?.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower)
    );
});

const totalPages = computed(() =>
    Math.ceil(filteredUsers.value.length / itemsPerPage.value)
);

const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredUsers.value.slice(start, end);
});

const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

const formatDate = (date: any) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
};

const handlePageChange = (page: number) => {
    currentPage.value = page;
    emit("page", page);
};

// Reset to first page when search changes
watch(search, () => {
    currentPage.value = 1;
});

// Reset to first page when users array changes
watch(
    () => props.users,
    () => {
        currentPage.value = 1;
    }
);

const maxVisiblePages = 5; // Maximum number of page buttons to show

const visiblePages = computed(() => {
    const pages: (number | "ellipsis")[] = [];
    const total = totalPages.value;
    const current = currentPage.value;

    if (total <= maxVisiblePages) {
        // Show all pages if total is less than max visible
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    // Calculate start and end of visible pages
    let start = Math.max(2, current - Math.floor(maxVisiblePages / 2));
    let end = Math.min(total - 1, start + maxVisiblePages - 3);

    // Adjust start if end is too close to total
    start = Math.max(2, Math.min(start, total - maxVisiblePages + 2));

    // Add ellipsis after first page if needed
    if (start > 2) {
        pages.push("ellipsis");
    }

    // Add visible pages
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (end < total - 1) {
        pages.push("ellipsis");
    }

    // Always show last page
    if (total > 1) {
        pages.push(total);
    }

    return pages;
});

// Add computed properties for pagination info
const startItem = computed(() => {
    if (filteredUsers.value.length === 0) return 0;
    return (currentPage.value - 1) * itemsPerPage.value + 1;
});

const endItem = computed(() => {
    const end = currentPage.value * itemsPerPage.value;
    return Math.min(end, filteredUsers.value.length);
});

const totalItems = computed(() => filteredUsers.value.length);
</script>

<template>
    <!-- Search and Filter -->
    <div class="flex items-center gap-4 mb-4">
        <div class="flex-1">
            <Input
                v-model="search"
                placeholder="Search users..."
                class="max-w-sm"
            >
                <template #prefix>
                    <Search class="w-4 h-4 text-muted-foreground" />
                </template>
            </Input>
        </div>
    </div>

    <!-- Users Table Container -->
    <div class="relative rounded-md border">
        <div class="overflow-x-auto">
            <div class="inline-block min-w-full align-middle">
                <div class="overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead class="w-[200px]">ID</TableHead>
                                <TableHead class="w-[250px]">User</TableHead>
                                <TableHead class="w-[250px]">Email</TableHead>
                                <TableHead class="w-[180px]">Created</TableHead>
                                <TableHead class="w-[180px]">Updated</TableHead>
                                <TableHead class="w-[120px] text-right"
                                    >Actions</TableHead
                                >
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow
                                v-for="user in paginatedUsers"
                                :key="user.uid"
                            >
                                <TableCell class="text-muted-foreground">
                                    <div
                                        class="max-w-[100px] truncate"
                                        :title="user.uid"
                                    >
                                        {{ user.uid }}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div class="flex items-center gap-3">
                                        <Avatar v-if="user.photoURL">
                                            <AvatarImage
                                                :src="user.photoURL"
                                                :alt="user.displayName || ''"
                                            />
                                            <AvatarFallback>{{
                                                getInitials(user.displayName)
                                            }}</AvatarFallback>
                                        </Avatar>
                                        <Avatar v-else>
                                            <AvatarFallback>{{
                                                getInitials(user.displayName)
                                            }}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p
                                                class="font-medium max-w-[180px] truncate"
                                                :title="
                                                    user.displayName ||
                                                    'No Name'
                                                "
                                            >
                                                {{
                                                    user.displayName ||
                                                    "No Name"
                                                }}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div
                                        class="max-w-[250px] truncate"
                                        :title="user.email"
                                    >
                                        {{ user.email }}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div
                                        class="max-w-[180px] truncate"
                                        :title="formatDate(user.createdAt)"
                                    >
                                        {{ formatDate(user.createdAt) }}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div
                                        class="max-w-[180px] truncate"
                                        :title="formatDate(user.updatedAt)"
                                    >
                                        {{ formatDate(user.updatedAt) }}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div class="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            @click="emit('view', user)"
                                        >
                                            <Eye class="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            @click="emit('edit', user)"
                                        >
                                            <Pencil class="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            @click="emit('delete', user)"
                                        >
                                            <Trash class="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="loading">
                                <TableCell colspan="6" class="text-center py-8">
                                    <Loader2
                                        class="w-6 h-6 animate-spin mx-auto"
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow v-else-if="!paginatedUsers.length">
                                <TableCell
                                    colspan="6"
                                    class="text-center py-8 text-muted-foreground"
                                >
                                    No users found.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    </div>

    <!-- Pagination -->
    <div
        class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4"
    >
        <!-- Pagination Information -->
        <p class="text-sm text-muted-foreground order-2 sm:order-1">
            Showing <span class="font-medium">{{ startItem }}</span> to
            <span class="font-medium">{{ endItem }}</span> of
            <span class="font-medium">{{ totalItems }}</span> users
            <span class="mx-1">•</span>
            Page <span class="font-medium">{{ currentPage }}</span> of
            <span class="font-medium">{{ totalPages }}</span>
            <span class="mx-1">•</span>
            <span class="font-medium">{{ itemsPerPage }}</span> items per page
        </p>
        <Pagination class="order-1 sm:order-2">
            <PaginationList class="flex items-center justify-center gap-1">
                <PaginationListItem>
                    <PaginationPrev
                        class="cursor-pointer"
                        :class="{
                            'opacity-50 cursor-not-allowed': currentPage === 1,
                        }"
                        :disabled="currentPage === 1"
                        @click="
                            currentPage !== 1 &&
                            handlePageChange(currentPage - 1)
                        "
                    />
                </PaginationListItem>

                <template v-for="page in visiblePages" :key="page">
                    <PaginationListItem v-if="page === 'ellipsis'">
                        <PaginationEllipsis />
                    </PaginationListItem>
                    <PaginationListItem v-else>
                        <Button
                            variant="ghost"
                            size="icon"
                            :class="{
                                'bg-primary text-primary-foreground':
                                    currentPage === page,
                            }"
                            @click="handlePageChange(page)"
                        >
                            {{ page }}
                        </Button>
                    </PaginationListItem>
                </template>

                <PaginationListItem>
                    <PaginationNext
                        class="cursor-pointer"
                        :class="{
                            'opacity-50 cursor-not-allowed':
                                currentPage === totalPages,
                        }"
                        :disabled="currentPage === totalPages"
                        @click="
                            currentPage !== totalPages &&
                            handlePageChange(currentPage + 1)
                        "
                    />
                </PaginationListItem>
            </PaginationList>
        </Pagination>
    </div>
</template>
