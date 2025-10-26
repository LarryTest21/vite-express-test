<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, computed } from "vue";
import "jquery";
import $ from "jquery";
import { isMobile } from "../store/isMobile";
import axios from "axios";
import EventsModule from "../components/landing/EventsModule.vue";

const checkMobile = computed(()=>isMobile().state);
</script>

<template>
  <div class="landing-wrapper" :class="checkMobile ? 'mobile' : 'desktop'" ref="landing">
    <div id="section1" class="section-landing section1">
      <div class="section-wrapper">
        <div class="title-wrapper">
          <img src="../assets/images/events2.png" alt="" />
          <h1>Upcoming events</h1>
        </div>
        <EventsModule class="events-module" />
      </div>
    </div>

    <div id="section2" class="section-landing section2">
      <div class="section-wrapper">
        <div class="title-wrapper">
          <h1>Upcoming events</h1>
        </div>
      </div>
    </div>
    <div id="section3" class="section-landing section3">
      <div class="section-wrapper">
        <div class="title-wrapper">
          <h1>Upcoming events</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section-wrapper {
  position: relative;
  height: calc(100dvh - 50px);
}



.landing-wrapper {
  height: 100%;
  width: 100%;

  .section-landing {
    height: 100vh;
    font-size: 70px;
    -webkit-font-smoothing: antialiased;

    .section-wrapper {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      position: relative;
      width: 100%;
      top:70px;
      padding: 50px;
      right: 0;
      margin: 0 auto;

      .title-wrapper {
        position:relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;

        img {
          width:100%;
          height: 100%;
          position: absolute;
          object-fit: cover;
          opacity: 0.3;

          animation: flicker 5s ease-in-out infinite;

          @keyframes flicker {
            10% {
              opacity: 0.3;
            }

            50% {
              opacity: 0.2;
            }

            100% {
              opacity: 0.3;
            }
          }
        }

        h1 {
          position: relative;
          color: var(--color-nav-bg);
          text-shadow: var(--color-nav-txt-darker) 2px 2px 10px;
          text-align: center;
          font-size: 7rem;
          font-family: Chango;
          font-weight: 900;
        }
      }

    }



  }

  .section2 {
    display: flex;

    .section-wrapper {
      h1 {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
      }

      .images-wrapper {
        position: relative;
        width: 150%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;

        .image-carousel {
          transform: translateX(-500px);
          opacity: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          border-radius: 100px;
          width: 40vw;
          height: 70vh;
          margin-block-end: 0em;
          padding-inline-start: 0px;
          overflow: hidden;
          transition: all 500ms ease-in-out;

          img {
            width: 70vw;
            height: 70vh;
            transition: all 500ms ease-in-out;
          }
        }

        .image-carousel.active {
          box-shadow: 10px 10px 10px 15px rgba(black, 0.3);
          transform: translateX(0);
          opacity: 1;
        }

        .image-carousel.active:hover>img {
          scale: 1.1;
        }
      }
    }
  }
}

.landing-wrapper.mobile {

  .section-landing {
    height: 100dvh;

    .section-wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0px;

      .title-wrapper {
        align-items: unset;

        h1 {
          top: 50px;
          padding: 20px;
          font-size: 3rem;
        }
      }
    }

    .events-module {
      position: relative;

    }
  }


}




@media (max-width: 932px) {}
</style>
