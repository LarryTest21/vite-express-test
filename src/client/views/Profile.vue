<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { userData as userD } from "../store/userData"
import profUserTab from "../components/profile/profUserTab.vue"
import profHistoryTab from "../components/profile/profHistoryTab.vue";
import profSettings from "../components/profile/profSettings.vue";
import {isMobile} from "../store/isMobile"


const mobile = isMobile()
console.log(`output->mobile`,mobile)
const readPosts = ref()
const userData = userD();
console.log(`output->userData`,userData)
if (userData == undefined) {

} else {
  console.log(`output->userData.data.userSettings`,userData.data.userSettings)
  if (userData.data.userSettings.readPosts == undefined) {
    readPosts.value = false
  }
}


const userPFP = ref();
userPFP.value = localStorage.getItem("avatar")


onMounted(() => {
  console.log(`output->userData.data.userSettings.readPosts`, userData.data.userSettings.readPosts)
})


</script>

<template>
  <div class="profile-wrapper">
    <div class="profile-wrapper-inner">
      <profUserTab :userData="userData" />
      <profSettings :userData="userData" />
      <profHistoryTab :userData="userData" v-if="readPosts" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-wrapper {
  position: relative;
  height: calc(100% - 70px);

  .profile-wrapper-inner {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 70px;
    display: flex;
    gap: 70px;
  }
}

.modal {
  width: 100%;
  height: 100%;
}


.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-leave-active {
  position: absolute;
}


.picPanel-enter-active,
.picPanel-leave-active {
  transition: all 0.1s ease-out;
  opacity: 1;
}

.picPanel-enter-from,
.picPanel-leave-to {
  opacity: 0;
}



.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease-out;
  opacity: 1;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.edit-enter-active,
.edit-leave-active {
  transition: all 0.2s ease-out;
  opacity: 1;
}

.edit-enter-from,
.edit-leave-to {
  opacity: 0;
  transform: translateX(200px)
}

@media only screen and (max-width: 600px) {

  .profile-wrapper {
    overflow: hidden;

    .profile-wrapper-inner {
      position: relative;
      padding: 0;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 10px;
      .userTab {
        transform: translate(100%)
      }
    }
  }
}
</style>
