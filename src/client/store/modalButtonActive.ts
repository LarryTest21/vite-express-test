import { defineStore } from "pinia";
import { ref } from "vue";

export const modalButtonActive = defineStore("modalButtonActive", () => {
    
  const state = ref(true);

  const modalButtonShow = () => {
    state.value = true;
  };

  const modalButtonHide = () => {
    state.value = false;
  };

  return { state, modalButtonShow, modalButtonHide };
});
