import { defineStore } from "pinia";
import { ref } from "vue";

export const storedTokens = defineStore("storedTokens", () => {
  
  const refreshToken = ref();
  const accessToken = ref();

  return { refreshToken, accessToken };
});
