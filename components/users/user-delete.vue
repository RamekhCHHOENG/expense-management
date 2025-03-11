<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import type { UserProfile } from "~/services/user";

const props = defineProps<{
    user: UserProfile;
    loading: boolean;
}>();

const emit = defineEmits<{
    (e: "confirm"): void;
    (e: "cancel"): void;
}>();

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
</script>

<template>
    <DialogContent class="sm:max-w-[500px]">
        <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
                Are you sure you want to delete this user? This action cannot be
                undone.
            </DialogDescription>
        </DialogHeader>

        <!-- User Information -->
        <div class="py-4 space-y-4">
            <div class="flex items-center gap-4">
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
                <div>
                    <h3 class="font-medium">
                        {{ user.displayName || "No Name" }}
                    </h3>
                    <p class="text-sm text-muted-foreground">
                        {{ user.email }}
                    </p>
                </div>
            </div>

            <div class="space-y-2">
                <div class="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <p class="text-muted-foreground">Created</p>
                        <p>{{ formatDate(user.createdAt) }}</p>
                    </div>
                    <div>
                        <p class="text-muted-foreground">Last Updated</p>
                        <p>{{ formatDate(user.updatedAt) }}</p>
                    </div>
                </div>
            </div>

            <div class="rounded-md bg-destructive/10 p-4 text-destructive">
                <p class="text-sm font-medium">Warning</p>
                <p class="text-sm mt-1">
                    This will permanently delete the user's account and remove
                    all their data from our servers.
                </p>
            </div>
        </div>

        <DialogFooter>
            <Button variant="outline" @click="emit('cancel')">Cancel</Button>
            <Button
                variant="destructive"
                @click="emit('confirm')"
                :disabled="loading"
            >
                Delete User
            </Button>
        </DialogFooter>
    </DialogContent>
</template>
