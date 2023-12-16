import axios from "axios";
import { ref } from "vue";
import { defineStore } from "pinia";

export const useStoreAuth = defineStore('useStoreAuth', () => {
    
  const user = { email: localStorage.getItem("email") };
  const API_URL = "/api/user/refresh";
  const error = ref(false);
  const errorMessage = ref();
  const clearance = ref();
  const init = () => {
    return new Promise((resolve, reject) => {
      axios
        .post(API_URL, user)
        .then((res) => {
          clearance.value = res.data.clearance;
          resolve(res.data.clearance);
        })
        .catch(() => {
          error.value = true;
          errorMessage.value = "Something went wrong";
          reject({ error, errorMessage });
        });
    });
  };
  return { init, user, error, errorMessage, clearance };
});
