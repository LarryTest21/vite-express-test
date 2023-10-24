import { defineStore } from "pinia";
import { ref } from "vue";

export const userTabClick = defineStore("userTabClick", () => {

  const state = ref();


  return { state };
});
