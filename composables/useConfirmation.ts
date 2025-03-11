import { ref } from "vue";

export interface ConfirmationOptions {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    loadingText?: string;
}

export function useConfirmation() {
    const isOpen = ref(false);
    const loading = ref(false);
    const options = ref<ConfirmationOptions>({
        title: "",
        description: "",
    });

    const confirm = (newOptions: ConfirmationOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            options.value = {
                ...newOptions,
                confirmText: newOptions.confirmText || "Confirm",
                cancelText: newOptions.cancelText || "Cancel",
                loadingText: newOptions.loadingText || "Please wait...",
            };
            isOpen.value = true;

            const handleConfirm = async () => {
                loading.value = true;
                resolve(true);
                loading.value = false;
                isOpen.value = false;
            };

            const handleCancel = () => {
                resolve(false);
                isOpen.value = false;
            };

            // Clean up event listeners when dialog is closed
            watch(isOpen, (newValue) => {
                if (!newValue) {
                    resolve(false);
                }
            });

            // Return the handlers that will be used in the template
            return {
                handleConfirm,
                handleCancel,
            };
        });
    };

    return {
        isOpen,
        loading,
        options,
        confirm,
    };
}
