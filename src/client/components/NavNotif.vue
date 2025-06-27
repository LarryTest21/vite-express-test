<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { userData } from "../store/userData";
import bellIcon from "../components/icons/bell.vue";

const notifCounter = ref();

const notifClicked = ref(false);

const notifArray = ref([]) as any;

const emit = defineEmits(["closeNotifPanel", "openNotifPanel"]);

const props = defineProps(["notifPanelActive"]);

const notifIconClicked = () => {
  if (props.notifPanelActive) {
    emit("closeNotifPanel");
  } else {
    emit("openNotifPanel");
  }
};

const bellIconAnim = ref("");

onMounted(() => {
  notifArray.value = userData().data.notificationArray;
  const isEmpty = notifArray.value.every((item: any) => item === "");
  if (!isEmpty) {
    notifCounter.value = notifArray.value.length;
    bellIconAnim.value = "bell 1s ease-in-out infinite";
  } else {
    notifCounter.value = 0;
    bellIconAnim.value = "none";
  }

  watch(
    notifCounter,
    () => {
      console.log(`output->notifCounter`, notifCounter);
    },
    { deep: true }
  );
});
</script>

<template>
  <div class="notif-wr" @click="notifClicked = !notifClicked">
    <div class="notif-counter" v-if="notifCounter != 0">
      {{ notifCounter }}
    </div>
    <div
      class="notif-counter-icon-wrapper"
      :style="{ '--bellIconAnim': bellIconAnim }"
    >
      <bellIcon @click="notifIconClicked" :animation="bellIconAnim" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notif-wr {
  position: relative;
  height: 100%;
  display: flex;
  padding: 2px;
  justify-content: flex-end;
  border-radius: 10px;
  transition: all 0.1s ease-in-out;

  .notif-counter {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    margin: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10%;
    background-color: var(--color-nav-txt-lighter);
    color: var(--color-nav-bg);
    font: 700 1.3rem "Roboto Condensed";
    box-shadow: 1px 1px 3px 1px rgba(32, 32, 32, 0.664);
    z-index: 1;
    animation: fading 2s ease-in-out infinite;
    transition: background 0.2s ease-in-out;

    &:hover {
      background: var(--color-nav-user-hover);
    }
  }

  .notif-counter-icon-wrapper {
    position: relative;
    height: 90%;
    width: 100%;
    display: flex;
    justify-content: center;
    border-radius: 10px;
    transition: all 0.1s ease-in-out;

    &:hover {
      cursor: pointer;
      background-color: var(--color-nav-txt);

      svg {
        stroke: var(--color-nav-bg);
      }
    }

    svg {
      position: relative;
      fill: none;
      stroke: var(--color-nav-txt);
      stroke-width: 7px;
      animation: var(--bellIconAnim, none);
      transform-origin: top;
      transition: all 0.1s ease-in-out;
    }
  }
}

a {
  position: absolute;
}

@keyframes fading {
  0%,
  100% {
    opacity: 0;
  }
  10%,
  90% {
    opacity: 1;
  }
}
</style>
