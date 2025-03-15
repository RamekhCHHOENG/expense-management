<script setup lang="ts">
import { UserPlus } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import { useToast } from "~/components/ui/toast/use-toast";
import UserDelete from "~/components/users/user-delete.vue";
import UserForm from "~/components/users/user-form.vue";
import UserList from "~/components/users/user-list.vue";
import UserView from "~/components/users/user-view.vue";
import type { UserProfile } from "~/services/user";
import { useUserService } from "~/services/user";
import { useAuthStore } from "~/stores/auth";

const { toast } = useToast();
const authStore = useAuthStore();
const userService = useUserService();

const loading = ref(true);
const users = ref<UserProfile[]>([]);
const showCreateDialog = ref(false);
const showViewDialog = ref(false);
const showDeleteDialog = ref(false);
const editingUser = ref<UserProfile | null>(null);
const selectedUser = ref<UserProfile | null>(null);
const itemsPerPage = ref(10);
const currentPage = ref(1);

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

const handleSubmit = async (form: any) => {
    if (loading.value) return;

    loading.value = true;
    try {
        if (editingUser.value) {
            // Update existing user
            await userService.updateUser(editingUser.value.uid, {
                displayName: form.displayName || "",
                username: form.username || "",
                preferences: {
                    theme: form.preferences?.theme || "light",
                    currency: form.preferences?.currency || "USD",
                    language: form.preferences?.language || "en",
                },
            });
            toast({
                title: "Success",
                description: "User updated successfully",
            });
        } else {
            // Create new user with Firebase Auth and Firestore
            const user = await authStore.signUp(
                form.email!,
                form.password!,
                form.displayName || ""
            );
            if (user) {
                // Create user profile with username and preferences
                await userService.createUser(user, {
                    username: form.username,
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
        editingUser.value = null;
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

const handleDelete = async () => {
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

const handlePageChange = (page: number) => {
    currentPage.value = page;
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

        <UserList
            :users="users"
            :loading="loading"
            :items-per-page="itemsPerPage"
            @page="handlePageChange"
            @view="
                (user: UserProfile) => {
                    selectedUser = user;
                    showViewDialog = true;
                }
            "
            @edit="
                (user: UserProfile) => {
                    editingUser = user;
                    showCreateDialog = true;
                }
            "
            @delete="
                (user: UserProfile) => {
                    selectedUser = user;
                    showDeleteDialog = true;
                }
            "
        />

        <!-- Create/Edit User Dialog -->
        <Dialog v-model:open="showCreateDialog">
            <UserForm
                :loading="loading"
                :editing-user="editingUser"
                @submit="handleSubmit"
                @cancel="showCreateDialog = false"
            />
        </Dialog>

        <!-- View User Dialog -->
        <Dialog v-model:open="showViewDialog">
            <UserView
                v-if="selectedUser"
                :user="selectedUser"
                @close="showViewDialog = false"
            />
        </Dialog>

        <!-- Delete Confirmation Dialog -->
        <Dialog v-model:open="showDeleteDialog">
            <UserDelete
                v-if="selectedUser"
                :user="selectedUser"
                :loading="loading"
                @confirm="handleDelete"
                @cancel="showDeleteDialog = false"
            />
        </Dialog>
    </div>
</template>
