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


watch(() => props.Posts, () => {
  sideBarPosts.value = props.Posts;
})

const sideBarPosts = ref(props.Posts) as any;

const sideBarPostsFiltered = ref([]) as any;
const postSlug = ref(props.Slug);
sideBarPostsFiltered.value = sideBarPosts.value;
postSlug.value = props.Slug;

sideBarPosts.value = sideBarPosts.value.filter(
    (item:any) => item.postID !== props.Slug,
  );

  sideBarPosts.value = sideBarPosts.value.slice(0,3)
onMounted(() => {

})

</script>

<template>
  <div class="side-container" ref="sidebar">
    <div class="side-wrapper">
      <ul
        class="blog-posts-ul"
        v-for="latest in sideBarPosts"
      >
        <div class="posts-card">
          <a
            ><router-link
              :to="latest._id"
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
            <div class="posts-author">
              {{ latest.postAuthor }}
            </div>
          </div>
        </div>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.side-container {
  top: 0;
  right: 0;
  .side-wrapper::before {
    position: absolute;
    content: "";
    height: 100%;
    left: 20px;
    width: 10px;
    background-color: var(--color-text);
    border-radius: 20px;
  }
  .side-wrapper {
    position: sticky;
    .blog-posts-ul {
      position: relative;
      display: flex;

      .posts-card {
        position: relative;
        height: 100px;
        width: 280px;
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
          width: 100px;
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
</style>
