<script setup lang="ts">
import axios from "axios";
import { ref, watch, computed, onUnmounted, onMounted } from "vue";
import moment from "moment";
import SonarLoading from "../components/SonarLoading.vue";

const isLoading = ref(true);
const errorCaught = ref(false);
const newsPosts = ref([]) as any;

const storedPosts = ref()


async function getPosts() {
  isLoading.value = true;
    newsPosts.value = [];
    storedPosts.value = [];

    const API_URL = "/api/content/newsposts"
    axios.get(API_URL).then((res) => {
      console.log(`output->res`,res)
      newsPosts.value = storedPosts.value = res.data
      setTimeout(() => {
        isLoading.value = false;
      }, 600);
    })

  }

onMounted(async () => {

  getPosts()
  
});
</script>

<template>
  <transition name="fadeLoading">
    <SonarLoading v-if="isLoading" />
  </transition>
  <div class="blog-container">
    <div class="wrapper">
      <TransitionGroup name="fadeLoading2">
        <div
          class="blog-posts-ul"
          v-if="!isLoading"
          v-for="post in newsPosts"
          :key="post.postID"
        >
          <div class="posts-card">
            <a
              ><router-link
                :to="/news/ + post.postID"
                key="post.id"
                class="posts-permalink"
              >
              </router-link
            ></a>
            <div class="posts-image">
              <img
                class="post.metadata.hero"
                :src="post.coverImage"
                :alt="post.postTitle"
              />
            </div>

            <div class="posts-text">
              <h1 class="posts-title">{{ post.postTitle }}</h1>
              <p class="posts-date">
                {{
                  moment(new Date(post.postDate)).format(
                    "MMM DD, HH:mm"
                  )
                }}
              </p>
              <p class="posts-excerpt">{{ post.postExcerpt }}</p>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped lang="scss">
@media (min-width: 1024px) {
  .errorCaught {
    position: absolute;
    width: 30%;
    height: 100px;
    top: calc(50% + 35px);
    right: 50%;
    transform: translate(50%, -50%);
    background-color: rgba(146, 14, 14, 0.993);
    border-width: 10px;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    font-size: 2rem;
    font-weight: 900;
    animation: blink 2s infinite;
  }
  @keyframes blink {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  .blog-container {
    position: relative;
    min-height: 100vh;
    padding-top: 70px;
    width: 100vw;

    .wrapper {
      left: 0;
      margin: auto;
      padding-top: 50px;
      display: flex;
      flex-direction: column;
      gap: 30px;
      width: 70vw;

      span {
        margin: auto;
        background-color: var(--color-nav-bg);
        color: var(--color-nav-txt);
        border-radius: 30px;
        font-family: Chango;
        font-size: 4rem;
        font-weight: 400;
        text-align: center;
        margin-bottom: 50px;
      }

      .blog-posts-ul.featured {
        position: relative;
        display: flex;
      }
      .blog-posts-ul {
        padding-inline-start: 0;
        padding: 0 0;
        .posts-card {
          position: relative;
          width: 100%;
          height: 200px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          gap: 10px;
          a:hover ~ .posts-text {
            background: var(--color-nav-bg);
            color: var(--color-nav-txt);
          }
          .posts-image {
            display: inherit;
            height: 100%;
            width: 20%;
            border-radius: 10px;
            box-shadow: rgba(0, 0, 0, 0.2) 5px 5px 10px 5px;
            overflow: hidden;

            img {
              width: 100%;
              object-fit: fill;
            }
          }
        }
        a {
          position: absolute;
          height: 100%;
          width: 100%;
          border-radius: 20px;
          z-index: 10;
        }
        /*       a:hover + .posts-image .posts-date {
            transform: translate(100px);
          } */

        .posts-text {
          width: 100%;
          height: 100%;
          display: flex;
          border-radius: 20px;
          align-items: flex-start;
          justify-content: center;
          padding: 10px;
          flex-direction: column;
          word-wrap: break-word;
          transition: background 0.2s ease-in-out, color 0.2s ease-in-out;
          backface-visibility: hidden;
          font-size: 1rem;
          font-family: Roboto Condensed;
          .posts-title {
            font-size: 1.6rem;
            font-weight: 700;
          }
          .posts-date {
            font-style: italic;
            margin-bottom: 30px;
          }
          .posts-excerpt {
            font-size: 2rem;
          }
        }
      }
    }
  }

  .fadeLoading-enter-active,
  .fadeLoading-leave-active {
    transition: opacity 0.2s ease-in;
  }

  .fadeLoading-leave-to {
    opacity: 0;
  }
  .fadeLoading2-enter-active,
  .fadeLoading2-leave-active {
    transition: opacity 0.5s ease-in;
  }

  .fadeLoading2-enter-from,
  .fadeLoading2-leave-to {
    opacity: 0;
  }
}
</style>
