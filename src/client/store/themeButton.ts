import { defineStore } from "pinia";
import { ref } from "vue";

export const themeButton = defineStore("themeButton", () => {
  
  const themeButton = ref();

  return { themeButton };
});
