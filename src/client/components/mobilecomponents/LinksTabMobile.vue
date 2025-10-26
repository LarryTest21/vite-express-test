<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import gsap from "gsap";
import $ from "jquery";



const animationDone = ref(false);


onMounted(() => {

  $(".links>a").on('click', function () {
  });
  gsap.from(".links>a", {
    delay: 0.3,
    duration: 0.2,
    stagger: 0.09,
    x: -100,
    opacity: 0
  }).then(() => {
    animationDone.value = true
  })
})

onUnmounted(() => {
  gsap.to(".links>a", {
    delay: 0.05,
    duration: 0.1,
    stagger: 0.09,
    x: -100,
    opacity: 0
  })
})



</script>

<template>
  <div class="links" :class="{ animationDone: animationDone }">
    <RouterLink to="/rulebook">
      <li>Rulebook</li>
    </RouterLink>
    <RouterLink to="/news">
      <li>News</li>
    </RouterLink>
    <RouterLink to="/bsl">
      <li>BSL</li>
    </RouterLink>
    <RouterLink class="customteams" to="/custom-teams">
      <li>Custom Teams</li>
    </RouterLink>
    <RouterLink to="/contact">
      <li>Contact</li>
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
.links {
  position: relative;
  width: 100%;
  font-size: 2.5rem;
  list-style: none;
  display: flex;
  flex-direction: column;

  a {
    display: flex;
    text-decoration: none;
    padding: 40px 0 40px 20px;
    align-items: center;
    color: var(--color-nav-txt);
    transition: background-color 0.2s ease-in-out;
  }

  a:hover {
    background-color: var(--color-nav-txt-darker);
    color: var(--color-nav-bg)
  }

  a:focus-visible {
    outline: none;
    background-color: var(--color-nav-txt-darker);
    color: var(--color-nav-bg)
  }
}

.animationDone a:nth-child(even) {
  background-color: var(--color-nav-txt);
  color: var(--color-nav-bg)
}
</style>