<script setup lang="ts">
import { onMounted } from "vue";
import gsap from "gsap";
import $ from "jquery";

import { mobileIconClicked } from "../../store/mobileIconClicked";

const clicked = mobileIconClicked();

onMounted(() => {

  $(".links>a").on('click', function () {
    clicked.state = false
  });
  gsap.from(".links>a", {
    delay: 0.3,
    duration: 0.2,
    stagger: 0.09,
    x: -100,
    opacity: 0
  })
})




</script>

<template>
  <div class="links">
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
  font-size: 3rem;
  list-style: none;
  display: flex;
  flex-direction: column;

  a {
    height: 100%;
    padding: 10px;
    text-decoration: none;
    display: flex;
    align-items: center;
    color: var(--color-nav-txt)
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
</style>