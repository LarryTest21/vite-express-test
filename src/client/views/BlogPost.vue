<script setup lang="ts">
import { ref, watch, onBeforeUnmount, onMounted } from "vue";
import { useRoute } from "vue-router";
import moment from "moment";
import $ from "jquery";
import "jquery";
import SideBar from "../components/PostSideBar.vue";
import { signedIn } from "../store/signedIn"
import axios from "axios";

const signedInCheck = signedIn()
console.log(signedInCheck.state);



const route = useRoute();
const isLoading = ref(true);

const blogPosts = ref([]) as any;
const sidebar = ref();
const postSlug = ref(route.params.blogSlug) as any;

const postTitle = ref();
const postAuthor = ref();
const postDate = ref();
const postContent = ref();
const coverImage = ref();
const postCategory = ref([]) as any;



postSlug.value = route.params.blogSlug;


async function fetchPost() {
  isLoading.value = true;
  const API_URL = ("/api/content/blogpost/" + postSlug.value)

  const API_URL2 = ("/api/content/blogposts/")

  axios.get(API_URL2).then((res) => {
    blogPosts.value = res.data
  })

  axios.get(API_URL).then((res) => {
    const postData = res.data
    postTitle.value = postData.postTitle
    postAuthor.value = postData.postAuthor
    postDate.value = postData.postDate
    postContent.value = postData.postContent
    coverImage.value = postData.coverImage
    postCategory.value = postData.postCategory
    isLoading.value = false
  })


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
  }
}


onMounted(() => {

  fetchPost();
  window.addEventListener("scroll", logScroll);

  if (signedInCheck.state) {
    axios.post("/api/user/updateRead", {blogPostID: postSlug.value, userID: signedInCheck.uid}).then((res) => {
          console.log(res);
        })
  } else {
    watch(signedInCheck, () => {
      if (signedInCheck.state) {
        console.log(postSlug.value);
        console.log(signedInCheck.uid);
        axios.post("/api/user/updateRead", {blogPostID: postSlug.value, userID: signedInCheck.uid}).then((res) => {
          console.log(res);
        })
      }
    })


  }

});

watch(() => route.params.blogSlug, () => {
  postSlug.value = route.params.id


})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", logScroll);
});
</script>

<template>
  <TransitionGroup name="fade">
    <div v-if="!isLoading" class="posts-wrapper">
      <div class="blogpost-wrapper" ref="postWrapper">
        <div class="post-title">
          {{ postTitle }}
          <div class="post-category-wrapper">
            <div class="post-category" v-for="category in postCategory">
              {{ category }}
            </div>
          </div>
        </div>
        <div class="post-date">{{ moment(new Date(postDate)).format(
          "MMM DD, HH:mm"
        ) }}</div>
        <div class="post-author">{{ postAuthor }}</div>
        <img :src="coverImage" alt="" />
        <div class="post-content" v-html="postContent"></div>
      </div>
      <SideBar ref="sidebar" class="sidebar" :Posts="blogPosts" :Slug="postSlug" />
    </div>
  </TransitionGroup>
</template>

<style scoped lang="scss">
.posts-wrapper {
  position: relative;
  height: calc(100% - 70px);
  padding-top: 70px;
  width: 100%;
  padding-left: 40px;

  .blogpost-wrapper {
    right: 0;
    left: 0;
    margin: auto;
    margin-top: 30px;
    width: 60%;
    color: var(--color-nav-bg);

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
      gap: 15px;

      .post-category-wrapper {
        position: relative;
        display: flex;
        gap: 10px;

        .post-category {
          font-size: 1.5rem;
          padding: 5px;
          background-color: var(--color-nav-bg);
          color: var(--color-nav-txt);
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          transition: all 0.2s ease-in-out
        }

        .post-category:hover {
          cursor: pointer;
          background-color: rgb(0, 87, 128);
          color: var(--color-nav-bg);
        }
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
  right: 0;
  top: 400px;
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
</style>
