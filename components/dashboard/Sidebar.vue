<template>
    <div class="flex h-screen">
        <!-- Sidebar -->
        <div class="hidden md:flex md:w-64 md:flex-col">
            <div class="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r">
                <div class="flex items-center flex-shrink-0 px-4">
                    <h1 class="text-xl font-bold text-gray-900">Expense Manager</h1>
                </div>
                <div class="mt-5 flex-grow flex flex-col">
                    <nav class="flex-1 px-2 pb-4 space-y-1">
                        <NuxtLink
                            v-for="item in navigation"
                            :key="item.name"
                            :to="item.href"
                            :class="[
                                isActive(item.href)
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                            ]"
                        >
                            <component
                                :is="item.icon"
                                :class="[
                                    isActive(item.href)
                                        ? 'text-gray-500'
                                        : 'text-gray-400 group-hover:text-gray-500',
                                    'mr-3 flex-shrink-0 h-6 w-6'
                                ]"
                                aria-hidden="true"
                            />
                            {{ item.name }}
                        </NuxtLink>
                    </nav>
                </div>
                <!-- User Profile Section -->
                <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
                    <div class="flex items-center w-full">
                        <div class="flex-shrink-0">
                            <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                <span class="text-sm font-medium text-gray-700">
                                    {{ userInitials }}
                                </span>
                            </div>
                        </div>
                        <div class="ml-3 flex-1">
                            <p class="text-sm font-medium text-gray-700 truncate">
                                {{ userEmail }}
                            </p>
                        </div>
                        <button
                            @click="authStore.signOut"
                            class="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                        >
                            <LogoutIcon class="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden fixed bottom-4 right-4 z-50">
            <button
                @click="isMobileMenuOpen = !isMobileMenuOpen"
                class="bg-white p-2 rounded-full shadow-lg"
            >
                <MenuIcon v-if="!isMobileMenuOpen" class="h-6 w-6 text-gray-600" />
                <XIcon v-else class="h-6 w-6 text-gray-600" />
            </button>
        </div>

        <!-- Mobile menu -->
        <div
            v-if="isMobileMenuOpen"
            class="md:hidden fixed inset-0 z-40 flex"
            @click.self="isMobileMenuOpen = false"
        >
            <div class="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                    <div class="flex-shrink-0 flex items-center px-4">
                        <h1 class="text-xl font-bold text-gray-900">Expense Manager</h1>
                    </div>
                    <nav class="mt-5 px-2 space-y-1">
                        <NuxtLink
                            v-for="item in navigation"
                            :key="item.name"
                            :to="item.href"
                            :class="[
                                isActive(item.href)
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                            ]"
                            @click="isMobileMenuOpen = false"
                        >
                            <component
                                :is="item.icon"
                                :class="[
                                    isActive(item.href)
                                        ? 'text-gray-500'
                                        : 'text-gray-400 group-hover:text-gray-500',
                                    'mr-4 flex-shrink-0 h-6 w-6'
                                ]"
                                aria-hidden="true"
                            />
                            {{ item.name }}
                        </NuxtLink>
                    </nav>
                </div>
            </div>
        </div>

        <!-- Main content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    ChartPieIcon,
    Cog6ToothIcon as CogIcon,
    CreditCardIcon,
    DocumentChartBarIcon as DocumentReportIcon,
    HomeIcon,
    ArrowRightOnRectangleIcon as LogoutIcon,
    Bars3Icon as MenuIcon,
    XMarkIcon as XIcon,
} from '@heroicons/vue/24/outline';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const route = useRoute();
const isMobileMenuOpen = ref(false);

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Transactions', href: '/transactions', icon: CreditCardIcon },
    { name: 'Categories', href: '/categories', icon: ChartPieIcon },
    { name: 'Analytics', href: '/analytics', icon: DocumentReportIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
];

const isActive = (path: string) => {
    return route.path === path;
};  

// Get user email from auth store
const userEmail = computed(() => authStore.user?.email || 'User');

// Generate user initials from email
const userInitials = computed(() => {
    const email = userEmail.value;
    if (email === 'User') return 'U';
    return email
        .split('@')[0]
        .split('.')
        .map(part => part[0]?.toUpperCase())
        .join('');
});
</script> 