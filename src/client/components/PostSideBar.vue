<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { useRoute } from "vue-router";

import moment from "moment";
import $ from "jquery";
import "jquery";
import "firebase/compat/auth";

const route = useRoute();

const sidebar = ref();

defineExpose({
  sidebar,
});

const props = defineProps({
  Slug: String,
  Posts: Array,
});

watch(
  () => props.Posts,
  () => {
    sideBarPosts.value = props.Posts;
  }
);

const sideBarPosts = ref(props.Posts) as any;

const sideBarPostsFiltered = ref([]) as any;
const postSlug = ref(props.Slug);
sideBarPostsFiltered.value = sideBarPosts.value;
postSlug.value = props.Slug;

sideBarPosts.value = sideBarPosts.value.filter(
  (item: any) => item.postID !== props.Slug
);

sideBarPosts.value = sideBarPosts.value.slice(0, 3);
onMounted(() => {});
</script>

<template>
  <div class="side-container" ref="sidebar">
    <div class="side-wrapper">
      <div class="blog-posts"
           v-for="latest in sideBarPosts">
        <div class="posts-card">
          <a
            ><router-link :to="latest._id"
                          key="latest.id"
                          class="posts-permalink"
            >
            </router-link
          ></a>
          <img class="posts-featuredimage" :src="latest.coverImage" />
          <div class="posts-text">
            <div class="posts-title">{{ latest.postTitle }}</div>
            <div class="posts-date">
              <p>
                {{
                  moment(new Date(latest.postDate)).fromNow(true) + " " + "ago"
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.side-container {
  position: relative;
  top: 0;
  right: 0;
  background-color: var(--color-nav-bg);
  border-radius: 5px;
  box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.4);

  .side-wrapper {
    position: sticky;
    .blog-posts {
      position: relative;
      display: flex;
      color: var(--color-nav-txt);
      transition: all 0.1s ease-in-out;
      &:hover {
        color: var(--color-nav-bg);

        background-color: var(--color-nav-txt);
      }
      .posts-card {
        position: relative;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: 10px;
        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          height: 5px;
          width: 90%;
          left: 0;
          right: 0;
          margin: auto;
          border-radius: 30px;
          background-color: var(--color-nav-txt);
        }
        a {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        img {
          padding: 10px;
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 15px;
        }
        .posts-text {
          padding: 20px;
          line-height: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
          font-family: Roboto Condensed;
          .posts-title {
            font-size: 1.4rem;
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
</style>
