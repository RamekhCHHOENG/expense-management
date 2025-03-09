// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // Disable SSR since we're using Firebase
    ssr: false,

    devtools: { enabled: true },
    modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@vueuse/nuxt"],
    css: ["~/assets/css/main.css"],

    app: {
        head: {
            title: "Expense Manager",
            meta: [
                { charset: "utf-8" },
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1",
                },
            ],
        },
    },

    runtimeConfig: {
        public: {
            firebase: {
                apiKey: "AIzaSyBcpxqsx5fhi5Iiis7LS0YJHQY1Q8ClJes",
                authDomain: "expense-management-b84bc.firebaseapp.com",
                databaseURL:
                    "https://expense-management-b84bc-default-rtdb.asia-southeast1.firebasedatabase.app",
                projectId: "expense-management-b84bc",
                storageBucket: "expense-management-b84bc.appspot.com",
                messagingSenderId: "721998265859",
                appId: "1:721998265859:web:cc220b9a328b40d952d836",
                measurementId: "G-NT7GQ1P5M6",
            },
        },
    },

    vite: {
        optimizeDeps: {
            exclude: ["fsevents"],
        },
    },

    nitro: {
        preset: "node-server",
    },

    compatibilityDate: "2025-03-09",
});
