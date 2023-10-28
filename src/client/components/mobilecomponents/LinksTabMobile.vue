<script setup lang="ts">
import {onMounted} from "vue";
import { userClickedMobile } from "../../store/userClickMobile";
import { userLoginClickMobile } from "../../store/userLoginClickMobile";
import { mobileIconClicked } from "../../store/mobileIconClicked";
import gsap from "gsap";

const userTabClicked = userClickedMobile();

const userLoginClick = userLoginClickMobile();
const mobileIClicked = mobileIconClicked();

onMounted(() => {
  gsap.from(".links>a", {
  duration: 0.6,
  stagger: 0.05,
  x: -400,
})

})

</script>

<template>
  <div class="links" v-if="!userTabClicked.state && !userLoginClick.state" @click.native="mobileIClicked.state = false">
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
  height: 100%;
  font-size: 3rem;
  list-style: none;
  display: flex;

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