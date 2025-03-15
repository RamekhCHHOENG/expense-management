<script setup lang="ts">
import NavProjects from "@/components/NavProjects.vue";
import NavUser from "@/components/NavUser.vue";
import TeamSwitcher from "@/components/TeamSwitcher.vue";
import type { SidebarProps } from "@/components/ui/sidebar";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar";

import {
    AudioWaveform,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
} from "lucide-vue-next";

const props = withDefaults(defineProps<SidebarProps>(), {
    collapsible: "icon",
});

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Personal Expenses",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Ramekh Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    projects: [
        {
            name: "Dashboard",
            url: "dashboard",
            icon: Frame,
        },
        {
            name: "Expenses",
            url: "expenses",
            icon: PieChart,
        },
        {
            name: "Rental House Expense",
            url: "rental-expenses",
            icon: PieChart,
        },
        {
            name: "Additional Expense Types",
            url: "additional-expense-types",
            icon: PieChart,
        },
        {
            name: "Analytics",
            url: "analytics",
            icon: Map,
        },
        {
            name: "Users",
            url: "users",
            icon: Map,
        },
    ],
};
</script>

<template>
    <Sidebar v-bind="props">
        <SidebarHeader>
            <TeamSwitcher :teams="data.teams" />
        </SidebarHeader>
        <SidebarContent>
            <!-- <NavMain :items="data.navMain" /> -->
            <NavProjects :projects="data.projects" />
        </SidebarContent>
        <SidebarFooter>
            <NavUser :user="data.user" />
        </SidebarFooter>
        <SidebarRail />
    </Sidebar>
</template>
