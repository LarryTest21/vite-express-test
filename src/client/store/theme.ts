import { defineStore } from "pinia";
import { ref } from "vue";

export const useTheme = defineStore("themeFromNav", () => {

  const state = ref('theme-dark');



  return { state };
});
