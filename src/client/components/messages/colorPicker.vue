<script setup lang="ts">
import { errorMonitor } from "events";
import { ref } from "vue";

const emit =defineEmits(['changeColor'])



const red = "rgb(156, 17, 17)";
const blue = "rgb(0, 87, 90)";
const purple = "rgb(82, 17, 156)";
const yellow = "rgb(156, 154, 17)";
const green = "rgb(27, 124, 14)";
const pink = "rgb(156, 17, 126)";

const colorArray = [red, blue, purple, yellow, green, pink];


const colorFn = (color:any) => {
emit("changeColor", color)
}
</script>

<template>
  <div class="color-wrapper">
    <div class="color" v-for="color in colorArray" :style="'background-color:'+color " @click="colorFn(color)"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.color-wrapper {
  z-index: 1;
  position: absolute;
  top:55px;
  right:20px;
  display: flex;
  gap: 5px;
  box-shadow: 4px 3px 5px 1px rgba(0, 0, 0, 0.452);
  padding: 5px;
  background-color: rgb(27, 124, 14);
  background-color: var(--color-nav-bg-darker);
  border-radius: 4px;

  .color {
    width: 30px;
    height: 30px;
    top: 50px;
    right: 20px;
    font-size: 0.6rem;
    display: flex;
    gap: 5px;
    box-shadow: 1px 1px 3px 0.1px rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    overflow: hidden;
    padding: 5px;
  }
}
</style>
