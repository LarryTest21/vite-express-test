<script setup lang="ts">
import { ref, watch, computed, toRaw, onUnmounted, onMounted } from "vue";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { isLoading } from "../store/isloading";
const differenceBy = require("lodash");
import $ from "jquery";
import { doc, deleteDoc } from "firebase/firestore";
import moment from "moment";

const isLoadingCheck = isLoading();
isLoadingCheck.state = false

const blogPostsRefreshArray = ref([]) as any;
const newsPostsRefreshArray = ref([]) as any;
const newsPostsRefreshed = ref([]) as any;
const differencePosts = ref();
const newsDifferencePosts = ref();
const Logo = new URL("../assets/logos/logo.svg", import.meta.url).href;

const showBlogPostsRefresh = ref(false);
const blogPosts = ref([]) as any;
const newsPosts = ref([]) as any;

const postKind = ref();

const blogRef = firebase.firestore().collection("blogposts");
const newsRef = firebase.firestore().collection("news");

const intervalID = ref() as any;
const blogPostsRefreshed = ref(false);
const transitionList = ref() as any;

const showPosts = ref();

const showNewsButton = () => {
  clearInterval(intervalID.value);

  intervalID.value = setInterval(refreshNewsPostRequest, 2000);
  showPosts.value = "news";
};

watch(showPosts, () => {
  if (showPosts.value === "blog") {
    $(".news-btn").css("background-color", "var(--color-nav-bg)");
    $(".news-btn").css("color", "var(--color-nav-txt)");

    $(".blog-btn").css("background-color", "var(--color-nav-txt)");
    $(".blog-btn").css("color", "var(--color-nav-bg)");
  } else if (showPosts.value === "news") {
    $(".news-btn").css("background-color", "var(--color-nav-txt)");
    $(".news-btn").css("color", "var(--color-nav-bg)");

    $(".blog-btn").css("background-color", "var(--color-nav-bg)");
    $(".blog-btn").css("color", "var(--color-nav-txt)");
  }
});

showPosts.value = "blog";

const showBlogButton = () => {
  clearInterval(intervalID.value);

  intervalID.value = setInterval(refreshBlogPostRequest, 2000);
  showPosts.value = "blog";
};

const deletePost = async (postID:any, post:any) => {
  if ((postKind.value = "blogposts")) {
    blogPosts.value.splice(post, 1);
  }
  if ((postKind.value = "news")) {
    newsPosts.value.splice(post, 1);
  }

  console.log(postID.postID);
};

const initialNewsPostRequest = async () => {
  newsPostsRefreshed.value = true;

  await newsRef
    .get()
    .then((querySnapshot) =>
      querySnapshot.forEach((post) => {
        const check = post.data();
        newsPosts.value.push(check);
      })
    )
    .catch((err) => {
      console.log(err);
    })
    .then(() => {
      isLoadingCheck.state = false
    });
};

const initialBlogPostRequest = async () => {
  blogPostsRefreshed.value = true;

  await blogRef
    .get()
    .then((querySnapshot) =>
      querySnapshot.forEach((post) => {
        const check = post.data();
        blogPosts.value.push(check);
      })
    )
    .catch((err) => {
      console.log(err);
    })
    .then(() => {
      isLoadingCheck.state = false
    });
};
const refreshNewsPostRequest = () => {
  transitionList.value = "fadePosts";
  console.log("refreshNewsPostRequest refreshing");

  newsRef
    .get()
    .then((querySnapshot) =>
      querySnapshot.forEach((post) => {
        newsPostsRefreshed.value = true;
        var check2 = post.data();
        newsPostsRefreshArray.value.push(check2);

        newsDifferencePosts.value = differenceBy(
          newsPostsRefreshArray.value,
          newsPosts.value,
          "postID"
        );

        if (newsDifferencePosts.value.length !== 0) {
          newsPosts.value.push(newsDifferencePosts.value[0]);
          newsPostsRefreshArray.value = [];
          check2 = [];
        } else {
          newsPostsRefreshArray.value = [];
        }
      })
    )
    .then(() => {
      if (newsDifferencePosts.value !== undefined) {
        if (newsDifferencePosts.value.length !== 0) {
          newsPostsRefreshArray.value = [];
          showBlogPostsRefresh.value = false;
        }
      } else {
        console.log("no new posts");
      }
    });
};

const refreshBlogPostRequest = () => {
  transitionList.value = "fadePosts";
  console.log("refreshBlogPostRequest refreshing");
  blogRef
    .get()
    .then((querySnapshot) =>
      querySnapshot.forEach((post) => {
        blogPostsRefreshed.value = true;
        var check2 = post.data();
        blogPostsRefreshArray.value.push(check2);

        differencePosts.value = differenceBy(
          blogPostsRefreshArray.value,
          blogPosts.value,
          "postID"
        );

        if (differencePosts.value.length !== 0) {
          blogPosts.value.push(differencePosts.value[0]);
          blogPostsRefreshArray.value = [];
          check2 = [];
        } else {
          blogPostsRefreshArray.value = [];
        }
      })
    )
    .then(() => {
      if (differencePosts.value !== undefined) {
        if (differencePosts.value.length !== 0) {
          blogPostsRefreshArray.value = [];
          showBlogPostsRefresh.value = false;
        }
      } else {
        console.log("no new posts");
      }
    });
};

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
  }
});

function onBeforeEnter(el:any) {
  el.style.opacity = 0;
  el.style.height = 0;
}

function onEnter(el:any, done:any) {
  gsap.to(el, {
    opacity: 1,
    height: "1.6em",
    delay: el.dataset.index * 0.15,
    onComplete: done,
  });
}

function onLeave(el:any, done:any) {
  gsap.to(el, {
    opacity: 0,
    height: 0,
    delay: el.dataset.index * 0.15,
    onComplete: done,
  });
}

onMounted(() => {
  initialBlogPostRequest();
  initialNewsPostRequest();
});

onUnmounted(() => {
  clearInterval(intervalID.value);
});
const docState = ref("saved");
</script>

<template>
  <div class="editposts-outer">
    <div class="edit-posts-inner">
      <div class="buttons">
        <div class="btn-container"></div>

        <div class="news-blog">
          <input
            class="news-btn"
            type="button"
            @click="showNewsButton"
            value="News"
          />
          <input
            class="blog-btn"
            type="button"
            @click="showBlogButton"
            value="Blog"
          />
        </div>
        <div class="newpost-wrapper">
          <input
            class="create-new-post"
            type="button"
            @click="$router.push('/createpost/newPost')"
            value="+ Create Post"
          />
        </div>
      </div>

      <div class="posts-wrapper">
        <Transition name="slide-up" mode="out-in">
          <div class="transition-wrapper" key="1" v-if="showPosts === 'blog'">
            <div
              class="blog posts-card"
              v-for="(post, value) in blogPosts"
              :key="value"
            >
              <div class="posts">
                <div class="cover-image">
                  <img :src="post.coverImage || Logo" alt="" />
                </div>
                <div class="blogposts-meta">
                  <p class="postTitle">{{ post.postTitle }}</p>
                  <p class="postUploadTime">
                    <p>Post Uploaded First:</p>
                    <p class="time">{{
                      moment(new Date(+post.postID)).format(
                        "MM/DD, YYYY, HH:mm:ss"
                      )
                    }}</p>
                    
                  </p>

                  <p class="postLastUpload">
                    <p>Post Last Updated</p>
                    <p class="time">{{
                      moment(new Date(post.lastUpload.toDate())).format(
                        "MM/DD, YYYY, HH:mm:ss"
                      )
                    }}</p>
                    
                  </p>
                  <p class="postUploadTime">
                    <p>Post Release Date:</p> <p class="time"> {{
                      moment(new Date(post.postDate.toDate())).format(
                        "MM/DD, YYYY, HH:mm:ss"
                      )
                    }}</p>
                    
                   
                  </p>
                  <p class="postAuthor">Author: {{ post.postAuthor }}</p>
                </div>
              </div>
              <div class="functions">
                <input
                  class="edit"
                  type="button"
                  name="edit"
                  value="Edit"
                  @click="$router.push('/createpost/' + post.postID)"
                />
                <input
                  class="delete"
                  type="button"
                  name="delete"
                  value="Delete"
                  @click="deletePost(post, value)"
                />
              </div>
            </div>
          </div>
          <div
            class="transition-wrapper"
            key="2"
            v-else-if="showPosts === 'news'"
          >
            <div
              class="news posts-card"
              v-for="(post2, value2) in newsPosts"
              :key="value2"
            >
              <div class="posts">
                <div class="cover-image">
                  <img :src="post2.coverImage || Logo" alt="" />
                </div>
                <div class="blogposts-meta">
                  <p class="postTitle">{{ post2.postTitle }}</p>
                  <p class="postUploadTime">
                    <p>Post Uploaded First:</p>
                    <p class="time">{{
                      moment(new Date(+post2.postID)).format(
                        "MM/DD, YYYY, HH:mm:ss"
                      ) }}</p>
                  </p>

                  <p class="postLastUpload">
                    <p>Post Last Updated</p>
                    <p class="time">{{
                      moment(new Date(post2.lastUpload.toDate())).format(
                        "MM/DD, YYYY, HH:mm:ss"
                      )
                    }}</p>                 
                  </p>
                  <p class="postUploadTime">
                    <p>Post Release Date:</p> 
                  <p>{{
                      moment(new Date(post2.postDate.toDate())).format(
                        "MM/DD, YYYY, HH:mm:ss"
                      )
                    }}</p>                
                  </p>
                  <p class="postAuthor">Author: {{ post2.postAuthor }}</p>
                </div>
              </div>

              <div class="functions">
                <input
                  class="edit"
                  type="button"
                  name="edit"
                  value="Edit"
                  @click="$router.push('/createpost/' + post2.postID)"
                />
                <input
                  class="delete"
                  type="button"
                  name="delete"
                  value="Delete"
                  @click="deletePost(post2, value2)"
                />
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
input[type="button"] {
  position: relative;
  font-family: Chango;
  font-size: 2rem;
  border-radius: 18px;
  cursor: pointer;
  padding: 10px;
  color: var(--color-nav-txt);
  border-style: none;
  box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.3);
  background-color: var(--color-nav-bg);
  transition: all 0.3s ease-in-out;
}
input[type="button"]:hover {
  color: var(--color-nav-bg);
  background-color: var(--color-nav-txt);
}
input[type="button"]:active {
  box-shadow: -1px -1px 1px 0.5px rgba(0, 0, 0, 0.3);
}
.editposts-outer {
  position: relative;
  min-height: 100vh;
  width: 100%;
  font-family: Roboto Condensed;
  font-size: 1rem;
  padding-top:70px;
  .edit-posts-inner {
    position: relative;
    left: 0;
    right: 0;
    margin: auto;
    padding: 30px;
    width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .buttons {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: space-around;
      gap: 30px;
      .news-blog {
        display: flex;
        gap: 30px;
      }
      .newpost-wrapper {
        position: relative;
        input[type="button"]:hover {
          color: var(--color-nav-bg) !important;
          background-color: green;
        }
        .create-new-post {
          position: relative;
        }
      }
    }

    .posts-wrapper {
      position: relative;
      min-height: 100%;
      width: 70%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30px;
      gap: 30px;
      .transition-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30px;
      }
      .posts-card {
        position: relative;
        display: flex;
        width: 80%;
        height: 180px;
        background-color: var(--color-nav-bg);
        border-radius: 20px;
        justify-content: flex-start;
        box-shadow: 2px 2px 5px 3px rgba(0, 0, 0, 0.3);
        color: var(--color-nav-txt);
        font-family: Roboto COndensed;
        font-weight: 600;
        padding: 30px;
        gap: 30px;

        .posts {
          position: relative;
          display: flex;
          gap: 30px;
          height: 100%;
          width: 100%;
          .cover-image {
            transition: opacity 0.5s linear;

            width: 100%;
            img {
              transition: opacity 0.5s linear;

              position: relative;
              width: 100%;
              height: 100%;
              border-radius: 10px;
            }
          }
          .blogposts-meta {
            width: 100%;
            transition: opacity 0.5s linear;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-direction: column;

            .postTitle {
              transition: opacity 0.5s linear;
              font-size: 1.5rem;
            }
            .time {
              font-style: italic;
            }
          }
        }
        .functions {
          transition: opacity 0.5s linear;
          position: relative;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          vertical-align: center;
          gap: 30px;
          input[type="button"] {
            font-size: 1.2rem;
          }
          .delete {
            background-color: red !important;
            color: var(--color-nav-bg) !important;
          }
          .delete:hover {
            background-color: rgb(122, 2, 2) !important;
            color: var(--color-nav-bg) !important;
          }
        }
      }
    }
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
