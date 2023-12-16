import { defineStore } from "pinia";
import { ref } from "vue";

export const blogSearchIcon = defineStore("blogSearchIcon", () => {
  const state = ref(false);

  return { state };
});
