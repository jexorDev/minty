import { defineStore } from "pinia";

export const useErrorStore = defineStore('errors', () => {
    const error = ref("");
    const show = ref(false);

    function setError(message: string) {
        error.value = message;
        show.value = message.length > 0;
    }

    watch(show, () => {
        if (!show) {
            error.value = "";
        }
    })

    return {error, show, setError};
})