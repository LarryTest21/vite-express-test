<script setup lang="ts">
import { ref } from "vue";
import { doc, getDoc } from "firebase/firestore";
import db from "../../firebase/firebaseInit";
import "firebase/compat/auth";
import 'firebase/firestore'
import eyesIcon from "../../components/icons/eye.vue"

const querySnapshot = ref();
const totalViews = ref()

const Start = async () => {

  querySnapshot.value = (await getDoc(doc(db, "analytics", "visitors"))).data()

  const { deviceUsed, visitorCount, ...updatedObject } = querySnapshot.value;

  function sum(obj:any) {
    var sum = 0;
    for (var el in obj) {
      if (obj.hasOwnProperty(el)) {
        sum += parseFloat(obj[el]);
      }
    }
    return sum;
  }

  totalViews.value = sum(updatedObject)

}
Start()

</script>

<template>
  <div class="total-views-wrapper">
    <div class="text-wrapper">
      <label>Total Views</label>
      <div class="total-views">{{ totalViews }}</div>
    </div>
    <div class="icon-wrapper">
      <eyesIcon class="eyesIcon" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.total-views-wrapper {
  background-color: var(--color-nav-bg);
  color: var(--color-nav-txt);
  font-family: Roboto Condensed;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 30px;
  position: relative;
  overflow: hidden;

  .text-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    label {
      font-size: 2.5rem;
      font-weight: 500;
    }

    .total-views {
      font-size: 3rem;
      font-weight: 700;
    }
  }

  .icon-wrapper {
    position: absolute;
    height: 100%;
    width: 100%;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .eyesIcon {
      position: absolute;
      z-index: 0;
      opacity: 0.2;
      height: 300px;
      right: -50%;
      transition: all 0.1s ease-in-out;
    }

    svg :deep(.eye-1, .eye-2) {
      transition: all 0.2s ease-in-out;
    }

    svg :deep(.eye-1) {
      fill: var(--color-nav-bg);
    }

    svg :deep(.eye-2) {
      fill: var(--color-nav-txt);
    }
  }
}

.total-views-wrapper:hover {

  .icon-wrapper {
    .eyesIcon {
      opacity: 0.4;

    }
  }
}
</style>