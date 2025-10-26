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


if (user != 'randomUser'){



  

} else {




}



}
