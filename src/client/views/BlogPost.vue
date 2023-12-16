<script setup lang="ts">
import { ref, watch, onBeforeUnmount, onMounted } from "vue";
import { useRoute } from "vue-router";
import moment from "moment";
import $ from "jquery";
import "jquery";
import SideBar from "../components/PostSideBar.vue";
import { signedIn } from "../store/signedIn";
import axios from "axios";
import writerIcon from "../components/icons/writer.vue";
import { createGlobalState } from "@vueuse/core";
const signedInCheck = signedIn();

const route = useRoute();
const isLoading = ref(true);

const blogPosts = ref([]) as any;
const sidebar = ref();
const postSlug = ref(route.params.blogSlug) as any;

const postContent = ref();
const coverImage = ref();
const postCategory = ref([]) as any;

const showSideBar = ref();

const postData = ref() as any;

postSlug.value = route.params.blogSlug;

async function fetchPost() {
  isLoading.value = true;
  const API_URL = "/api/content/blogpost/" + postSlug.value;

  const API_URL2 = "/api/content/blogposts/";

  axios.get(API_URL2).then((res) => {
    blogPosts.value = res.data;
  });

  axios.get(API_URL).then((res) => {
    postData.value = res.data;
    postContent.value = postData.postContent;
    coverImage.value = postData.coverImage;
    postCategory.value = postData.subCategory;
    isLoading.value = false;
  });
}

watch(
  () => route.params.blogSlug,
  () => {
    postSlug.value = route.params.blogSlug;
    blogPosts.value = [];
    fetchPost();
  }
);
const scrollTopp = ref();
const sideBarTop = ref();
function logScroll() {
  scrollTopp.value = $(window).scrollTop();
  const toBottom =
    window.innerHeight + Math.round(window.scrollY) >=
    document.body.offsetHeight;

    if (scrollTopp.value >= 280){
      showSideBar.value = true;
      sideBarTop.value = scrollTopp.value + 300 + "px";
    }


    if (scrollTopp.value <= 280){
      sideBarTop.value = '250px';
    }
    if (toBottom) {
      sideBarTop.value = scrollTopp.value + 400 + "px";
    }
  
}

onMounted(() => {
  fetchPost();
  window.addEventListener("scroll", logScroll);

  if (signedInCheck.state) {
    axios
      .post("/api/user/updateRead", {
        blogPostID: postSlug.value,
        userID: signedInCheck.uid,
      })
      .then((res) => {
      });
  } else {
    watch(signedInCheck, () => {
      if (signedInCheck.state) {
        axios
          .post("/api/user/updateRead", {
            blogPostID: postSlug.value,
            userID: signedInCheck.uid,
          })
          .then((res) => {
          });
      }
    });
  }
});

watch(
  () => route.params.blogSlug,
  () => {
    postSlug.value = route.params.id;
  }
);

onBeforeUnmount(() => {
  window.removeEventListener("scroll", logScroll);
});
</script>

<template>
  <TransitionGroup name="fade">
    <div v-if="!isLoading" class="posts-wrapper">
      <div class="blogpost-wrapper" ref="postWrapper">
        <div class="post-data">
          <div class="data-wrapper">
            <div class="title">{{ postData.postTitle }}</div>
            <div class="author-date">
              <div class="author-wrapper">
                <writerIcon />
                <div class="author">{{ postData.postAuthor }}</div>
              </div>

              <div class="date">
                {{
                  moment(new Date(postData.postDate)).format("MMM DD, HH:mm")
                }}
              </div>
              <div class="post-category" v-for="category in postData.subCategory"
              >
                {{ category }}
              </div>
            </div>
          </div>
          <div class="cover-image">
            <img :src="postData.coverImage" alt="" />
          </div>
        </div>

        <img :src="coverImage" alt="" />
        <div class="post-content" v-html="postData.postContent"></div>
      </div>
      <transition name="sidebar">
        <SideBar v-if="showSideBar" ref="sidebar" class="sidebar" :Posts="blogPosts" :Slug="postSlug"
        />
      </transition>
    </div>
  </TransitionGroup>
</template>

<style scoped lang="scss">
.posts-wrapper {
  position: relative;
  height: calc(100% - 70px);
  padding: 70px;
  width: 100%;
  display: flex;
  .blogpost-wrapper {
    right: 0;
    left: 0;
    padding: 20px;
    padding-left: 200px;
    width: 100%;
    color: var(--color-nav-bg);

    .post-data {
      display: flex;
      .data-wrapper {
        font-family: Roboto Condensed;
        display: flex;
        width: 100%;
        font-weight: 700;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 15px;

        .title {
          font-size: 5rem;
        }
        .author-date {
          position: relative;
          font-size: 1.2rem;
          display: grid;
          grid-template-columns: auto 2fr 1fr;
          align-items: center;
          gap: 20px;
          .author-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: var(--color-nav-bg);
            border-radius: 5px;
            color: var(--color-nav-txt);
            transition: all 0.2s ease-in-out;

            img {
              position: relative;
              width: 30px;
            }

            .author {
              border-radius: 5px;
              padding: 5px;
            }
            svg {
              width: 30px;
              height: auto;
              fill: var(--color-nav-txt);
              transition: all 0.2s ease-in-out;
            }
            &:hover {
              cursor: pointer;
              background-color: var(--color-nav-txt-darker);
              color: var(--color-nav-bg);
              svg {
                fill: var(--color-nav-bg);
              }
            }
          }
        }
        .post-category {
          font-size: 1.5rem;
          padding: 5px;
          background-color: var(--color-nav-bg);
          color: var(--color-nav-txt);
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          transition: all 0.2s ease-in-out;
          &:hover {
            cursor: pointer;
            background-color: var(--color-nav-txt-darker);
            color: var(--color-nav-bg);
          }
        }
      }

      .cover-image {
        width: 100%;

        img {
          width: 200px;
          height: auto;
        }
      }
    }

    .post-date {
      font-family: Nunito;
      font-weight: 900;
      font-size: 1.2rem;
      margin-top: 10px;
    }

    .post-author {
      font-family: Nunito;
      font-weight: 900;
      font-size: 1rem;
      font-style: italic;
    }

    .post-content {
      display: flex;
      font-family: Roboto;
      font-weight: 900;
      font-size: 1.3rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-top: 30px;

      :deep(span) {
        color: var(--color-nav-bg) !important;
      }

      :deep(p:has(img)) {
        margin: 10px 0;
        width: 300px;
      }

      :deep(p:has(+ img)) {
        background-color: red;
      }

      :deep(img) {
        position: relative;
        transition: scale 0.2s ease-in-out;
        z-index: 3;
        transform-origin: 2rem;
      }

      :deep(img):hover {
        position: relative;
        transform-origin: 2rem;
        scale: 1.1;
      }

      :deep(p) {
        margin: 10px 0;
      }

      :deep(figcaption) {
        margin: 10px 0 30px 0;
      }

      :deep(img) {
        background-color: red;
        border-radius: 20px;
        box-shadow: 5px 2px 5px 2px rgba(black, 0.2);
      }

      :deep(blockquote) {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 20px;
        transition: all 0.3s ease-in-out;
        will-change: scale;
        padding: 10px 20px;
        width: 70%;
        box-shadow: 3px 2px 3px 1px rgba(black, 0.2);
      }

      :deep(blockquote):hover {
        scale: 105%;
      }

      :deep(blockquote) {
        quotes: string;
        font-size: 1.5em;
        font-style: italic;
      }

      :deep(blockquote)::before {
        content: open-quote;
      }

      :deep(blockquote)::after {
        content: close-quote;
      }
    }
  }
}

.sidebar {
  position: absolute;
  right: 40px;
  transition: all 0.4s ease-in-out;
  top: v-bind(sideBarTop);
}

.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20vh);
}

.sidebar-enter-active,
.sidebar-leave-active {
  transition: all 1s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.sidebar-enter-from,
.sidebar-leave-to {
  opacity: 0;
  transform: translateX(20vh);
}
</style>
