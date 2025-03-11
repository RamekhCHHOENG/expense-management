import type { Auth } from 'firebase/auth';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin({
    name: 'auth',
    enforce: 'post',
    async setup(nuxtApp) {
        // Wait for next tick to ensure Firebase is initialized
        await nextTick();
        
        const { $firebaseAuth, $firebaseFirestore } = nuxtApp;
        
        // Ensure both Auth and Firestore are initialized
        if (!$firebaseAuth || !$firebaseFirestore) {
            throw new Error('Firebase services not properly initialized');
        }
        
        try {
            const authStore = useAuthStore();
            
            // Set the auth instance
            authStore.setAuth($firebaseAuth as Auth);
            
            // Initialize auth state
            await authStore.init();
        } catch (error) {
            console.error('Error initializing auth:', error);
            throw error;
        }
    }
});