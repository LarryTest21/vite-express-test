import { ref, watch, onBeforeUnmount, onMounted } from "vue";
import { useRoute } from "vue-router";
import moment from "moment";
import { Console, log } from "console";
import { createGlobalState } from "@vueuse/core";
import axios from "axios";






export async function storeRouterAnalytics(router:any) {

console.log(router)


}







// export async function storeAnalytics() {
//   const route = useRoute();
//   const openedTime = ref();
//   const leavingTime = ref();
//   const pageName = ref(route.name) as any;
//   openedTime.value = new Date();
//   const docRef = doc(db, "analytics", pageName.value);

//   onMounted(() => {
//     docSnap();
//   });

//   onBeforeUnmount(async () => {
//     leavingTime.value = new Date();
//     var difference = leavingTime.value.getTime() - openedTime.value.getTime();
//     var d = moment.utc(difference).format("mm:ss");
//     await updateDoc(docRef, {
//       timeSpent: difference,
//     });
//   });

//   const docSnap = async () => {
//     var recievedData = await getDoc(docRef);

//     var pageData = recievedData.data();
//     const analyticsDoc = collection(db, "analytics");

//     if (pageData === undefined) {
//       await setDoc(doc(analyticsDoc, pageName.value), {
//         pageName: pageName.value,
//         viewCount: 1,
//         timeSpent: 0,
//         userDevice: device![0],
//         userAgent: platform.value,
//       });
//     } else {
//       var viewcount = (await getDoc(docRef)).data()!.viewCount;
//       await updateDoc(docRef, {
//         viewCount: viewcount + 1,
//         userDevice: device![0],
//         userAgent: await platform.value,
//       });
//     }
//   };

//   window.addEventListener("beforeunload", async function () {
//     leavingTime.value = new Date();
//     var difference = leavingTime.value.getTime() - openedTime.value.getTime();
//     var d = moment.utc(difference).format("mm:ss");
//     await updateDoc(docRef, {
//       timeSpentLast: difference,
//     });
//   });
// }
