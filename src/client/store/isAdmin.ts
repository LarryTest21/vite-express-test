import { defineStore } from "pinia";
import { ref } from "vue";

export const  isAdmin = defineStore("isAdmin", () => {
    
    const state = ref()

    return { state }
})