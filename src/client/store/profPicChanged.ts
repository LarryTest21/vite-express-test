import { defineStore } from "pinia";
import { ref } from "vue";

export const profPicChanged = defineStore("profPicChanged", () => {
    
  const state = ref(false);


  return { state };
});
