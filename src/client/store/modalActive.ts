import { defineStore } from "pinia";
import { ref } from "vue";

export const modalActive = defineStore("modalActive", () => {
    
  const state = ref(false);

  return { state };
});
