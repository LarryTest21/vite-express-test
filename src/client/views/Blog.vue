<script setup lang="ts">
import { ref, onMounted } from "vue";
import moment from "moment";
import "firebase/compat/auth";
import SonarLoading from "../components/SonarLoading.vue";
import BlogSideBar from "../components/BlogSideBar.vue";
import SearchBar from "../components/SearchBar.vue";
import searchIcon from "../components/icons/search.vue";
import timerIcon from "../components/icons/timer.vue";
import eyeIcon from "../components/icons/eye.vue";
import axios from "axios";

const isLoading = ref(true);
const blogPosts = ref([]) as any;
const sidebar = ref();
const storedPosts = ref([]) as any;
const search = ref(false) as any;

const sonarLoading = ref(false);
const sonarBackground = ref(false);
var readArray = [] as any

async function getPosts() {
  sonarLoading.value = true;
  sonarBackground.value = false;
  isLoading.value = true;
  blogPosts.value = [];
  storedPosts.value = [];

  const API_URL = "/api/content/blogposts"
  axios.get(API_URL).then((res) => {
    blogPosts.value = storedPosts.value = res.data
    sonarLoading.value = false;
    sonarBackground.value = false;
    isLoading.value = false;
  })

}

const selected = (e: String) => {
  setTimeout(() => {
    if (e != null) {
      const propsToCheck = ["postCategory"];
      function filterByValue(array: Array<any>, string: String) {
        return array.filter((o) =>
          propsToCheck.some((k) =>
            String(o[k]).toLowerCase().includes(string.toLowerCase())
          )
        );
      }

      blogPosts.value = filterByValue(storedPosts.value, e);
      console.log(blogPosts.value); console.log(storedPosts.value);


    } else {
      getPosts();
    }
  }, 10);
};

const inputFocused = (e: any) => {
  if (e != undefined) {
    if (e.value === true) {
      isLoading.value = true;
      setTimeout(() => {
        sonarLoading.value = false;
        sonarBackground.value = true;
      }, 400);
    } else if (e.value === false) {
      isLoading.value = false;
    }
  }
};
getPosts();

onMounted(async () => {
});




</script>

<template>
  <TransitionGroup name="search">
    <SearchBar :storedPosts="storedPosts" v-if="search" class="searchbar" />
  </TransitionGroup>
  <div class="blog-container" key="1">
    <TransitionGroup name="fadeLoading">
      <div class="searchIcon-wrapper" key="1">
        <searchIcon class="searchIcon" @click="search = !search" key="2" />
      </div>
    </TransitionGroup>

    <transition name="fadeLoading">
      <SonarLoading v-show="isLoading" :loading="sonarLoading" :background="sonarBackground" />
    </transition>
    <div class="sidebar">
      <BlogSideBar @selected="selected" @search="inputFocused" class="sidebar" ref="sidebar" />
    </div>
    <div class="wrapper" key="1">
      <TransitionGroup name="fade">
        <div class="posts-card" v-if="!isLoading" v-for="post in blogPosts" :key="post.postID">
          <div class="wrapper-posts">
            <router-link :to="/blog/ + post._id" key="post.id" class="posts-permalink">
            </router-link>

            <div class="posts-image">
              <div class="category-wrapper">
                <div class="read-already-wrapper" v-if="readArray !== undefined">
                  <div class="read-already" v-if="readArray.includes(post._id.toString())">READ</div>
                </div>
                <div class="category" v-for="category in post.postCategory">
                  {{ category }}
                  <router-link :to="/category/ + category" key="category" class="category-permalink"></router-link>
                </div>
              </div>
              <img class="post.metadata.hero" :src="post.coverImage" :alt="post.postTitle" />
            </div>

            <div class="posts-text-area">
              <div class="text-data">
                <div class="title-date-wrapper">
                  <h1 class="posts-title">{{ post.postTitle }}</h1>

                  <p class="posts-date">
                    {{
                      moment(new Date(post.postDate)).format(
                        "MMM DD, HH:mm"
                      )
                    }}
                  </p>

                </div>

                <div class="post-data">
                  <div class="time-wrapper">
                    <timerIcon />

                    <div class="time">
                      {{ Math.round(post.postContent.split(" ").length / 200) }}
                      <div class="minutes">&#160min</div>
                    </div>
                  </div>
                  <div class="watched-wrapper">
                    <eyeIcon />
                    <div v-if="post.viewCount != undefined" class="watched-count">{{ post.viewCount }}</div>
                    <div v-else class="watched-count">{{ 0 }}</div>

                  </div>

                </div>
              </div>

              <div class="excerpt-wrapper">
                <p class="posts-excerpt">{{ post.postExcerpt }}</p>

              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped lang="scss">
@media (min-width: 1024px) {
  .searchIcon-wrapper {
    position: absolute;
    margin-top: 90px;
    padding: 10px;
    z-index: 13;

    .searchIcon {
      left: 0;
      height: 50px;
      width: auto;
      fill: var(--color-nav-bg);
    }
  }

  .sidebar {
    top: 180px;
    z-index: 10;
  }

  .blog-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;

    .searchbar {
      position: absolute;
    }

    .wrapper {
      left: 0;
      margin-top: 70px;
      margin-left: 30px;
      width: 100%;
      padding: 20px;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      top: 70px;
      gap: 30px;

      .posts-card {
        height: 400px;
        width: 450px;

        .wrapper-posts {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .posts-image {
          position: relative;
          height: 100%;
          width: 100%;
          border-radius: 10px;
          box-shadow: rgba(0, 0, 0, 0.2) 5px 5px 10px 5px;
          overflow: hidden;



          @keyframes blinking {
            0% {
              opacity: 0.4
            }

            50% {
              opacity: 1
            }

            100% {
              opacity: 0.4
            }
          }

          .category-wrapper {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            bottom: 0;
            right: 0;
            z-index: 5;
            padding: 10px;
            margin: 10px;
            z-index: 11;
            gap: 10px;

            .read-already-wrapper {
              display: flex;
              justify-content: flex-end;
              align-items: flex-start;
              position: relative;
              opacity: 0.5;
              animation: blinking 3s ease-in-out infinite;

              .read-already {
                font-size: 1rem;
                font-family: Chango;
                background-color: rgb(14, 146, 2);
                padding: 10px;
                border-radius: 10px;

              }
            }

            .category {
              position: relative;
              height: 100%;
              border-radius: 10px;
              overflow: hidden;
              z-index: 20;
              padding: 7px;
              font-size: 1.5rem;
              font-weight: 800;
              box-shadow: rgba(2, 11, 26, 0.534) 3px 3px 3px 2px;
              transition: all 0.2s ease-in-out;
              background-color: var(--color-nav-txt);
              color: var(--color-nav-bg);



              a {
                position: absolute;
                bottom: 0;
                right: 0;
                height: 100%;
                width: 100%;
              }
            }

            .category:hover {
              background-color: var(--color-nav-bg);
              color: var(--color-nav-txt);
              cursor: pointer;
            }
          }

          img {
            width: 100%;
            height: 100%;
            object-fit: fill;
          }
        }
      }

      .posts-permalink {
        position: absolute;
        height: 400px;
        width: 450px;
        z-index: 10;
      }

      .posts-permalink:hover~.posts-text-area {
        color: var(--color-nav-txt);
        background: var(--color-nav-bg);

        svg :deep(.timer-1) {
          fill: var(--color-nav-txt);
        }

        svg :deep(.timer-2) {
          fill: var(--color-nav-txt);
        }

        svg :deep(.eye-1) {
          fill: var(--color-nav-bg) !important;
        }

        svg :deep(.eye-2) {
          fill: var(--color-nav-txt) !important;
        }
      }

      .posts-text-area {
        position: relative;
        width: 100%;
        height: 40%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-radius: 20px;
        padding: 10px;
        flex-direction: column;
        justify-content: space-between;
        word-wrap: break-word;
        transition: background 0.2s ease-in-out, color 0.2s ease-in-out;
        backface-visibility: hidden;
        font-size: 1rem;
        font-family: Roboto Condensed;

        .text-data {
          position: relative;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          width: 100%;

          .title-date-wrapper {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 3px;

            .posts-title {
              font-size: 1.6rem;
              font-weight: 700;
            }

            .posts-date {
              position: relative;
              font-style: italic;
            }

          }


        }

        .post-data {
          font-family: Roboto Condensed;
          font-size: 1rem;
          font-weight: 700;
          right: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 5px;

          svg {
            height: 25px;
            width: auto;
          }

          .time-wrapper {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 5px;

            .time {
              display: flex;
            }
          }

          .watched-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            gap: 5px;

            svg :deep(.eye-1, .eye-2) {
              transition: all 0.2s ease-in-out;
            }

            svg :deep(.eye-1) {
              fill: var(--color-nav-txt);
            }

            svg :deep(.eye-2) {
              fill: var(--color-nav-bg);
            }
          }
        }
      }
    }
  }

  .fade-move,
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  }

  /* 2. declare enter from and leave to state */
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateX(100vw);
  }

  .fade-leave-active {
    position: absolute;
  }

  .search-move,
  .search-enter-active,
  .search-leave-active {
    transition: all 0.2s cubic-bezier(0.55, 0, 0.1, 1);
  }

  /* 2. declare enter from and leave to state */
  .search-enter-from,
  .search-leave-to {
    opacity: 0;
  }

  .search-leave-active {
    position: absolute;
  }

  /* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */

  .fadeLoading-enter-active,
  .fadeLoading-leave-active {
    transition: opacity 0.3s ease-in;
  }

  .fadeLoading-leave-from,
  .fadeLoading-leave-to {
    opacity: 0;
  }
}
</style>
