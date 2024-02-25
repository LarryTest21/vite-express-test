import { defineStore } from "pinia";
import { ref } from "vue";

export const stopScroll = defineStore("stopScroll", () => {
    
    const state = ref(false)

    return { state }
})