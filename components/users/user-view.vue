<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import type { UserProfile } from "~/services/user";

const props = defineProps<{
    user: UserProfile;
}>();

const emit = defineEmits<{
    (e: "close"): void;
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
            <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
            <div class="flex items-center gap-4">
                <Avatar class="w-16 h-16">
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
                    <h3 class="font-medium text-lg">
                        {{ user.displayName || "No Name" }}
                    </h3>
                    <p class="text-muted-foreground">
                        {{ user.email }}
                    </p>
                </div>
            </div>
            <div class="space-y-2">
                <h4 class="font-medium">Preferences</h4>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <p class="text-sm text-muted-foreground">Theme</p>
                        <p>{{ user.preferences.theme }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-muted-foreground">Currency</p>
                        <p>{{ user.preferences.currency }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-muted-foreground">Language</p>
                        <p>{{ user.preferences.language }}</p>
                    </div>
                </div>
            </div>
            <div class="space-y-2">
                <h4 class="font-medium">Account Info</h4>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <p class="text-sm text-muted-foreground">Created</p>
                        <p>{{ formatDate(user.createdAt) }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-muted-foreground">
                            Last Updated
                        </p>
                        <p>{{ formatDate(user.updatedAt) }}</p>
                    </div>
                </div>
            </div>
        </div>
        <DialogFooter>
            <Button @click="emit('close')">Close</Button>
        </DialogFooter>
    </DialogContent>
</template>
