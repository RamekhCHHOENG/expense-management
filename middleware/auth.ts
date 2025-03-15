import { useAuthStore } from "~/stores/auth";

// List of public routes that don't require authentication
const publicRoutes = [
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/reset-password",
];

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
            // Only redirect to login if not on a public route
            if (!publicRoutes.includes(to.path)) {
                return navigateTo("/login");
            }
            return;
        }
    }

    // Check if the route is public
    const isPublicRoute = publicRoutes.includes(to.path);

    // If route requires authentication (not public) and user is not authenticated
    if (!isPublicRoute && !authStore.isAuthenticated) {
        return navigateTo("/login");
    }

    // If user is authenticated and trying to access auth pages (login, signup, etc.)
    if (authStore.isAuthenticated && isPublicRoute) {
        return navigateTo("/dashboard");
    }
});
