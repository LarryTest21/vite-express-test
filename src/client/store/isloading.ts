import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const  isLoading = defineStore("isLoading", () => {
    
    const state = ref(false)



    return { state }
})