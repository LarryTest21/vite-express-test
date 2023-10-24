<!-- <script lang="ts">
import { def } from "@vue/shared";
import { ref } from "vue";
import axios from "axios";
import moment from "moment";


export default {
  name: "news-post",

  data() {
    return {
      slug: this.$route.params.newsSlug,
      postsUrl: "https://localhost/wordpress/wp-json/wp/v2/news",
      queryOptions: {
        slug: this.$route.params.newsSlug,
        _embed: true,
      },
      post: [] as any,
      postLoad: ref(false),
      isLoading: false,
    };
  },

  methods: {
    getPost() {
      this.isLoading = true;
      axios
        .get(this.postsUrl, { params: this.queryOptions })
        .then((response) => {
          this.post = response.data;
          console.log("Pages retrieved!");
          console.log(this.post);

          console.log(this.$route.params.newsSlug);
          console.log(this.post);
        })
        .catch((error) => {
          console.log(error);
        })
        .then(() => {
          this.isLoading = false;
        });
    },
  },
  watch: {
    $route(to, from) {
      this.getPost();
    },
  },
  created() {
    this.getPost();
  },
};
</script> -->

<script setup lang="ts">
import { ref,watch } from "vue";
import { useRoute } from 'vue-router';
import axios from "axios";
import moment from "moment";


const route = useRoute();

      const slug = route.params.newsSlug;
      const postsUrl = "http://localhost/wordpress/wp-json/wp/v2/news";
      const queryOptions = {
        slug: route.params.newsSlug,
        _embed: true,
      };
      const post = ref([] as any);
      const postLoad = ref(false);
      const isLoading = ref(false);

    const getPost = () => {
      isLoading.value = true;
      axios
        .get(postsUrl, { params: queryOptions })
        .then((response) => {
          post.value = response.data;
          console.log("Pages retrieved!");
          console.log(post);

          console.log(route.params.newsSlug);
          console.log(post);
        })
        .catch((error) => {
          console.log(error);
        })
        .then(() => {
          isLoading.value = false;
        });
    };

    watch(route, (to, from) => getPost());

    getPost();
  
</script>

<template>
  <div v-if="!isLoading" class="post-wrapper">
    <div class="post-title">
      <h1>{{ post[0].title.rendered }}</h1>
    </div>
    <div class="post-date">
      {{ moment(post[0].date).format('MMMM Do YYYY, h:mm') }}
    </div>
    <!-- THIS INCLUDES HTML TAGS -->
    <div class="post-content" v-html="post[0].content.rendered"></div>
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
