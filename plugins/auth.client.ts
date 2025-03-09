import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  
  try {
    // Initialize auth state
    await authStore.init();
  } catch (error) {
    console.error('Failed to initialize auth:', error);
  }
}); 