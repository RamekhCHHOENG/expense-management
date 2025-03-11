import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
    router: {
        middleware: ["auth"],
    },
});
