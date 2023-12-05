import { defineStore } from "pinia";
import { ref } from "vue";

export const blogSearch = defineStore("blogSearch", () => {
  const state = ref(false);

  return { state };
});
