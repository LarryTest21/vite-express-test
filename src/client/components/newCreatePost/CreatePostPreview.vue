<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import moment from "moment";

const props = defineProps({
  interPost: Object,
  showPreview: Boolean,
});

const emit = defineEmits(["showPreview"]);

const previewPostTitle = ref(props.interPost?.postTitle);
const previewPostContent = ref(props.interPost?.postContent);

const previewPostDate = ref(
  moment(new Date(props.interPost?.postDate)).format("MMM DD YYYY,  HH:mm")
);
const previewPostAuthor = ref(props.interPost?.postAuthor);

onMounted(() => {
if(previewPostContent.value == undefined){
previewPostContent.value = "Missing Post Content"
}

});

</script>

<template>
  <div class="backdrop">
    <div class="preview-wrapper">
      <div class="post">
        <div :class="(previewPostTitle != undefined) ? previewPostTitle : 'missing'" class="postTitle"
        >
          {{
            previewPostTitle != undefined ? previewPostTitle : 'Missing Title'
          }}
        </div>
        <div class="metadata">
          <div class="postDate" :class="(previewPostDate != 'Invalid date') ? previewPostDate : 'missing'"
          >
            {{
              previewPostDate != 'Invalid date' ? previewPostDate : 'No date'
            }}
          </div>
          <div class="postAuthor" :class="(previewPostAuthor != undefined) ? previewPostAuthor : 'missing'"
          >
            {{
              previewPostAuthor != undefined
                ? previewPostAuthor
                : 'Missing Author'
            }}
          </div>
        </div>
        <div :class="(previewPostContent != 'Missing Post Content') ? previewPostContent : 'missing'" class="postContent" v-html="previewPostContent"
        >
        </div>
      </div>
      <button @click.prevent="emit('showPreview', false)">Close</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.backdrop {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.637);
}
.preview-wrapper {
  position: absolute;
  top: 70px;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 80%;
  max-height: 70%;
  border-radius: 10px;
  padding: 20px 40px;
  background: linear-gradient(
    150deg,
    rgba(1, 90, 174, 1) 0%,
    rgba(0, 54, 107, 1) 70%
  );
  z-index: 10;
  font-family: Roboto Condensed;
  color: var(--color-nav-bg);

  button {
    height: 70px;
    width: 150px;
    font-family: Chango;
    font-size: 2rem;
    color: var(--color-nav-txt);
    background-color: var(--color-nav-bg);
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 20px;
    border-radius: 5px;
    border: 0;
    cursor: pointer;
    color: var(--color-nav-txt);
    box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.363);
    transition: all 0.2s ease-in-out;

    &:hover {
      background-color: var(--color-nav-txt-lighter);
      color: var(--color-nav-bg);
    }

    &:focus {
      box-shadow: inset 2px 2px 2px 1px rgba(0, 0, 0, 0.363);
    }
  }

  .post {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 100%;

    .postTitle {
      font-size: 3rem;
      font-weight: 600;
    }
    .postContent{
        font-family:Roboto;
        font-size: 3rem;
      }

    .metadata {
      position: relative;
      margin-bottom: 30px;
      margin-top: 10px;

      .postDate {
        font-style: italic;
        font-size: 1.4rem;
        font-weight: 600;
      }
      .postAuthor {
        color: var(--color-nav-txt);
        background: var(--color-nav-bg);
        display: inline-block;
        padding: 5px;
        font-weight: 600;
        border-radius: 5px;
        margin-top: 10px;
        transition: all 0.2s ease-in-out;

        &:hover {
          background-color: var(--color-nav-bg-darker);
        }
      }
      .missing {
        color: rgb(245, 31, 31);
        animation: pulse 2s infinite;
        :has(.author) {
          background: red;
        }
      }
    }
  }
}
.missing {
  color: rgb(245, 31, 31);
  animation: pulse 2s infinite;
  font-weight: 600;
  :has(.author) {
    background: red;
  }
}
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
