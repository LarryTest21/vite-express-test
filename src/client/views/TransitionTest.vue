<script setup lang="ts">
import { ref, watch } from "vue";

const searchIconActive = ref(true);

const search = ref();

const menu = ref(["first", "second"]);

watch(searchIconActive, (newV) => {
  console.log(`output->newV`, menu);
  if (newV) {
    menu.value.push("asd");
  } else {
    const index = menu.value.indexOf("asd");

    if (index > -1) {
      // only splice array when item is found
      menu.value.splice(index, 1); // 2nd parameter means remove one item only
    }
  }
});
</script>

<template>
  <div class="container1">
    <button @click="searchIconActive = !searchIconActive">Click</button>
    <TransitionGroup tag="div" name="hey" class="container">
      <div v-for="item in menu" :key="item[0]">
        <RouterLink to="">
          {{ item }}
        </RouterLink>
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.constainer1 {
  height: 100%;
  display: flex;
}
button {
  position: relative;
  margin-top: 400px;
  height: 50px;
  width: 70px;
  color: black;
  font-family: Chango;
}
.search {
  position: relative;
  display: flex;
  cursor: pointer;
}
.container {
  position: relative;
  font-family: Chango;
  font-size: 2rem;
  list-style: none;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;

  a {
    text-decoration: none;
  }
}

.hey-move,
.hey-enter-active,
.hey-leave-active {
  transition: all 1s cubic-bezier(0.55, 0, 0.1, 1);
}

.hey-enter-from,
.hey-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.hey-leave-active {
  transition: all 1s cubic-bezier(0.55, 0, 0.1, 1);
  position: absolute;
}
</style>
