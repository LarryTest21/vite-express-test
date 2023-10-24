import { defineStore } from "pinia";
import { ref } from "vue";

export const userClickedMobile = defineStore("userClickedMobile", () => {

  const state = ref();

  const changeUCMTrue = () => {
    state.value = true;
  };

  const changeUCMFalse = () => {
    state.value = false;
  };

  return { state, changeUCMFalse, changeUCMTrue };
});
