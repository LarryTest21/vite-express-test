<script setup lang="ts">
import { ref, watch, onBeforeUnmount, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import moment from "moment";
import $ from "jquery";
import "jquery";
import SideBar from "../components/PostSideBar.vue";
import { signedIn } from "../store/signedIn";
import axios from "axios";
import writerIcon from "../components/icons/writer.vue";
import { createGlobalState } from "@vueuse/core";
import postAuthorPanel from "../components/postAuthorPanel.vue";
import Comments from "../components/blog/Comments.vue";

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
const postAuthorName = ref();
const postAuthorPanelTF = ref(false);
const postData = ref() as any;
const postAuthorData = ref() as any;
const openAuthorPanel = (author: object) => {
  if (postAuthorPanelTF.value) {
    postAuthorPanelTF.value = false;
  } else {
    postAuthorPanelTF.value = true;
  }
};

postSlug.value = route.params.blogSlug;

const postAuthorDivLength = ref();
const postAuthorWidth = ref() as any;
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
    axios
      .get("/api/postAuthor/" + res.data.postAuthorID)
      .then((res) => {
        postAuthorData.value = res.data;
        postData.value.postAuthorName = {
          firstName: res.data.firstName,
          lastName: res.data.lastName,
        };
        isLoading.value = false;
      })
      .catch((err) => {
        console.error("Error fetching post author:", err);
      })
      .then(() => {
        postAuthorWidth.value = postAuthorDivLength.value?.offsetWidth;
      });
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
const scrollTopp = ref(0);
const sideBarTop = ref("250px");

let ticking = false;

function logScroll() {
  const scrollY = window.scrollY;
  const toBottom =
    window.innerHeight + Math.round(scrollY) >= document.body.offsetHeight;

  scrollTopp.value = scrollY;

  if (scrollY >= 60) {
    showSideBar.value = true;
    sideBarTop.value = scrollY + (toBottom ? 400 : 300) + "px";
  } else {
    sideBarTop.value = "200px";
  }

  ticking = false;
}


const scrolllll = () => {
  showSideBar.value = true;

  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;

  const scrollableHeight = scrollHeight - clientHeight;
  const scrollProgress = scrollableHeight > 0 ? scrollTop / scrollableHeight : 0;

  const minOffset = 90;
  const maxOffset = clientHeight - 430;

  const sidebarOffset = minOffset + scrollProgress * (maxOffset - minOffset);
  sideBarTop.value = `${Math.min(sidebarOffset, maxOffset)}px`;

  ticking = false;
}
const showContent = ref(false);

const postContentRef = ref<HTMLElement | null>(null);

const postContentHeight = ref()


watch(isLoading, async (loaded) => {
  if (!loaded) {
    await nextTick(); // wait for DOM update
    if (postContentRef.value) {
      postContentHeight.value = postContentRef.value.offsetHeight;
      console.log('Height of .post-content:', postContentHeight.value);
    } else {
      console.warn('postContentRef not found');
    }
  }
});
onMounted(() => {
  window.addEventListener('scroll', scrolllll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', scrolllll);
});
//window.addEventListener('scroll', onScroll);
onMounted(() => {

  fetchPost();
  window.addEventListener("scroll", scrolllll);
  watch(showContent, async (visible) => {
    if (visible) {
      await nextTick();
      const elements = document.getElementsByClassName('post-content');
      if (elements.length > 0) {
        const target = elements[0] as HTMLElement;
        const height = target.offsetHeight;
        console.log('Height of .post-content:', height);
      }
    }
  })

  if (signedInCheck.state) {
    axios.post("/api/user/updateRead", {
      blogPostID: postSlug.value,
      userID: signedInCheck.uid,
    });
  } else {
    watch(signedInCheck, () => {
      if (signedInCheck.state) {
        axios
          .post("/api/user/updateRead", {
            blogPostID: postSlug.value,
            userID: signedInCheck.uid,
          })
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
  window.removeEventListener("scroll", scrolllll);
});

const postAuthorPanelClickAway = () => {

}
</script>

<template>
  <TransitionGroup name="fade">
    <div v-if="!isLoading" class="posts-wrapper">
      <div class="blogpost-wrapper" ref="postWrapper">
        <div class="post-data">
          <div class="data-wrapper">
            <div class="title">{{ postData.postTitle }}</div>
            <div class="author-date">
              <Transition name="postAuthorPanel" mode="out-in">
                <postAuthorPanel class="post-author-panel" v-if="postAuthorPanelTF"
                  v-click-away="() => { if (postAuthorPanelTF) postAuthorPanelTF = false }" :postAuthorData
                  :postAuthorWidth />
              </Transition>

              <div class="author-wrapper" ref="postAuthorDivLength">
                <writerIcon />
                <div class="author" @click="openAuthorPanel(postData)">
                  {{
                    postData.postAuthorName.firstName +
                    " " +
                    postData.postAuthorName.lastName
                  }}
                </div>
              </div>

              <div class="date">
                {{
                  moment(new Date(postData.postDate)).format("MMM DD, HH:mm")
                }}
              </div>
              <div class="post-category" v-for="category in postData.subCategory">
                {{ category }}
              </div>
            </div>
          </div>
        </div>
        <div class="content-image-wr">
          <div class="cover-image">
            <img :src="postData.coverImage" alt="" />
          </div>
          <div class="post-content" v-html="postData.postContent" ref="postContentRef"></div>
        </div>
        <Comments class="comments" :postSlug="postSlug" />

      </div>
      <transition name="sidebar">
        <SideBar v-if="showSideBar" ref="sidebar" class="sidebar" :Posts="blogPosts" :Slug="postSlug" />
      </transition>
    </div>
  </TransitionGroup>
</template>

<style scoped lang="scss">
.posts-wrapper {
  position: relative;
  height: calc(100% - 70px);
  padding: 70px;
  width: 100vw;
  display: flex;

  .blogpost-wrapper {
    right: 0;
    left: 0;
    padding: 20px;
    width: 70vw;
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

          .post-author-panel {
            position: absolute;
            left: 120px;
          }

          .author-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: var(--color-nav-bg);
            border-radius: 5px;
            color: var(--color-nav-txt);
            transition: all 0.2s ease-in-out;
            z-index: 2;
            height: 100%;

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

    .content-image-wr {
      overflow: hidden;
      margin-top: 40px;

      .post-content {
        font-family: Roboto;
        font-size: 1.3rem;
        text-align: justify;

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

      .cover-image {
        float: right;
        margin: 15px 30px 20px 30px;
        max-width: 300px;

        img {
          width: 200px;
          height: auto;
        }
      }
    }
  }

  .comments {
    position: relative;
    width: 100%;
  }

}

.sidebar {
  position: fixed;
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
  transition: all 0.7s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.sidebar-enter-from,
.sidebar-leave-to {
  opacity: 0;
  transform: translateX(20vh);
}

.postAuthorPanel-enter-active,
.postAuthorPanel-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease, max-height 0.3s ease;
  overflow: hidden;
}

.postAuthorPanel-enter-from {
  opacity: 0;
  transform: translateX(-40%);
  max-height: 30px;
}

.postAuthorPanel-enter-to {
  opacity: 1;
  transform: translateX(0);
  max-height: 120px;
}

.postAuthorPanel-leave-from {
  opacity: 1;
  transform: translateX(0);
  max-height: 120px;
}

.postAuthorPanel-leave-to {
  opacity: 0;
  transform: translateX(-40%);
  max-height: 30px;
}
</style>
