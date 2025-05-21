<script setup lang="ts">
import { ref } from "vue";
import { mobileIconClicked } from "../store/mobileIconClicked";

const clicked = mobileIconClicked();
</script>

<template>
  <div class="mobileNavIcon-wrapper" :class="clicked.state ? 'is-active' : ''">
    <div
      class="mobileNavIcon"
      @click="clicked.state = !clicked.state"
      :class="clicked.state ? 'is-active' : ''"
    >
      <span class="line"></span>
      <span class="line"></span>
      <span class="line"></span>
    </div>
    <div class="three col">
      <div class="hamburger"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* TEN */
.mobileNavIcon-wrapper {
  margin: 10px;
  position: fixed;
  z-index: 101;
  left: 0;
  padding: 10px;
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
  background-color: black;
  background-color: var(--color-nav-txt);
  box-shadow: 1px 1px 10px 0.1px rgba(0, 0, 0, 0.3);

}

.mobileNavIcon .line {
  width: 40px;
  height: 5px;
  background-color: var(--color-nav-bg);
  display: block;
  margin: 3px;
  border-radius: 3px;
  -webkit-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s 0.2s ease-in-out;
}


.mobileNavIcon.is-active .line {
  background-color: var(--color-nav-bg);
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
