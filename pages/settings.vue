<template>
    <DashboardLayout>
        <div class="space-y-6">
            <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto">
                    <h1 class="text-xl font-semibold text-gray-900">Settings</h1>
                    <p class="mt-2 text-sm text-gray-700">
                        Manage your account and application preferences.
                    </p>
                </div>
            </div>

            <div class="space-y-6">
                <!-- Profile Settings -->
                <div class="bg-white shadow rounded-lg">
                    <div class="p-6">
                        <h2 class="text-lg font-medium text-gray-900 mb-4">Profile Settings</h2>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Email</label>
                                <div class="mt-1 flex items-center">
                                    <span class="block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 sm:text-sm">
                                        {{ userEmail }}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Display Name</label>
                                <div class="mt-1">
                                    <input
                                        type="text"
                                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Enter your display name"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Preferences -->
                <div class="bg-white shadow rounded-lg">
                    <div class="p-6">
                        <h2 class="text-lg font-medium text-gray-900 mb-4">Preferences</h2>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Currency</label>
                                <div class="mt-1">
                                    <select class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Date Format</label>
                                <div class="mt-1">
                                    <select class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Danger Zone -->
                <div class="bg-white shadow rounded-lg">
                    <div class="p-6">
                        <h2 class="text-lg font-medium text-red-600 mb-4">Danger Zone</h2>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-sm font-medium text-gray-900">Delete Account</h3>
                                    <p class="text-sm text-gray-500">
                                        Permanently delete your account and all associated data.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

definePageMeta({
    middleware: ['auth']
});

const authStore = useAuthStore();
const userEmail = computed(() => authStore.user?.email || '');
</script> 