import { defineStore } from "pinia";
import { ref } from "vue";

export const onMountApp = defineStore("onMountApp", () => {

  const state = ref();

  const onMountAppTrue = () => {
    state.value = true;
  };

  const onMountAppFalse = () => {
    state.value = false;
  };

  return { state, onMountAppTrue, onMountAppFalse };
});
