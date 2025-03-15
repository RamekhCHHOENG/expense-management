<template>
    <div class="flex min-h-screen flex-col items-center justify-center">
        <div
            class="container flex flex-col items-center justify-center gap-6 px-4 py-16"
        >
            <div class="flex flex-col items-center gap-2">
                <WifiOffIcon class="h-12 w-12 text-muted-foreground" />
                <h1 class="text-3xl font-bold tracking-tight">Offline</h1>
                <p class="text-muted-foreground">
                    You are currently offline. Please check your internet
                    connection.
                </p>
            </div>
            <Button @click="retryConnection">
                <RefreshCwIcon class="mr-2 h-4 w-4" />
                Retry Connection
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { RefreshCwIcon, WifiOffIcon } from "lucide-vue-next";
import { Button } from "~/components/ui/button";

const router = useRouter();

const retryConnection = () => {
    if (navigator.onLine) {
        router.back();
    } else {
        window.location.reload();
    }
};
</script>
