import { defineStore } from "pinia";
import { ref } from "vue";

export const mobileIconClicked  = defineStore("mobileIconClicked", () => {

  const state = ref();

  const micTrue = () => {
    state.value = true;
  };

  const micFalse = () => {
    state.value = false;
  };

  return { state, micTrue, micFalse };
});
