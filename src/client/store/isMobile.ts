import { defineStore } from "pinia";
import { ref } from "vue";

export const  isMobile = defineStore("isMobile", () => {
    
    const state = ref(false)

    return { state }
})