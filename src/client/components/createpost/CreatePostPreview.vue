<script setup lang="ts">
import { Timestamp } from "firebase/firestore";
import { ref, onMounted } from "vue";
import moment from "moment";

const emit = defineEmits(["showPreview"]);

const showCoverPreviewFunction = () => {
  emit("showPreview", false);
};

const props = defineProps({
  postTitle: String,
  postAuthor: String,
  postDate: String,
  postContent: String,
});

const title = ref() as any;
const author = ref() as any;
const date = ref() as any;
const postcontent = ref() as any;

const postTitle = ref(props.postTitle) as any;
const postAuthor = ref(props.postAuthor);
const postDate = ref(props.postDate) as any;
const postContent = ref(props.postContent) as any;

//DATE FUNCTIONS

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};
const newDate = moment(Date.parse(postDate.value)).format("MMMM Do YYYY, h:mm:ss a");
//GETTING AUTHOR NAME

onMounted(() => {
  if (postTitle.value == undefined || postTitle.value == "") {
    postTitle!.value = "-! MISSING TITLE !-";
    title.value.classList.add("missing");
  }

  if (postAuthor.value == undefined) {
    postAuthor!.value = "-! MISSING AUTHOR !-";
    author.value.classList.add("missing");
  }
  if (postDate.value == undefined) {
    postDate!.value = "-! MISSING DATE !-";
    date.value.classList.add("missing");
  }
  if (postContent.value == undefined || postContent.value == "<p><br></p>") {
    postContent!.value = "-! MISSING CONTENT !-";
    postcontent.value.classList.add("missing");
  }
});
</script>

<template>
  <div class="preview-post-wrapper">
    <div class="preview-post-container" key="2">
      <div class="button-close" key="3">
        <input
          key="4"
          type="button"
          value="Close"
          @click="showCoverPreviewFunction"
        />
      </div>
      <div class="preview-content-wrapper" key="1">
        <div class="post-meta" key="1">
          <div class="post-title" ref="title">{{ postTitle }}</div>
          <div class="post-author" ref="author">{{ postAuthor }}</div>
          <div class="post-date" ref="date">{{ newDate }}</div>
        </div>
        <div class="post-content" ref="postcontent" v-html="postContent"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
*::-webkit-scrollbar {
  width: 12px;
}

*::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: var(--color-nav-bg);
  cursor: pointer;
}

input[type="button"] {
  font-family: Chango;
  font-size: 16px;
  border-radius: 18px;
  width: 100%;
  cursor: pointer;
  padding: 10px;
  color: var(--color-nav-txt) !important;
  border-style: none;
  box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.3);
  background-color: var(--color-nav-bg);
  transition: all 0.15s ease-in-out;
}
input[type="button"]:hover {
  color: var(--color-nav-bg) !important;
  background-color: rgba(0, 0, 0, 0.3);
}
input[type="button"]:active {
  box-shadow: -1px -1px 1px 0.5px rgba(0, 0, 0, 0.3);
}
.preview-post-wrapper:before {
  top: 0;
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  height: 100vh;
  width: 100%;
  padding-top: 70px;
  content: "";
}
.preview-post-wrapper {
  position: fixed;
  height: calc(100vh - 70px);
  width: 100vw;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;

  .preview-post-container {
    position: relative;
    top: 70px;
    height: 80%;
    width: 70%;
    background-color: var(--color-nav-txt);
    border-radius: 10px;
    .button-close {
      position: absolute;
      margin: 10px;
      bottom: 0;
      right: 0;
      z-index: 5;
      input {
        font-size: 2rem;
        height: 100px;
        width: 200px;
      }
    }

    .preview-content-wrapper {
      position: relative;
      height: 100%;
      overflow-y: scroll;
      border-radius: 10px;
      box-shadow: 2px 2px 5px 3px rgba(0, 0, 0, 0.3);
      padding: 40px 250px 20px 100px;
      font-family: Roboto Condensed;

      .missing {
        font-size: 2rem !important;
        font-weight: 800 !important;
        font-family: Roboto Condensed !important;

        color: #ff004e;
      }
      .post-meta {
        font-weight: 700;
        font-size: 2rem;

        .post-title {
          font-size: 2rem;
        }

        .post-author {
          font-size: 1rem;
        }
        .post-date {
          margin-top: 10px;
          font-size: 1rem;
        }
      }
      .post-content {
        margin-top: 10px;
        max-height: 100%;
        display: flex;
        flex-direction: column;
        p {
          img {
            border-radius: 30px;
          }
        }
      }
      .post-content :deep(p) {
        margin-top: 10px;

        img {
          border-radius: 30px;
          box-shadow: 2px 2px 5px 3px rgba(0, 0, 0, 0.3);
          display: table;
          margin: 0 auto;
        }
        img + blockquote {
          display: table;
          margin: 0 auto;
        }
      }
    }
  }
}
</style>
