import { defineStore } from "pinia";
import { ref } from "vue";

export const profPicEnable = defineStore("profPicEnable", () => {
    
  const state = ref(false);

  return { state };
});
