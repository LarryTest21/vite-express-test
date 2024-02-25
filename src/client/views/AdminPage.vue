<script async setup lang="ts">
import { ref, onBeforeMount, onMounted } from "vue";
import Modal from "../components/Modal.vue";
// import AdminCounts from "../components/adminpage/AdminPostsCount.vue";
// import AdminUsersTab from "../components/adminpage/AdminUsersTab.vue";
// import AdminAnalytics from "../components/adminpage/AdminAnalytics.vue"
// import TotalViews from "../components/adminpage/TotalViews.vue"
// import TotalVisitors from "../components/adminpage/TotalVisitors.vue"


const usersTab = ref()
const postsTab = ref()
const analyticsTab = ref()
const adminTabs = ref()

const adminCardClick = (e:any) => {
  console.log(e);
}

const usersClicked = ref(false)
const analyticsClicked = ref(false)
const postsClicked = ref(false)
onMounted(() => {

})
</script>

<template>
  <div class="admin-page-wrapper">

    <ul class="top">
      <TotalViews class=" totalViews admincard" />
      <TotalVisitors class=" totalVisitors admincard" />

    </ul>
    <!-- <div class="admin-page">
      <div class="pseudo-div"></div>
      <ul class="admin-tabs" ref="adminTabs">
        <AdminUsersTab ref="usersTab" @click="adminCardClick" :usersClicked="usersClicked"
          class="admincard userstab" />
        <AdminCounts ref="postsTab" @click="adminCardClick" :postsClicked="postsClicked"
          class="admincard" />
        <AdminAnalytics ref="analyticsTab" @click="adminCardClick"
          :analyticsClicked="analyticsClicked" class="admincard analytics" />
      </ul>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.admin-page-wrapper {
  width: 100%;
  height: 100vh;
  padding-top: 70px;
  position: relative;

  .top {
    position: relative;
    margin: 30px;
    display: flex;
    gap:20px;

    .admincard {
      border-radius: 20px;
      height: 170px;
      width: 300px;
    }
  }



}
</style>
