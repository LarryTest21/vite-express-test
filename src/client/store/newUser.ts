import { defineStore } from "pinia";
import { ref } from "vue";

export const newUser = defineStore("newUser", () => {
    
  const state = ref(false);


  return { state };
});
