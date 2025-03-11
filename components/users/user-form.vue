<script setup lang="ts">
import { reactive, watch } from "vue";
import { Button } from "~/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import type { UserProfile } from "~/services/user";

interface UserForm {
    name: string;
    email: string;
    password: string;
    preferences: {
        theme: "light" | "dark";
        currency: string;
        language: string;
    };
}

const props = defineProps<{
    loading: boolean;
    editingUser: UserProfile | null;
}>();

const emit = defineEmits<{
    (e: "submit", form: UserForm): void;
    (e: "cancel"): void;
}>();

const form = reactive<UserForm>({
    name: "",
    email: "",
    password: "",
    preferences: {
        theme: "light",
        currency: "USD",
        language: "en",
    },
});

// Watch for changes in editingUser and update form data
watch(
    () => props.editingUser,
    (user) => {
        if (user) {
            form.name = user.displayName || "";
            form.email = user.email;
            form.preferences = {
                theme: (user.preferences?.theme || "light") as "light" | "dark",
                currency: user.preferences?.currency || "USD",
                language: user.preferences?.language || "en",
            };
        } else {
            // Reset form when not editing
            form.name = "";
            form.email = "";
            form.password = "";
            form.preferences = {
                theme: "light",
                currency: "USD",
                language: "en",
            };
        }
    },
    { immediate: true } // Run immediately to set initial values
);

const handleSubmit = () => {
    emit("submit", form);
};
</script>

<template>
    <DialogContent class="sm:max-w-[500px]">
        <DialogHeader>
            <DialogTitle>{{
                editingUser ? "Edit User" : "Create User"
            }}</DialogTitle>
            <DialogDescription>
                {{
                    editingUser
                        ? "Update user details"
                        : "Add a new user to the system"
                }}
            </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid gap-4">
                <div class="grid gap-2">
                    <Label for="name">Full Name</Label>
                    <Input id="name" v-model="form.name" required />
                </div>
                <div class="grid gap-2">
                    <Label for="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        v-model="form.email"
                        required
                        :disabled="!!editingUser"
                    />
                </div>
                <div v-if="!editingUser" class="grid gap-2">
                    <Label for="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        v-model="form.password"
                        required
                    />
                </div>
                <div class="grid gap-2">
                    <Label>Preferences</Label>
                    <div class="space-y-2">
                        <div class="flex items-center gap-2">
                            <Label for="theme">Theme</Label>
                            <Select v-model="form.preferences.theme">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div class="flex items-center gap-2">
                            <Label for="currency">Currency</Label>
                            <Input
                                id="currency"
                                v-model="form.preferences.currency"
                            />
                        </div>
                        <div class="flex items-center gap-2">
                            <Label for="language">Language</Label>
                            <Input
                                id="language"
                                v-model="form.preferences.language"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" @click="emit('cancel')">
                    Cancel
                </Button>
                <Button type="submit" :disabled="loading">
                    {{ editingUser ? "Update" : "Create" }}
                </Button>
            </DialogFooter>
        </form>
    </DialogContent>
</template>
