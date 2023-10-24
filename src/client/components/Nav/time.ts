import { ref, watch } from "vue";
const time = ref();

export const timeCurrent = () => {

  const today = new Date();
  time.value =
    (today.getHours() < 10 ? "0" : "") +
    today.getHours() +
    ":" +
    (today.getMinutes() < 10 ? "0" : "") +
    today.getMinutes()

  setTimeout(() => {
    timeCurrent();
  }, 60000);


  return { time };
};
