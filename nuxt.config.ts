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
            firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
            firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
            firebaseStorageBucket:
                process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            firebaseMessagingSenderId:
                process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
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
