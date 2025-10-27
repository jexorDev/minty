import { defineStore } from "pinia";

export const useConfirmationStore = defineStore('confirmation', () => {
    const confirmationMessage = ref("");
    const confirmationFunction = ref<Function | undefined>(undefined);
    const show = ref(false);

    function setConfirmation(message: string, func: Function) {
        confirmationMessage.value = message;
        confirmationFunction.value = func;
        show.value = true;
    }

    function executeConfirmationFunction() {
        if (confirmationFunction.value) {
            show.value = false;
            confirmationFunction.value();
        }
    }

    return {show, confirmationMessage, setConfirmation, executeConfirmationFunction};
})