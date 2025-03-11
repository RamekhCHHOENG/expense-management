import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin({
    name: 'auth',
    enforce: 'post',
    async setup(nuxtApp) {
        const authStore = useAuthStore()
        
        // Get the Firebase auth instance from Nuxt's provide system
        const { $firebaseAuth } = useNuxtApp()
        
        if (!$firebaseAuth) {
            console.error('Firebase Auth not initialized')
            return {
                provide: {
                    auth: authStore
                }
            }
        }
        
        // Set the auth instance in the store
        authStore.setAuth($firebaseAuth)
        
        // Initialize the auth store immediately since Firebase is already initialized
        try {
            await authStore.init()
        } catch (error) {
            console.error('Error initializing auth:', error)
        }

        return {
            provide: {
                auth: authStore
            }
        }
    }
});