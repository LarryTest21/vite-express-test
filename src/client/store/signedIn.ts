import { defineStore } from "pinia";
import { ref } from "vue";

export const signedIn = defineStore("signedIn", () => {
    
  const state = ref(false);
  const uid = ref()
  return { state, uid };
});


