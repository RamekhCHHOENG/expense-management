import { defineStore } from "pinia";

interface ThemeState {
    isDark: boolean;
}

export const useThemeStore = defineStore("theme", {
    state: (): ThemeState => ({
        isDark: false,
    }),

    actions: {
        init() {
            // Check if theme was saved in localStorage
            if (process.client) {
                const savedTheme = localStorage.getItem("theme");
                if (savedTheme) {
                    this.isDark = savedTheme === "dark";
                } else {
                    // Check system preference
                    this.isDark = window.matchMedia(
                        "(prefers-color-scheme: dark)"
                    ).matches;
                }
                this.applyTheme();
            }
        },

        toggleTheme() {
            this.isDark = !this.isDark;
            if (process.client) {
                localStorage.setItem("theme", this.isDark ? "dark" : "light");
                this.applyTheme();
            }
        },

        applyTheme() {
            // Apply theme to document
            if (this.isDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        },
    },
});
