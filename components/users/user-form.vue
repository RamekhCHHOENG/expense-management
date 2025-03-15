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
    username: string;
    email: string;
    password: string;
    preferences: {
        theme: "light" | "dark";
        currency: string;
        language: string;
    };
}

interface UserFormSubmitData {
    username: string;
    displayName: string;
    email?: string;
    password?: string;
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
    (e: "submit", form: UserFormSubmitData): void;
    (e: "cancel"): void;
}>();

const form = reactive<UserForm>({
    name: "",
    username: "",
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
            // Ensure we have valid data by providing defaults
            const preferences = user.preferences || {};
            form.name = user.displayName || "";
            form.username = user.username || "";
            form.email = user.email || "";
            form.password = ""; // Don't populate password for security
            form.preferences = {
                theme: (preferences.theme as "light" | "dark") || "light",
                currency: preferences.currency || "USD",
                language: preferences.language || "en",
            };
        } else {
            // Reset form when not editing
            form.name = "";
            form.username = "";
            form.email = "";
            form.password = "";
            form.preferences = {
                theme: "light",
                currency: "USD",
                language: "en",
            };
        }
    },
    { immediate: true }
);

const handleSubmit = () => {
    // Ensure we have valid data by providing defaults
    const formData: UserFormSubmitData = {
        username: form.username.trim() || "",
        displayName: form.name.trim() || "",
        preferences: {
            theme: form.preferences?.theme || "light",
            currency: form.preferences?.currency || "USD",
            language: form.preferences?.language || "en",
        },
    };

    // Only include password and email for new users
    if (!props.editingUser) {
        formData.email = form.email.trim();
        formData.password = form.password;
    }

    emit("submit", formData);
};
</script>

<template>
    <DialogContent class="!max-w-lg">
        <DialogHeader>
            <DialogTitle>{{
                editingUser ? "Edit User" : "Add User"
            }}</DialogTitle>
            <DialogDescription>
                {{ editingUser ? "Edit user details" : "Add a new user" }}
            </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid gap-4">
                <div class="grid gap-2">
                    <Label for="name">Name</Label>
                    <Input
                        id="name"
                        v-model="form.name"
                        placeholder="Enter name"
                        :disabled="loading"
                    />
                </div>
                <div class="grid gap-2">
                    <Label for="username">Username</Label>
                    <Input
                        id="username"
                        v-model="form.username"
                        placeholder="Enter username"
                        :disabled="loading"
                        title="Username can only contain letters, numbers, underscores, and hyphens"
                        required
                    />
                </div>
                <div class="grid gap-2">
                    <Label for="email">Email</Label>
                    <Input
                        id="email"
                        v-model="form.email"
                        type="email"
                        placeholder="Enter email"
                        :disabled="loading"
                    />
                </div>
                <div class="grid gap-2">
                    <Label for="password">Password</Label>
                    <Input
                        id="password"
                        v-model="form.password"
                        type="password"
                        placeholder="Enter password"
                        :disabled="loading"
                    />
                </div>
                <div class="grid gap-2">
                    <Label for="theme">Theme</Label>
                    <Select
                        v-model="form.preferences.theme"
                        :disabled="loading"
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div class="grid gap-2">
                    <Label for="currency">Currency</Label>
                    <Input
                        id="currency"
                        v-model="form.preferences.currency"
                        placeholder="Enter currency"
                        :disabled="loading"
                    />
                </div>
                <div class="grid gap-2">
                    <Label for="language">Language</Label>
                    <Input
                        id="language"
                        v-model="form.preferences.language"
                        placeholder="Enter language"
                        :disabled="loading"
                    />
                </div>
            </div>
            <DialogFooter>
                <Button
                    type="button"
                    variant="outline"
                    :disabled="loading"
                    @click="emit('cancel')"
                >
                    Cancel
                </Button>
                <Button type="submit" :loading="loading">
                    {{ editingUser ? "Save Changes" : "Add User" }}
                </Button>
            </DialogFooter>
        </form>
    </DialogContent>
</template>
