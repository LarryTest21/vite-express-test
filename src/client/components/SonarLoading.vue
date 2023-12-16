<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  background: Boolean,
});

const wrapper = ref()

watch(
  () => props.background,
  () => {
    if (props.background) {
      wrapper.value.classList.add("background-on")
    } if (!props.background)
      wrapper.value.classList.remove("background-on")
  }
);
</script>

<template>
  <div class="posts-loading" ref="wrapper">
    <div class="spinner"></div>
  </div>
</template>

<style scoped lang="scss">
.posts-loading.background-on {
  background-color: black;
}

.posts-loading {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 102;
  scale:1.4;

  .spinner {
    width: 100%;
    &:before,
    &:after {
      content: "";
      position: absolute;
      border-width: 10px;
      border-style: solid;
      border-radius: 50%;
    }
  }

  .spinner {
    @keyframes scale-2 {
      0% {
        transform: scale(0);
        opacity: 0;
      }

      50% {
        transform: scale(0.7);
        opacity: 1;
      }

      100% {
        transform: scale(1);
        opacity: 0;
      }
    }

    &:before {
      width: 400px;
      height: 400px;
      border-color: var(--color-nav-bg);
      top: 0px;
      left: 0px;
      margin: auto;
      bottom: 0;
      right: 0;
      animation: scale-2 4s linear 0s infinite;
    }

    &:after {
      width: 300px;
      height: 300px;
      border-color: var(--color-nav-bg);
      top: 0;
      left: 0;
      opacity: 0;
      margin: auto;
      bottom: 0;
      right: 0;
      animation: scale-2 1s linear 0.5s infinite;
    }
  }
}
</style>
