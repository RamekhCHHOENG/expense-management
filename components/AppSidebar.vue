<script setup lang="ts">
import type { SidebarProps } from "@/components/ui/sidebar";

import NavProjects from "@/components/NavProjects.vue";
import NavUser from "@/components/NavUser.vue";
import TeamSwitcher from "@/components/TeamSwitcher.vue";
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
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    // navMain: [
    //     {
    //         title: "Playground",
    //         url: "#",
    //         icon: SquareTerminal,
    //         isActive: true,
    //         items: [
    //             {
    //                 title: "History",
    //                 url: "#",
    //             },
    //             {
    //                 title: "Starred",
    //                 url: "#",
    //             },
    //             {
    //                 title: "Settings",
    //                 url: "#",
    //             },
    //         ],
    //     },
    //     {
    //         title: "Models",
    //         url: "#",
    //         icon: Bot,
    //         items: [
    //             {
    //                 title: "Genesis",
    //                 url: "#",
    //             },
    //             {
    //                 title: "Explorer",
    //                 url: "#",
    //             },
    //             {
    //                 title: "Quantum",
    //                 url: "#",
    //             },
    //         ],
    //     },
    //     {
    //         title: "Documentation",
    //         url: "#",
    //         icon: BookOpen,
    //         items: [
    //             {
    //                 title: "Introduction",
    //                 url: "#",
    //             },
    //             {
    //                 title: "Get Started",
    //                 url: "#",
    //             },
    //             {
    //                 title: "Tutorials",
    //                 url: "#",
    //             },
    //             {
    //                 title: "Changelog",
    //                 url: "#",
    //             },
    //         ],
    //     },
    //     {
    //         title: "Settings",
    //         url: "#",
    //         icon: Settings2,
    //         items: [
    //             {
    //                 title: "General",
    //                 url: "#",
    //             },
    //             {
    //                 title: "Team",
    //                 url: "#",
    //             },
    //             {
    //                 title: "Billing",
    //                 url: "#",
    //             },
    //             {
    //                 title: "Limits",
    //                 url: "#",
    //             },
    //         ],
    //     },
    // ],
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
