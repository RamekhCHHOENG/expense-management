export default defineNuxtRouteMiddleware((to, from) => {
    // Skip offline page to avoid redirect loop
    if (to.path === "/offline") {
        return;
    }

    // Check if offline
    if (process.client && !navigator.onLine) {
        return navigateTo("/offline");
    }
});
