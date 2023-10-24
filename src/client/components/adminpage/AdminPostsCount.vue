<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import db from "../../firebase/firebaseInit";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  getCountFromServer,
} from "firebase/firestore";
import Modal from "../../components/Modal.vue";

const blogRef = collection(db, "blogposts");
const newsRef = collection(db, "news");
const blogPostsCount = ref();
const newsPostsCount = ref();

const isLoading = ref(true);

onBeforeMount(() => {
  (async () => {
    const blogs = (await getCountFromServer(blogRef)).data().count;
    const news = (await getCountFromServer(newsRef)).data().count;

    const [result1, result2] = await Promise.all([blogs, news]);
    var array = [result1, result2];
    return array;
  })().then((array) => {
    blogPostsCount.value = array[0];
    newsPostsCount.value = array[1];
    if (array != undefined) {
      setTimeout(() => {
        isLoading.value = false;
      }, 1000);
    }
  });
});
</script>

<template>
  <div class="posts-wrapper">
    <div class="posts-tab-label">Posts Counts</div>
    <router-link class="link" to="/editpostslist">Edit Posts</router-link>
    <div class="posts-inner">
      <div class="blog-posts">
        <transition name="skeleton">
          <div class="skeleton" v-if="isLoading"></div>
        </transition>
        <p>Blog posts count</p>
        <div class="count">
          <p>{{ blogPostsCount }}</p>
        </div>
      </div>
      <div class="news-posts">
        <transition name="skeleton">
          <div class="skeleton" v-if="isLoading"></div>
        </transition>

        <p>News posts count</p>
        <div class="count">
          <p>{{ newsPostsCount }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.link {
  position: absolute;
  margin: 20px;
}

a {
  align-self: flex-end;
  text-decoration: none;
  position: relative;
  font-family: Chango;
  font-size: 1.4rem;
  font-weight: 400;
  right: 0;
  top: 0;
  border-radius: 18px;
  cursor: pointer;
  padding: 10px;
  color: rgb(139, 7, 7);
  border-style: none;
  background-color: var(--color-nav-bg);
  transition: all 0.2s ease-in-out;
  box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.3);

}

a:hover {
  color: rgb(243, 243, 243);
  background-color: rgb(172, 83, 83);
  ;
}

a:active {
  box-shadow: -1px -1px 1px 0.5px rgba(0, 0, 0, 0.3);
}

.posts-wrapper {
  position: relative;
  width: 450px;
  height: 300px;
  background: var(--color-nav-bg);
  color: var(--color-nav-txt);
  font-size: 1.5rem;
  font-family: Roboto Condensed;
  font-weight: 800;
  border-radius: 20px;
  gap: 30px;
  display: flex;
  flex-direction: column;

  .posts-tab-label {
    font-size: 2.4rem;
    padding: 20px;
    background-color: rgb(139, 7, 7);
    border-radius: 15px 15px 0 0;
    color: var(--color-nav-bg);
    height: 90px;
  }

  .posts-inner {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 20px;

    .skeleton {
      position: absolute;
      z-index: 10;
      width: 100%;
      height: 100%;
      border-radius: 7px;
      background: linear-gradient(100deg,
          rgba(255, 255, 255, 0) 40%,
          rgba(255, 255, 255, 0.384) 50%,
          rgba(255, 255, 255, 0) 60%) #c7c7c7;
      background-size: 200% 100%;
      background-position-x: 180%;
      animation: 0.8s loading ease-in-out infinite;
    }
  }

  .count {
    position: relative;
    width: 30%;
    height: 100%;
    display: flex;
    justify-content: center;

    p {
      height: 100%;
      display: flex;
      justify-content: center;
    }
  }

  @keyframes loading {
    to {
      background-position-x: -20%;
    }
  }

  p {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .blog-posts {
    position: relative;
    width: 100%;
    display: flex;
    gap: 50px;
  }

  .news-posts {
    position: relative;
    width: 100%;
    display: flex;
    gap: 50px;
  }
}

.skeleton-enter-active,
.skeleton-leave-active {
  transition: all 0.4s ease-in-out;
  opacity: 1;
}

.skeleton-enter-from,
.skeleton-leave-to {
  opacity: 0;
}</style>
