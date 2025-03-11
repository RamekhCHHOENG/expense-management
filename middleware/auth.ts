import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore();

    // Skip middleware if going to error page
    if (to.name === "error") {
        return;
    }

    // Wait for auth state to be initialized
    if (!authStore.initialized || authStore.loading) {
        try {
            await authStore.init();
        } catch (error) {
            console.error("Auth initialization error:", error);
            // Only redirect to login if not already on login page
            if (to.path !== "/login") {
                return navigateTo("/login");
            }
            return;
        }
    }

    // Get the auth requirement from the route meta
    const requiresAuth = !to.meta.guest;

    // If route requires authentication and user is not authenticated
    if (requiresAuth && !authStore.isAuthenticated) {
        // Only redirect to login if not already on login page
        if (to.path !== "/login") {
            return navigateTo("/login");
        }
        return;
    }

    // If route is for guests only (like login) and user is authenticated
    if (!requiresAuth && authStore.isAuthenticated) {
        // Only redirect to dashboard if not already on dashboard
        if (to.path !== "/dashboard") {
            return navigateTo("/dashboard");
        }
        return;
    }
});
