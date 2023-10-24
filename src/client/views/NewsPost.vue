<script setup lang="ts">
import { ref, watch, onBeforeUnmount, onMounted } from "vue";
import { useRoute } from "vue-router";
import moment from "moment";
import $ from "jquery";
import "jquery";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import SideBar from "../components/PostSideBar.vue";
import { postLoaded } from "../store/postLoaded";

const route = useRoute();
const colRef = firebase.firestore().collection("news");

const postLoadedChange = postLoaded();
const { postStateTrue } = postLoadedChange;
const { postStateFalse } = postLoadedChange;

const isLoading = ref(false);

const newsPosts = ref([]) as any;
const sidebar = ref();
const postSlug = ref(route.params.newsSlug) as any;

const postTitle = ref();
const postAuthor = ref();
const postDate = ref();
const postContent = ref();
const coverImage = ref();
const postCategory = ref([]) as any;
const singlePost = ref([]) as any;

postSlug.value = route.params.newsSlug;

async function fetchData() {
  isLoading.value = true;
  postStateFalse();
  postSlug.value = route.params.newsSlug;
  colRef
    .get()
    .then((querySnapshot) =>
      querySnapshot.forEach((post) => {
        const check1 = post.data();
        newsPosts.value.push(check1);
      })
    )
    .then(() => {
      singlePost.value = newsPosts.value.filter(
        (item:any) => item.postID === postSlug.value
      );

      postTitle.value = singlePost.value[0].postTitle;
      postAuthor.value = singlePost.value[0].postAuthor;
      postDate.value = moment(
        new Date(singlePost.value[0].postDate.toDate())
      ).format("MMM, DD\xa0\xa0\xa0HH:mm");
      postContent.value = singlePost.value[0].postContent;
      coverImage.value = singlePost.value[0].coverImage;
      postCategory.value = singlePost.value[0].postCategory[0];
    })
    .catch((err) => {
      console.log(err);
    })
    .then(() => {
      isLoading.value = false; 
      postStateTrue();
    });
}
fetchData();

watch(
  () => route.params.newsSlug,
  () => {
    postSlug.value = route.params.newsSlug;
    newsPosts.value = [];
    fetchData();
  }
);
const scrollTopp = ref();

function logScroll() {
  const sidebar2 = sidebar.value.sidebar;
  scrollTopp.value = $(window).scrollTop();
  const toBottom =
    window.innerHeight + Math.round(window.scrollY) >=
    document.body.offsetHeight;

  if (!toBottom && scrollTopp.value >= 280) {
    sidebar2.style.transition = "all 0.3s ease-in-out";

    sidebar2.style.top = scrollTopp.value + 200 + "px";
  } else if (!toBottom && scrollTopp.value < 400) {
    sidebar2.style.position = "absolute";
    sidebar2.style.top = "400px";
  } else if (toBottom) {
    sidebar2.style.top = scrollTopp.value + 110 + "px";
    console.log(scrollTopp.value);
  }
}

onMounted(() => {
  window.addEventListener("scroll", logScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", logScroll);
});
</script>

<template>
  <div v-if="!isLoading" class="posts-wrapper">
    <div class="newspost-wrapper" ref="postWrapper">
      <div class="post-title">
        {{ postTitle }}
        <div class="post-category">
          {{ postCategory }}
        </div>
      </div>
      <div class="post-date">{{ postDate }}</div>
      <div class="post-author">{{ postAuthor }}</div>
      <img :src="coverImage" alt="" />
      <div class="post-content" v-html="postContent"></div>
    </div>
    <SideBar
      ref="sidebar"
      class="sidebar"
      :Posts="newsPosts"
      :Slug="postSlug"
    />
  </div>
</template>

<style scoped lang="scss">
.posts-wrapper {
  position: relative;
  height: calc(100% - 70px);
  width: 100vw;
  padding-top: 70px;
  padding-left: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  img {
    width: 150px;
    height: auto;
  }
  .newspost-wrapper {
    right: 0;
    position: relative;
    margin: auto;
    margin-top: 30px;
    width: 60%;
    color: var(--color-nav-bg);
    display: flex;
    flex-direction: column;
    justify-content: center;
    .post-title {
      font-family: Roboto Condensed;
      display: flex;
      flex-direction: row;
      width: 100%;
      justify-content: space-between;
      font-size: 5rem;
      font-weight: 700;
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .post-category {
        list-style: none;
        font-size: 1rem;
        background-color: var(--color-nav-bg);
        color: var(--color-nav-txt);
        border-radius: 10px;
      }
      .cover-image {
        width: 100%;
        img {
          margin-left: 200px;
          width: 200px;
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
  .side-container {
    position: absolute;
    top: 400px;
    right: 40px;

    .side-wrapper {
      display: flex;
      flex-direction: column;
      gap: 10px;
      height: min-content;

      .blog-posts-ul {
        display: flex;

        .posts-card::before {
          position: absolute;
          content: "";
          height: 100%;
          left: -20px;
          width: 10px;
          background-color: var(--color-text);
          border-radius: 20px;
        }
        .posts-card {
          position: relative;
          height: 100px;
          width: 300px;
          display: flex;
          flex-direction: row;
          gap: 10px;
          margin: 15px 0;

          a {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 1;
          }

          img {
            position: relative;
            height: 100px;
            border-radius: 10px;
          }
          .posts-text {
            line-height: 1;
            display: flex;
            flex-direction: column;
            gap: 3px;

            .posts-title {
              font-size: 1rem;
              font-weight: 600;
              display: flex;
            }
            .posts-date {
              font-size: 0.8rem;
            }
            .posts-author {
              font-size: 0.7rem;
            }
          }
        }
      }
    }
  }
}
.sidebar {
  position: absolute;
  right: 0;
  top: 400px;
}
</style>
