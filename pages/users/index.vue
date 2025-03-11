<script setup lang="ts">
import { Eye, Loader2, Pencil, Search, Trash, UserPlus } from "lucide-vue-next";
import { computed, onMounted, reactive, ref } from "vue";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
    Dialog,
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import { useToast } from "~/components/ui/toast/use-toast";
import type { UserProfile } from "~/services/user";
import { useUserService } from "~/services/user";
import { useAuthStore } from "~/stores/auth";

const { toast } = useToast();
const authStore = useAuthStore();
const userService = useUserService();

const loading = ref(true);
const users = ref<UserProfile[]>([]);
const error = ref<string | null>(null);
const search = ref("");
const showCreateDialog = ref(false);
const showViewDialog = ref(false);
const showDeleteDialog = ref(false);
const editingUser = ref<UserProfile | null>(null);
const selectedUser = ref<UserProfile | null>(null);

const form = reactive({
    name: "",
    email: "",
    password: "",
    preferences: {
        theme: "light" as "light" | "dark",
        currency: "USD",
        language: "en",
    },
});

const fetchUsers = async () => {
    loading.value = true;
    try {
        users.value = await userService.getAllUsers();
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
        });
    } finally {
        loading.value = false;
    }
};

// Fetch users when component mounts
onMounted(() => {
    if (authStore.isAuthenticated) {
        fetchUsers();
    }
});

const formatDate = (date: any) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
};

// Computed
const filteredUsers = computed(() => {
    if (!search.value) return users.value;
    const searchLower = search.value.toLowerCase();
    return users.value.filter(
        (user) =>
            user.displayName?.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower)
    );
});

// Methods
const resetForm = () => {
    form.name = "";
    form.email = "";
    form.password = "";
    form.preferences = {
        theme: "light",
        currency: "USD",
        language: "en",
    };
    editingUser.value = null;
    selectedUser.value = null;
};

const handleSubmit = async () => {
    if (loading.value) return;

    loading.value = true;
    try {
        if (editingUser.value) {
            // Update existing user
            await userService.updateUser(editingUser.value.uid, {
                displayName: form.name,
                preferences: form.preferences,
            });
            toast({
                title: "Success",
                description: "User updated successfully",
            });
        } else {
            // Create new user with Firebase Auth and Firestore
            const user = await authStore.signUp(
                form.email,
                form.password,
                form.name
            );
            if (user) {
                // Create user profile with preferences
                await userService.createUser(user, {
                    preferences: form.preferences,
                });
                toast({
                    title: "Success",
                    description: "User created successfully",
                });
            }
        }
        // Reset form and close dialog
        showCreateDialog.value = false;
        resetForm();
        await fetchUsers();
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
        });
    } finally {
        loading.value = false;
    }
};

const viewUser = (user: UserProfile) => {
    selectedUser.value = user;
    showViewDialog.value = true;
};

const editUser = (user: UserProfile) => {
    editingUser.value = user;
    form.name = user.displayName || "";
    form.email = user.email;
    form.preferences = { ...user.preferences };
    showCreateDialog.value = true;
};

const confirmDelete = (user: UserProfile) => {
    selectedUser.value = user;
    showDeleteDialog.value = true;
};

const deleteUser = async () => {
    if (!selectedUser.value || loading.value) return;

    loading.value = true;
    try {
        // Delete user from Firestore first
        await userService.deleteUser(selectedUser.value.uid);

        // Delete user from Firebase Auth
        if (authStore.authInstance) {
            const user = authStore.authInstance.currentUser;
            if (user && user.uid === selectedUser.value.uid) {
                await user.delete();
            }
        }

        toast({
            title: "Success",
            description: "User deleted successfully",
        });
        showDeleteDialog.value = false;
        selectedUser.value = null;
        await fetchUsers();
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
        });
    } finally {
        loading.value = false;
    }
};

const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};
</script>

<template>
    <div class="container py-6 space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-3xl font-bold tracking-tight">Users</h2>
                <p class="text-muted-foreground">
                    Manage your application users here.
                </p>
            </div>
            <Button @click="showCreateDialog = true">
                <UserPlus class="w-4 h-4 mr-2" />
                Add User
            </Button>
        </div>

        <!-- Search and Filter -->
        <div class="flex items-center gap-4">
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

        <!-- Users Table -->
        <div class="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead class="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="user in filteredUsers" :key="user.uid">
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
                                    <p class="font-medium">
                                        {{ user.displayName || "No Name" }}
                                    </p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>{{ user.email }}</TableCell>
                        <TableCell>{{ formatDate(user.createdAt) }}</TableCell>
                        <TableCell>{{ formatDate(user.updatedAt) }}</TableCell>
                        <TableCell>
                            <div class="flex justify-end gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    @click="viewUser(user)"
                                >
                                    <Eye class="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    @click="editUser(user)"
                                >
                                    <Pencil class="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    @click="confirmDelete(user)"
                                >
                                    <Trash class="w-4 h-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                    <TableRow v-if="loading">
                        <TableCell colspan="5" class="text-center py-8">
                            <Loader2 class="w-6 h-6 animate-spin mx-auto" />
                        </TableCell>
                    </TableRow>
                    <TableRow v-else-if="!filteredUsers.length">
                        <TableCell
                            colspan="5"
                            class="text-center py-8 text-muted-foreground"
                        >
                            No users found.
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

        <!-- Create/Edit User Dialog -->
        <Dialog v-model:open="showCreateDialog">
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
                                            <SelectValue
                                                placeholder="Select theme"
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light"
                                                >Light</SelectItem
                                            >
                                            <SelectItem value="dark"
                                                >Dark</SelectItem
                                            >
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
                        <Button
                            type="button"
                            variant="outline"
                            @click="showCreateDialog = false"
                            >Cancel</Button
                        >
                        <Button type="submit" :disabled="loading">
                            {{ editingUser ? "Update" : "Create" }}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        <!-- View User Dialog -->
        <Dialog v-model:open="showViewDialog">
            <DialogContent class="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                </DialogHeader>
                <div v-if="selectedUser" class="space-y-4">
                    <div class="flex items-center gap-4">
                        <Avatar class="w-16 h-16">
                            <AvatarImage
                                v-if="selectedUser.photoURL"
                                :src="selectedUser.photoURL"
                                :alt="selectedUser.displayName || ''"
                            />
                            <AvatarFallback>{{
                                getInitials(selectedUser.displayName)
                            }}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 class="font-medium text-lg">
                                {{ selectedUser.displayName || "No Name" }}
                            </h3>
                            <p class="text-muted-foreground">
                                {{ selectedUser.email }}
                            </p>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <h4 class="font-medium">Preferences</h4>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <p class="text-sm text-muted-foreground">
                                    Theme
                                </p>
                                <p>{{ selectedUser.preferences.theme }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-muted-foreground">
                                    Currency
                                </p>
                                <p>{{ selectedUser.preferences.currency }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-muted-foreground">
                                    Language
                                </p>
                                <p>{{ selectedUser.preferences.language }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <h4 class="font-medium">Account Info</h4>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <p class="text-sm text-muted-foreground">
                                    Created
                                </p>
                                <p>{{ formatDate(selectedUser.createdAt) }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-muted-foreground">
                                    Last Updated
                                </p>
                                <p>{{ formatDate(selectedUser.updatedAt) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button @click="showViewDialog = false">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <!-- Delete Confirmation Dialog -->
        <Dialog v-model:open="showDeleteDialog">
            <DialogContent class="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this user? This action
                        cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <!-- User Information -->
                <div v-if="selectedUser" class="py-4 space-y-4">
                    <div class="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage
                                v-if="selectedUser.photoURL"
                                :src="selectedUser.photoURL"
                                :alt="selectedUser.displayName || ''"
                            />
                            <AvatarFallback>{{
                                getInitials(selectedUser.displayName)
                            }}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 class="font-medium">
                                {{ selectedUser.displayName || "No Name" }}
                            </h3>
                            <p class="text-sm text-muted-foreground">
                                {{ selectedUser.email }}
                            </p>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <p class="text-muted-foreground">Created</p>
                                <p>
                                    {{ formatDate(selectedUser.createdAt) }}
                                </p>
                            </div>
                            <div>
                                <p class="text-muted-foreground">
                                    Last Updated
                                </p>
                                <p>
                                    {{ formatDate(selectedUser.updatedAt) }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        class="rounded-md bg-destructive/10 p-4 text-destructive"
                    >
                        <p class="text-sm font-medium">Warning</p>
                        <p class="text-sm mt-1">
                            This will permanently delete the user's account and
                            remove all their data from our servers.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" @click="showDeleteDialog = false">
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        @click="deleteUser"
                        :disabled="loading"
                    >
                        Delete User
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>
