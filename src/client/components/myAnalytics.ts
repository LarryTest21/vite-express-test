import { ref, watch, onBeforeUnmount, onMounted } from "vue";
import { useRoute } from "vue-router";
import moment from "moment";
import { Console, log } from "console";
import { createGlobalState } from "@vueuse/core";





export async function storeRouterAnalytics(router:any) {

  //VISITOR COUNT
  const visitor = ref()



  const getUA = () => {
    let device = "Unknown";
    const ua = {
      "Generic Linux": /Linux/i,
      "Android": /Android/i,
      "BlackBerry": /BlackBerry/i,
      "Bluebird": /EF500/i,
      "Chrome OS": /CrOS/i,
      "Datalogic": /DL-AXIS/i,
      "Honeywell": /CT50/i,
      "iPad": /iPad/i,
      "iPhone": /iPhone/i,
      "iPod": /iPod/i,
      "macOS": /Macintosh/i,
      "Windows": /IEMobile|Windows/i,
      "Zebra": /TC70|TC55/i,
    }
  }






  //VIEWCOUNT MEASURING
  router.afterEach(async (to:any) => {

    visitor.value = sessionStorage.getItem("userV")


    const API_URL = "/api/analytics/visitors";

    var recievedData1 = await axios
    var visitorAnalyticsDate = new Date();
    var year = visitorAnalyticsDate.getFullYear()
    var month = visitorAnalyticsDate.getMonth()
    var day = visitorAnalyticsDate.getDate()
    const docRef = doc(db, "analytics", to.name);

    var pagename = to.name

    var recievedData = await getDoc(docRef);

    var pageData = recievedData.data();
    var recievedData = await getDoc(docRef);
    const analyticsDoc = collection(db, "analytics");


    const deepDocAnalytics = doc(db, "analytics", year.toString(), visitorAnalyticsDate.toLocaleString('default', { month: 'long' }).toString(), (day).toString())
    var deepDocAnalyticsRecieved = await getDoc(deepDocAnalytics)


    var visitorUp = recievedData1.data()!.visitorCount + 1
    var pageViewsUp = recievedData1.data()![month] + 1

    if (deepDocAnalyticsRecieved.data()! != undefined) {
      var visitorsTodayUp = deepDocAnalyticsRecieved.data()!.visitorsToday + 1


      if (deepDocAnalyticsRecieved.data()!.hasOwnProperty(to.name)) {
        var pageTodayUp = deepDocAnalyticsRecieved.data()![to.name] + 1


        await updateDoc(deepDocAnalytics, {
          visitorsToday: visitorsTodayUp || 1,
          [pagename]: pageTodayUp
        })
      } else {
        await updateDoc(deepDocAnalytics, {
          visitorsToday: visitorsTodayUp || 1,
          [pagename]: 1
        })

      }

    }

    if (!visitor.value) {



      if (isNaN(pageViewsUp)) {
        await updateDoc(doc(db, "analytics", "visitors"), {
          visitorCount: visitorUp,
          [month]: 1
        })

      } else {
        await updateDoc(doc(db, "analytics", "visitors"), {
          [month]: pageViewsUp
        })


      }

      console.log(visitor.value);
      await updateDoc(doc(db, "analytics", "visitors"), {
        visitorCount: visitorUp,
      })
      sessionStorage.setItem("userV", JSON.stringify(true));

      const deviceUsed = getUA();


      const deviceUsedRef = doc(db, "analytics", "visitors", "deviceUsed", "devices")

      var deviceUsedDownloaded = await getDoc(deviceUsedRef)
      var deviceUsedStored = deviceUsedDownloaded.data()![deviceUsed] + 1

      if (deviceUsedDownloaded.data()![deviceUsed] != undefined) {
        console.log(deviceUsedStored);

        await updateDoc(deviceUsedRef, {
          [deviceUsed]: deviceUsedStored
        })
      }
      else if (deviceUsedDownloaded.data()![deviceUsed] === undefined) {
        await updateDoc(deviceUsedRef, {
          [deviceUsed]: 1
        })
      }

    } else if (visitor.value) {



      if (isNaN(pageViewsUp)) {
        await updateDoc(doc(db, "analytics", "visitors"), {
          [month]: 1
        })

      } else {
        await updateDoc(doc(db, "analytics", "visitors"), {
          [month]: pageViewsUp
        })

      }


    }

    if (pageData === undefined) {
      await setDoc(doc(analyticsDoc, to.name), {
        pageName: to.name,
        pageViews: 1,
        timeSpent: [],
      });
    } else {
      var viewcount = (await getDoc(docRef)).data()!.pageViews;

      await updateDoc(docRef, {
        pageViews: viewcount + 1,
      });
    }
  });

  //TIME SPENT ON PAGE MEASURING
  const openedTime = ref();
  const leavingTime = ref();
  const interTime = ref();
  const refreshSpentTime = ref([]) as any


  openedTime.value = new Date()


  router.afterEach(async (to:any, from:any) => {



    if (from.name != undefined) {
      interTime.value = new Date()
      leavingTime.value = interTime.value.getTime() - openedTime.value.getTime()
      openedTime.value = interTime.value

      const docRef = doc(db, "analytics", from.name);


      refreshSpentTime.value = (await getDoc(docRef)).data()!.timeSpent



      if (refreshSpentTime.value === undefined) {
        await updateDoc(docRef, {
          timeSpent: [leavingTime.value]
        });

      }
      else {

        if (refreshSpentTime.value.length <= 21 || refreshSpentTime.value.length === 0) {
          refreshSpentTime.value.push(leavingTime.value)

        } if (refreshSpentTime.value.length === 21) {
          refreshSpentTime.value.shift()
        }

        await updateDoc(docRef, {
          timeSpent: refreshSpentTime.value
        });
      }


    }
  })

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
