// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // Disable SSR since we're using Firebase
    ssr: false,

    devtools: { enabled: true },
    modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@vueuse/nuxt"],
    css: ["~/assets/css/main.css"],

    app: {
        head: {
            title: "Expense Management",
            meta: [
                { charset: "utf-8" },
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1",
                },
            ],
            link: [
                { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
                { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
                { rel: "apple-touch-icon", href: "/logo.svg" },
            ],
        },
    },

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    components: {
        dirs: [
            {
                path: "~/components/ui",
                extensions: [".vue"],
                prefix: "",
            },
            {
                path: "~/components",
                extensions: [".vue"],
            },
        ],
    },

    runtimeConfig: {
        public: {
            firebase: {
                apiKey: process.env.NUXT_FIREBASE_API_KEY,
                authDomain: process.env.NUXT_FIREBASE_AUTH_DOMAIN,
                projectId: process.env.NUXT_FIREBASE_PROJECT_ID,
                storageBucket: process.env.NUXT_FIREBASE_STORAGE_BUCKET,
                messagingSenderId:
                    process.env.NUXT_FIREBASE_MESSAGING_SENDER_ID,
                appId: process.env.NUXT_FIREBASE_APP_ID,
                measurementId: process.env.NUXT_FIREBASE_MEASUREMENT_ID,
            },
        },
    },

    vite: {
        optimizeDeps: {
            include: ["@unovis/ts", "@unovis/vue"],
            exclude: ["fsevents"],
        },
        resolve: {
            alias: {
                "@": "~",
            },
        },
    },

    nitro: {
        preset: "node-server",
    },

    compatibilityDate: "2025-03-09",
});
