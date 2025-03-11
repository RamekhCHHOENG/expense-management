<script setup lang="ts">
import {
    LayoutDashboard,
    LogOut,
    Menu,
    PieChart,
    Settings,
    Wallet,
} from "lucide-vue-next";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Button } from "~/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
    useSidebar,
} from "~/components/ui/sidebar";

const { state, toggleSidebar } = useSidebar();
const isCollapsed = computed(() => state.value === "collapsed");
const route = useRoute();

const navigationItems = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        to: "/dashboard",
    },
    {
        title: "Expenses",
        icon: Wallet,
        to: "/expenses",
    },
    {
        title: "Analytics",
        icon: PieChart,
        to: "/analytics",
    },
    {
        title: "Settings",
        icon: Settings,
        to: "/settings",
    },
];

const emit = defineEmits<{
    logout: [];
}>();

const isActive = (path: string) => {
    return route.path === path;
};
</script>

<template>
    <Sidebar>
        <SidebarHeader class="flex h-[60px] items-center justify-between px-6">
            <img v-if="!isCollapsed" src="/logo.svg" alt="Logo" class="h-6" />
            <Button variant="ghost" size="icon" @click="toggleSidebar">
                <Menu class="h-4 w-4" />
            </Button>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem
                            v-for="item in navigationItems"
                            :key="item.to"
                        >
                            <SidebarMenuButton
                                asChild
                                :active="isActive(item.to)"
                            >
                                <NuxtLink :to="item.to" class="w-full">
                                    <component
                                        :is="item.icon"
                                        class="mr-2 h-4 w-4"
                                    />
                                    <span>{{ item.title }}</span>
                                </NuxtLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter class="p-6">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Button
                            variant="ghost"
                            class="w-full justify-start"
                            size="sm"
                            @click="emit('logout')"
                        >
                            <LogOut class="mr-2 h-4 w-4" />
                            <span v-if="!isCollapsed">Logout</span>
                        </Button>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
</template>
