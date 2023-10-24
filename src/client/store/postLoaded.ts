import { defineStore } from "pinia";
import { ref } from "vue";

export const  postLoaded = defineStore("postLoaded", () => {
    
    const state = ref(false)



    return { state }
})