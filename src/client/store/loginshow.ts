import { defineStore } from "pinia";
import { ref } from "vue";

export const loginTabShow = defineStore("loginTabsShow", () => {
    
  const state = ref(true);

  const changeStateTrue = () => {
    state.value = true;
  };

  const changeStateFalse = () => {
    state.value = false;
  };

  return { state, changeStateTrue, changeStateFalse };
});


