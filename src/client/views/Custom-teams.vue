<script setup lang="ts">

import { ref, reactive } from "vue";
import { onMounted } from "vue";
import moment from "moment";



</script>

<template>
  <div class="news-container">
    <div class="wrapper">
      <div class="news-topper">
        <span>Custom Teams</span>
        <transition name="fadeLoading">
          <div class="errorCaught" >
            There was an error loading news
          </div>
        </transition>
      </div>
    
    </div>
  </div>
</template>

<style scoped lang="scss">
@media (min-width: 1024px) {
  .news-container {
    position: relative;
    min-height: 100vh;
    padding-top: 70px;
    width: 100%;

    .wrapper {
      margin: 20px 0;
      width: 100%;
      max-height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .news-topper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .posts-loading {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        top: 50vh;
        transform: translateY(-25vh);
        div {
          width: 300px;
          height: 300px;
          border-radius: 50%;
          display: inline-block;
          border-top: 10px solid var(--color-nav-bg);
          border-right: 10px solid transparent;
          box-sizing: border-box;
          animation: rotation 1s linear infinite;
        }
        div::after {
          content: "";
          box-sizing: border-box;
          position: absolute;
          left: 0;
          top: 0;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          border-left: 10px solid var(--color-nav-bg);
          border-bottom: 10px solid transparent;
          animation: rotation 0.5s linear infinite reverse;
        }
        @keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      }
      .errorCaught {
        text-align: center;
        position: relative;
        width: 30%;
        background-color: rgb(146, 14, 14);
        border-width: 10px;
        padding: 10px;
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

      span {
        margin: auto;
        background-color: var(--color-nav-bg);
        color: var(--color-nav-txt);
        padding: 0 10px;
        border-radius: 30px;
        font-family: Nunito;
        font-size: 4rem;
        font-weight: 900;
        text-align: center;
        margin-bottom: 50px;
      }

      .news-posts-ul {
        margin-left: 80px;
        display: flex;
        flex-direction: column;
        .posts-card {
          margin: 30px 0;
          display: flex;
          gap: 30px;
          align-self: flex-start;

          a {
            position: absolute;
            height: 100%;
            width: 100%;
            z-index: 10;
          }
          a:hover ~ .posts-date {
            transform: translateX(30px);
          }

          a:hover ~ .posts.text {
            transform: translateX(30px);
          }

          img {
            height: 200px;
            width: 300px;
            border-radius: 10px;
            box-shadow: rgba(0, 0, 0, 0.2) 5px 5px 10px 5px;
          }
          .posts-date {
            position: absolute;
            z-index: 7;
            display: inline-block;
            bottom: 0;
            margin: 10px 10px;
            transition: transform 0.08s ease-in-out;
            p {
              color: var(--color-nav-txt);
              background-color: var(--color-nav-bg);
              padding: 0 10px;
              border-radius: 20px;
              display: flex;
              font-size: 1.2rem;
              font-weight: 600;
              font-style: italic;
            }
          }

          .posts-text {
            display: flex;
            flex-direction: column;
            gap: 30px;

            .posts-title {
              font-size: 3rem;
              font-weight: 700;
            }
            .posts-excerpt {
              font-size: 2rem;
            }
          }
        }
      }
    }
  }

  .fadeLoading-enter-active,
  .fadeLoading-leave-active {
    transition: opacity 0.2 ease-in;
  }

  .fadeLoading-enter-from,
  .fadeLoading-leave-to {
    transition: opacity 0.2s ease-out;
    opacity: 0;
  }
}
</style>

<!-- 
<script setup lang="ts">
import { ref } from "vue";
import { onMounted } from "vue";

const post = ref([]);
const isLoading = ref(false);

const getPosts = () => {
  isLoading.value = true;
  fetch("http://localhost/wordpress/?rest_route=/wp/v2/news")
    .then((response) => response.json())
    .then((data) => {
      post.value = data;
      isLoading.value = false;
      console.log(post)
      console.log(post)


    });
};

onMounted(() => {
  getPosts();
});

</script> -->
