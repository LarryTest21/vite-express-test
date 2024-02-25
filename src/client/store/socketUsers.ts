import { defineStore } from "pinia";
import { ref } from "vue";

export const socketUsers = defineStore("socketUsers", () => {

  const socketUsers = ref([]) as any;

  return { socketUsers };
});
