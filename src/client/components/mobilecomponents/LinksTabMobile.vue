<script setup lang="ts">
import {ref} from 'vue' 
import { userClickedMobile } from "../../store/userClickMobile";
import { userLoginClickMobile } from "../../store/userLoginClickMobile";
import { mobileIconClicked } from "../../store/mobileIconClicked";

const props = defineProps({
    
})

const userTabClicked = userClickedMobile();

const userLoginClick = userLoginClickMobile();
const mobileIClicked = mobileIconClicked();


</script>

<template>
 <div class="links" v-if="!userTabClicked.state && !userLoginClick.state"
                @click.native="mobileIClicked.state = false">
                <RouterLink to="/rulebook">
                  <li>Rulebook</li>
                </RouterLink>
                <RouterLink to="/news">
                  <li>News</li>
                </RouterLink>
                <RouterLink to="/bsl">
                  <li>BSL</li>
                </RouterLink>
                <RouterLink to="/custom-teams">
                  <li>Custom Teams</li>
                </RouterLink>
                <RouterLink to="/contact">
                  <li>Contact</li>
                </RouterLink>
              </div>
</template>

<style lang="scss" scoped>

</style>