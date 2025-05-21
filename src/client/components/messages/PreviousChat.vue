<script setup lang="ts">
import {ref} from 'vue' 
import axios from "axios"


const previousMessages = ref() as any



</script>

<template>
    <div class="previous-chats">
        previous-chats
      <div class="message" v-if="previousMessages != null" v-for="message in previousMessages">
        <div class="username">

          {{ message.userName }}
        </div>
      </div>
    </div>
</template>

<style lang="scss" scoped>
.previous-chats {
    height: 100%;
    width:100%;
  }
</style>