<script setup lang="ts">
import { ref, computed } from "vue";
import { userData } from "../store/userData";

const notifArray = ref([userData().data.notificationArray]) as any;
const filteredArray = ref([]) as any;

const filteredNotifArray = computed(() =>
  notifArray.value.filter((n:any) => Array.isArray(n) && n.length > 0)
);

const notiTargetfClicked = (notif:any) => {
    console.log(notif)
};
</script>

<template>
  <div class="notification-wrapper">
    <transition name="activated">
      <ul class="notifications">
      </ul>
    </transition>

    <ul class="notifications" v-for="notif in filteredNotifArray">
      <li class="notif" @click="notiTargetfClicked(notif)">
        {{ notif }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.notification-wrapper {
  position: fixed;
  z-index: -1;
  width: 400px;
  top: 75px;
  background-color: var(--color-nav-bg);
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
  .notifications {
    position: relative;
    width: 100%;
    padding-inline-start: 0;
    .notif {
      position: absolute;
      margin: 0;
      padding: 10px;
      list-style-type: none;
      text-align: left;
      position: relative;
      width: 100%;
      height: 100%;
      cursor: pointer;
      font-family: Roboto;
      transition: all 0.1s ease-in-out;

      &:hover {
        background-color: var(--color-nav-txt);
        color: var(--color-nav-bg);
      }
    }
  }
}
</style>
