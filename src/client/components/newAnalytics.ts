import { ref, watch, onBeforeUnmount, onMounted } from "vue";
import { useRoute } from "vue-router";
import moment from "moment";
import { Console, log } from "console";
import { createGlobalState } from "@vueuse/core";
import $ from "jquery";
import axios from "axios";

export async function storeRouterAnalytics(router: any, user: any) {
  const userID = user;
  const pageID = router;
  const countVisitor = ref(false)
  const randomUserNumber = localStorage.getItem("randomUser");

  if (userID === "randomUser") {
    if (randomUserNumber === null) {
      localStorage.setItem("randomUser", new Date().getTime().toString());
      countVisitor.value = true
      axios.post("api/analytics/visitorCounting", { userID, pageID, countVisitor });
    } else {
      const now = new Date().getTime();
      const difference = (now - Number(randomUserNumber)) / 1000;

      if (difference >= 1) {
        axios
          .post("api/analytics/visitorCounting", { userID, pageID, countVisitor })
          .then((res) => {
            if (res.status === 200) {
              localStorage.setItem(
                "randomUser",
                new Date().getTime().toString()
              );
            }
          });
      } else {
        countVisitor.value = false
        axios.post("api/analytics/visitorCounting", { userID, pageID, countVisitor })

      }
    }
  } else {
    




  }
}
