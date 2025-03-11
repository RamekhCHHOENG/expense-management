<!-- layouts/default.vue -->
<script setup lang="ts">
import {
    Bell,
    ChevronDown,
    Frame,
    Globe2,
    LogOut,
    Map,
    Moon,
    PieChart,
    Settings,
    Sun,
    User,
} from "lucide-vue-next";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "~/components/ui/sidebar";
import { useAuthStore } from "~/stores/auth";
import { useProfileStore } from "~/stores/profile";
import { useThemeStore } from "~/stores/theme";

const authStore = useAuthStore();
const profileStore = useProfileStore();
const themeStore = useThemeStore();
const router = useRouter();
const loading = ref(false);
const showLogoutConfirm = ref(false);

// Get current user from auth store
const user = computed(() => authStore.user);

// Available languages
const languages = [
    { label: "English", value: "en" },
    { label: "Khmer", value: "km" },
    { label: "French", value: "fr" },
];

// Current language
const currentLanguage = ref(
    profileStore.profile?.preferences?.language || "en"
);

// Notifications (sample data - replace with real notifications)
const notifications = ref([
    { id: 1, title: "New expense added", read: false },
    { id: 2, title: "Budget limit reached", read: false },
    { id: 3, title: "Monthly report ready", read: true },
]);

const unreadNotifications = computed(
    () => notifications.value.filter((n) => !n.read).length
);

const handleProfile = () => {
    router.push("/users/profile");
};

const handleSettings = () => {
    router.push("/settings");
};

const handleLanguageChange = async (lang: string) => {
    currentLanguage.value = lang;
    if (profileStore.profile) {
        await profileStore.updatePreferences({
            language: lang,
        });
    }
};

const handleNotificationClick = (id: number) => {
    const notification = notifications.value.find((n) => n.id === id);
    if (notification) {
        notification.read = true;
    }
};

const handleLogout = async () => {
    try {
        loading.value = true;
        await authStore.signOut();
        router.push("/login");
    } catch (error: any) {
        console.error("Logout failed:", error);
    } finally {
        loading.value = false;
        showLogoutConfirm.value = false;
    }
};

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
};

// Fetch profile if authenticated
onMounted(async () => {
    if (authStore.isAuthenticated && !profileStore.profile) {
        await profileStore.fetchProfile();
    }
});
</script>

<script lang="ts">
export const description = "A sidebar that collapses to icons.";
export const iframeHeight = "800px";
export const containerClass = "w-full h-full";
</script>

<template>
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
            <header
                class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
            >
                <div
                    class="flex items-center justify-between gap-2 px-4 w-full"
                >
                    <div class="flex items-center gap-2">
                        <SidebarTrigger class="-ml-1" />
                        <Separator orientation="vertical" class="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem class="hidden md:block">
                                    <BreadcrumbLink href="/">
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div class="flex items-center gap-4">
                        <!-- Language Selector -->
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    class="gap-1"
                                >
                                    <Globe2 class="h-5 w-5" />
                                    <ChevronDown class="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" class="w-48">
                                <DropdownMenuRadioGroup
                                    :value="currentLanguage"
                                    @update:value="handleLanguageChange"
                                >
                                    <DropdownMenuRadioItem
                                        v-for="lang in languages"
                                        :key="lang.value"
                                        :value="lang.value"
                                    >
                                        {{ lang.label }}
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <!-- Notifications -->
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    class="relative"
                                >
                                    <Bell class="h-5 w-5" />
                                    <span
                                        v-if="unreadNotifications"
                                        class="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center"
                                    >
                                        {{ unreadNotifications }}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" class="w-80">
                                <DropdownMenuLabel
                                    >Notifications</DropdownMenuLabel
                                >
                                <DropdownMenuSeparator />
                                <div class="max-h-[300px] overflow-auto">
                                    <DropdownMenuItem
                                        v-for="notification in notifications"
                                        :key="notification.id"
                                        @click="
                                            handleNotificationClick(
                                                notification.id
                                            )
                                        "
                                        :class="{
                                            'opacity-50': notification.read,
                                        }"
                                    >
                                        <div class="flex flex-col gap-1">
                                            <p class="text-sm">
                                                {{ notification.title }}
                                            </p>
                                            <p
                                                class="text-xs text-muted-foreground"
                                            >
                                                {{
                                                    notification.read
                                                        ? "Read"
                                                        : "Unread"
                                                }}
                                            </p>
                                        </div>
                                    </DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <!-- Theme toggle -->
                        <Button
                            variant="ghost"
                            size="icon"
                            @click="themeStore.toggleTheme()"
                        >
                            <Sun v-if="themeStore.isDark" class="h-5 w-5" />
                            <Moon v-else class="h-5 w-5" />
                        </Button>

                        <!-- User dropdown with logout -->
                        <DropdownMenu v-if="authStore.isAuthenticated">
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    class="relative h-8 w-8 rounded-full"
                                >
                                    <div
                                        v-if="profileStore.profile?.photoURL"
                                        class="h-8 w-8 rounded-full overflow-hidden"
                                    >
                                        <img
                                            :src="profileStore.profile.photoURL"
                                            alt="Profile"
                                            class="h-full w-full object-cover"
                                        />
                                    </div>
                                    <User v-else class="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" class="w-56">
                                <DropdownMenuLabel>
                                    <div class="flex flex-col space-y-1">
                                        <p
                                            class="text-sm font-medium leading-none"
                                        >
                                            {{
                                                profileStore.profile
                                                    ?.displayName || "User"
                                            }}
                                        </p>
                                        <p
                                            class="text-xs leading-none text-muted-foreground"
                                        >
                                            {{ profileStore.profile?.email }}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem @click="handleProfile">
                                    <Settings class="mr-2 h-4 w-4" />
                                    <span>Profile Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="handleLogout">
                                    <LogOut class="mr-2 h-4 w-4" />
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
            <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
                <!-- <div class="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div class="aspect-video rounded-xl bg-muted/50" />
                    <div class="aspect-video rounded-xl bg-muted/50" />
                    <div class="aspect-video rounded-xl bg-muted/50" />
                </div>
                <div
                    class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"
                /> -->
                <slot />
            </div>
        </SidebarInset>
    </SidebarProvider>
</template>
