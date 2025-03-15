<script setup lang="ts">
import { Eye, Loader2, Pencil, Search, Trash } from "lucide-vue-next";
import { computed, ref, watch } from "vue";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
    Pagination,
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
            user.username.toLowerCase().includes(searchLower) ||
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
    <div class="space-y-4">
        <!-- Search and Filter -->
        <div class="flex items-center gap-2 pt-6">
            <div class="relative flex-1">
                <Search
                    class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
                />
                <Input
                    v-model="search"
                    class="pl-8"
                    placeholder="Search users..."
                />
            </div>
        </div>

        <!-- Users Table -->
        <div class="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-if="loading" class="hover:bg-transparent">
                        <TableCell colspan="5" class="h-24 text-center">
                            <Loader2 class="mx-auto h-6 w-6 animate-spin" />
                        </TableCell>
                    </TableRow>
                    <TableRow
                        v-else-if="!paginatedUsers.length"
                        class="hover:bg-transparent"
                    >
                        <TableCell colspan="5" class="h-24 text-center">
                            No users found.
                        </TableCell>
                    </TableRow>
                    <TableRow v-for="user in paginatedUsers" :key="user.uid">
                        <TableCell>
                            <div class="flex items-center gap-2">
                                <Avatar>
                                    <AvatarImage
                                        v-if="user.photoURL"
                                        :src="user.photoURL"
                                        :alt="user.displayName || ''"
                                    />
                                    <AvatarFallback>{{
                                        getInitials(user.displayName)
                                    }}</AvatarFallback>
                                </Avatar>
                                <span>{{ user.displayName || "No name" }}</span>
                            </div>
                        </TableCell>
                        <TableCell>{{ user.username }}</TableCell>
                        <TableCell>{{ user.email }}</TableCell>
                        <TableCell>{{
                            new Date(user.createdAt).toLocaleDateString()
                        }}</TableCell>
                        <TableCell>
                            <div class="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    @click="$emit('view', user)"
                                >
                                    <Eye class="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    @click="$emit('edit', user)"
                                >
                                    <Pencil class="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    @click="$emit('delete', user)"
                                >
                                    <Trash class="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center">
            <Pagination
                :page="currentPage"
                :items-per-page="itemsPerPage"
                :total="filteredUsers.length"
            >
                <PaginationPrev
                    :disabled="currentPage === 1"
                    @click="handlePageChange(currentPage - 1)"
                />
                <PaginationList>
                    <PaginationListItem
                        v-for="page in totalPages"
                        :key="page"
                        :value="page"
                        :active="page === currentPage"
                        @click="handlePageChange(page)"
                    >
                        {{ page }}
                    </PaginationListItem>
                </PaginationList>
                <PaginationNext
                    :disabled="currentPage === totalPages"
                    @click="handlePageChange(currentPage + 1)"
                />
            </Pagination>
        </div>
    </div>
</template>
