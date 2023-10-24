<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import moment from "moment";
import Cosmic from "cosmicjs";

const route = useRoute();

/*   const postsUrl = "http://localhost/wordpress/wp-json/wp/v2/news";
      const queryOptions = {
        slug: route.params.newsSlug,
        _embed: true,
      };
      const post = ref([] as any);
      const isLoading = ref(false);

    const getPost = () => {
      isLoading.value = true;
      axios
        .get(postsUrl, { params: queryOptions })
        .then((response) => {
          post.value = response.data;

        })
        .catch((error) => {
          console.log(error);
        })
        .then(() => {
          isLoading.value = false;
        });
    };

    watch(route, (to, from) => getPost());

    getPost(); */

const post = ref<any>({});
const isLoading = ref(false);
const latestPosts = ref<any>({});

const api = Cosmic();

const bucket = api.bucket({
  slug: "c27229f0-9018-11ed-b853-65fa50acc7e7",
  read_key: "VLZQGABHjrhQj4iMYuvEXEfPRHZPnWt5CACFaIJB68PeteSwVX",
});

async function fetchData() {
  isLoading.value = true;
  const data = await bucket.objects
    .find({
      type: "news",
      slug: route.params.newsSlug,
    })
    .props("slug,title,content,metadata"); // Limit the API response data by props
  console.log(route.params.blogSlug);
  post.value = data.objects;
  isLoading.value = false;
  console.log(post);
}

fetchData();

watch(route, (to, from) => fetchData());


</script>

<template>
  <div v-if="!isLoading" class="post-wrapper">
    <div class="post-title">
      <h1>{{ post[0].title }}</h1>
    </div>
    <div class="post-date">
      {{ moment(post[0].date).format("MMMM Do YYYY, h:mm") }}
    </div>
    <!-- THIS INCLUDES HTML TAGS -->
    <div class="post-content" v-html="post[0].content"></div>
  </div>
</template>

<style scoped lang="scss">
.post-wrapper {
  min-height: 100vh;
  width: 70%;
  padding-top: 70px;
  padding-left: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .post-date {
    font-family: Roboto Condensed;
    font-size: 1.5rem;
    font-weight: 700;
  }
}
</style>
