<script setup lang="ts">
import { ref, onMounted, onBeforeMount, watch } from "vue";
import { mobileIconClicked } from "../../store/mobileIconClicked";
import { useSwipe } from "@vueuse/core";

const clicked = mobileIconClicked();

const iconRef = ref(null);

const { direction } = useSwipe(iconRef);

watch(direction, (newvalue) => {
  if (newvalue == "down") {
    console.log("down");
    clicked.state = true;
  } 
});

const opacity = ref();

function moveScrollIndicator(e: any) {
  let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  let height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  let scrolled = (winScroll / height) * 100;
  if (scrolled > 0) {
    opacity.value = 0.5;
  } else {
    opacity.value = 1;
  }
}

onMounted(() => {
  window.addEventListener("scroll", moveScrollIndicator);
});

onBeforeMount(() => {
  window.removeEventListener("scroll", moveScrollIndicator);
});
</script>

<template>
  <div
    ref="iconRef"
    class="mobileNavIcon-wrapper"
    @click.prevent="clicked.state = !clicked.state"
  >
    <div class="inner">
      <div class="mobileNavIcon" :class="clicked.state ? 'is-active' : ''">
        <span class="line"></span>
        <span class="line"></span>
        <span class="line"></span>
      </div>
      <div class="three col">
        <div class="hamburger"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* TEN */
.mobileNavIcon-wrapper {
  position: fixed;
  z-index: 100;
  width: 100%;
  height: 50px;
  padding: 10px;
  .inner {
    top: 0;
    position: relative;
    height: 40px;
    width: 50px;
    z-index: 100;
    transition: all 0.3s ease-in-out;
    opacity: v-bind(opacity);
  }
}

.mobileNavIcon .line {
  width: 40px;
  height: 5px;
  background-color: var(--color-nav-txt);
  margin: 3px;
  border-radius: 3px;
  transition: all 0.3s 0.2s ease-in-out;
}

.mobileNavIcon.is-active .line {
  background-color: var(--color-nav-txt);
}

.mobileNavIcon:hover {
  cursor: pointer;
}

.mobileNavIcon {
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.mobileNavIcon.is-active {
  transform: rotate(-180deg);
}

.mobileNavIcon.is-active .line:nth-child(1) {
  width: 25px;
  transform: translateX(25px);
}

.mobileNavIcon.is-active .line:nth-child(2) {
  width: 30px;
}

.mobileNavIcon.is-active .line:nth-child(3) {
  transform: translateX(20.5px);
  width: 30px;
}
</style>
