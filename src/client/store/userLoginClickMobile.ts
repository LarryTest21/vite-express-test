import { defineStore } from "pinia";
import { ref } from "vue";

export const userLoginClickMobile = defineStore("userLoginClickMobile", () => {

  const state = ref();

  const changeULCMTrue = () => {
    state.value = true;
  };

  const changeULCMFalse = () => {
    state.value = false;
  };

  return { state, changeULCMFalse, changeULCMTrue };
});
