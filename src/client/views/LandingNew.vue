<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from "vue";
import "jquery";
import $ from "jquery";
import { isMobile } from "../store/isMobile";
import axios from "axios";
import EventsModule from "../components/landing/EventsModule.vue";

const checkMobile = ref(isMobile().state);
</script>

<template>
  <div class="landing-wrapper" :class="checkMobile ? 'mobile' : 'desktop'" ref="landing"
  >
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
        <h1>This is section2</h1>
        <div class="events-wrapper">
          <transition-group name="events"> </transition-group>
        </div>
      </div>
    </div>
    <div id="section3" class="section-landing section3">
      <div class="section-wrapper">
        <h1>This is section3</h1>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
      height: calc(100% - 70px);
      width: 100%;
      padding: 50px;
      top: 70px;
      right: 0;
      margin: 0 auto;
    }
  }
  .section1 {
    position: relative;
    .events-module {
      
    }
    .title-wrapper {
      z-index: 10;
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        object-fit: cover;
        opacity: 0.05;

        animation: flicker 20s ease-in-out infinite;
        @keyframes flicker {
          10% {
            opacity: 0.08;
          }
          20% {
            opacity: 0.09;
          }
          30% {
            opacity: 0.1;
          }
          40% {
            opacity: 0.05;
          }
          50% {
            opacity: 0.07;
          }
          60% {
            opacity: 0.04;
          }
          70% {
            opacity: 0.09;
          }
          80% {
            opacity: 0.04;
          }
          90% {
            opacity: 0.1;
          }
          100% {
            opacity: 0.08;
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

        .image-carousel.active:hover > img {
          scale: 1.1;
        }
      }
    }
  }
}

.landing-wrapper.mobile {
  .section-landing {
    font-size: 30px;
  }
}

@media (max-width:1200px) {
  .landing-wrapper .section-landing .section-wrapper {
    display:grid;
  }
}

</style>
