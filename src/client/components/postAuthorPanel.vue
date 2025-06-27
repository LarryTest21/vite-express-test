<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = defineProps({
  postAuthorWidth: Number,
  postAuthorData: Object,
});

const formattedLength = ref();
watch(
  () => props.postAuthorWidth,
  (newv) => {
    formattedLength.value = newv! + 5 + "px";
  }
);
</script>

<template>
  <div class="post-author-panel-wr">
    <img :src="props.postAuthorData!.profilePic" class="profilepic" />
    <div class="name-subscribe">
      <div class="author-name">
        {{
          props.postAuthorData!.firstName + " " + props.postAuthorData!.lastName
        }}
      </div>
      <div class="subscribe">Subscribe</div>
    </div>
  </div>
</template>

<style lang="scss">
.post-author-panel-wr {
  position: absolute;
  background-color: #f0f0f0;
  border-radius: 10px;
  border: 1px solid transparent;
  left: v-bind(formattedLength);
  top: 0;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px;
  box-shadow: 4px 4px 5px 0px rgba(0, 0, 0, 0.3);

  .profilepic {
    position: relative;
    width: 100px;
  }
  .name-subscribe {
    color: var(--color-nav-txt);
    .subscribe {
      font-size: 1.5rem;
      border: 1px solid transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-nav-bg);
      font-family: Roboto Condensed;
      font-weight: 900;
      border-radius: 5px;
      box-sizing: border-box;
      cursor: pointer;
      color: var(--color-nav-txt);
      box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.363);
      padding: 5px;
      transition: all 200ms;

      &:hover {
        cursor: pointer;
        background-color: green;
        color:var(--color-nav-bg);
      }
    }
    .author-name {
      position: relative;
      font-family: Roboto Condensed;
      font-size: 1.5rem;
    }
  }
}
</style>
