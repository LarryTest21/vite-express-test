import { defineStore } from "pinia";
import { ref } from "vue";

export const userData = defineStore("userData", () => {
  const data = ref();
  const userPFP = ref();

  return { data, userPFP };
});
