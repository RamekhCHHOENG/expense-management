import { useThemeStore } from "~/stores/theme";

export default defineNuxtPlugin({
    name: "theme",
    enforce: "post",
    async setup() {
        const themeStore = useThemeStore();
        themeStore.init();

        return {
            provide: {
                theme: themeStore,
            },
        };
    },
});
