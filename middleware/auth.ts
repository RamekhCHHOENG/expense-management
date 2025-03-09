import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
    const authStore = useAuthStore();

    // If not authenticated and not going to login/signup pages
    if (
        !authStore.isAuthenticated &&
        !["/login", "/signup"].includes(to.path)
    ) {
        return navigateTo("/login");
    }

    // If authenticated and trying to access login/signup pages
    if (authStore.isAuthenticated && ["/login", "/signup"].includes(to.path)) {
        return navigateTo("/dashboard");
    }
});
