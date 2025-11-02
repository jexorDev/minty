import { defineStore } from "pinia";
type MessageType = "success" | "info" | "error" | "";

export const useSnackbarStore = defineStore('snackbar', () => {
    const message = ref("");
    const type = ref<MessageType>("");
    const show = ref(false);

    function setMessage(msg: string, msgType: MessageType) {
        message.value = msg;
        type.value = msgType;
        show.value = msg.length > 0;
    }

    watch(show, () => {
        if (!show) {
            message.value = "";
            type.value = "";
        }
    })

    return {message, type, show, setMessage};
})