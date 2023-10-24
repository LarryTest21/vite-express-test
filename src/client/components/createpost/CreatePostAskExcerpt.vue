<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["buttonYes", "buttonNo"]);

const buttonYes = ref(false);
const buttonNo = ref(false);

const buttonYesFn = () => {
  buttonYes.value = true;
  emit("buttonYes", true);
};
const buttonNoFn = () => {
  buttonNo.value = true;
  emit("buttonNo", true);
};
</script>

<template>
  <div class="background">
    <div class="saved-post-dialogue-wrapper">
      <div class="question-wrapper">
        <label for="" class="question"
          >Do you want to auto fill excerpt?</label
        >
      </div>
      <div class="question-buttons">
        <input
          type="button"
          class="button-yes"
          value="Yes"
          @click="buttonYesFn"
        />
        <input type="button" class="button-no" value="No" @click="buttonNoFn" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.background {
    z-index: 100;
  width: 400px;
  height: 400px;
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 5px 5px 5px 1px rgba(0, 0, 0, 0.3);
border-radius: 30px;
}
.saved-post-dialogue-wrapper {
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  justify-content: center;
  overflow: hidden;

  input[type="button"] {
    height: 100%;
    font-family: Chango;
    font-size: 2rem;
    border-radius: 18px;
    width: 100%;
    cursor: pointer;
    padding: 10px;
    color: var(--color-nav-txt) !important;
    border-style: none;
    box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.3);
    background-color: var(--color-nav-bg);
    transition: all 0.15s ease-in-out;
    z-index: 100;
  }
  input[type="button"]:hover {
    color: var(--color-nav-bg) !important;
    background-color: var(--color-nav-txt);
  }
  input[type="button"]:active {
    box-shadow: -1px -1px 1px 0.5px rgba(0, 0, 0, 0.3);
  }
  .question-wrapper {
    z-index: 100;
    height: 100%;
    .question {
      z-index: 100;
      font-family: Chango;
      font-size: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: rgb(3, 70, 124);
    }
  }

  .question-buttons {
    padding: 10px;
    display: flex;
    width: 80%;
    height: 100%;
    gap: 10px;
  }
}
</style>
