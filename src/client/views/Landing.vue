<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import "jquery";
import $ from "jquery";
import { isMobile } from "../store/isMobile";
import { stopScroll } from "../store/stopScroll";

const checkMobile = ref(isMobile());
const frontImages = ref([] as any);
const imageStart = ref(false);
var imageGoing = ref(null as any);

var isScrolling = false;

var isScrolling = false;
const landing = ref();

const scrollFunction = (event: any) => {
  if (!stopScroll().state) {
    if (isScrolling) {
      //Preventdefault wheel event
      event.preventDefault();
    } else {
      if (
        // SCROLLING UP
        event.deltaY < 0
      ) {
        var $target = $(".section-landing.active").prev(".section-landing");

        if ($target.length == 0) {
        } else {
          isScrolling = true;

          $target = $(".section-landing.active").prev(".section-landing");
          $(".section-landing").removeClass("active");
          $target.addClass("active");

          $("html, body").animate(
            {
              scrollTop: $target?.offset()?.top,
            },
            600,
            function () {
              isScrolling = false;
            }
          );
        }

        if ($target.hasClass("section2")) {
          $(".dot").removeClass("up");
          $(".dot").removeClass("down");
          $(".ring-3 > div").addClass("up");
        }
        if ($target.hasClass("section1")) {
          $(".dot").removeClass("up");
          $(".dot").removeClass("down");
          $(".ring-2 > div").addClass("up");
        }

        if ($target.hasClass("section1")) {
          setTimeout(() => {
            $(".ring > div").removeClass("dot-active");
            $(".ring-1 > div").addClass("dot-active");
          }, 600);
        }
        if ($target.hasClass("section2")) {
          setTimeout(() => {
            $(".ring > div").removeClass("dot-active");
            $(".ring-2 > div").addClass("dot-active");
          }, 600);
        }
        if ($target.hasClass("section3")) {
          setTimeout(() => {
            $(".ring > div").removeClass("dot-active");
            $(".ring-3 > div").addClass("dot-active");
          }, 600);
        }
        if ($target.length == 0) {
        }
      } else if (
        // SCROLLING DOWN
        event.deltaY > 0
      ) {
        isScrolling = true;

        var $target = $(".section-landing.active").next(".section-landing");

        if ($target.length == 0) {
          $target = $(".section-landing:first");
          $(".section-landing.active").removeClass("active");
          $target.addClass("active");

          $("html, body").animate(
            {
              scrollTop: $target?.offset()?.top,
            },
            800,
            function () {
              isScrolling = false;
            }
          );
        } else {
          $target = $(".section-landing.active").next(".section-landing");
          $(".section-landing").removeClass("active");
          $target.addClass("active");

          $("html, body").animate(
            {
              scrollTop: $target?.offset()?.top,
            },
            600,
            function () {
              isScrolling = false;
            }
          );
        }

        if ($target.hasClass("section2")) {
          $(".dot").removeClass("down");
          $(".dot").removeClass("up");
          $(".ring-1 > div").addClass("down");
        }
        if ($target.hasClass("section3")) {
          $(".dot").removeClass("down");
          $(".dot").removeClass("up");
          $(".ring-2 > div").addClass("down");
        }

        if ($target.hasClass("section2")) {
        }

        if ($target.hasClass("section1")) {
          setTimeout(() => {
            $(".ring > div").removeClass("dot-active");
            $(".ring-1 > div").addClass("dot-active");
          }, 600);
        }
        if ($target.hasClass("section2")) {
          setTimeout(() => {
            $(".ring > div").removeClass("dot-active");
            $(".ring-2 > div").addClass("dot-active");
          }, 600);
        }
        if ($target.hasClass("section3")) {
          setTimeout(() => {
            $(".ring > div").removeClass("dot-active");
            $(".ring-3 > div").addClass("dot-active");
          }, 600);
        }
        if ($target.length == 0) {
          setTimeout(() => {
            $(".ring-3 > div").addClass("dot-active");
          }, 600);
        }
      }
    }
  }
};

function imageChange() {
  var $target = $(".image-carousel.active").next();
  if ($target.length == 0) {
    $target = $(".image-carousel:first").addClass("active");
  }

  $(".image-carousel.active").removeClass("active");
  $target.addClass("active");
}

function hoveredImage() {
  clearInterval(imageGoing);
}
function unHoveredImage() {
  imageGoing = setInterval(imageChange, 2500);
}

onMounted(() => {
  $(".dots-list > a > li > div:first").addClass("dot-active");
  $(".section-landing:first").addClass("active");
  window.addEventListener("wheel", scrollFunction, { passive: false });

  $(".dots-list > a").on("click", function (event) {
    event.preventDefault();
    $(".dots-list > a > li > div").removeClass("dot-active");

    const href = event.currentTarget.getAttribute("href") as any;
    event.currentTarget.querySelector(".dot")?.classList.add("dot-active");
    $(".dots-list > a > li > div").removeClass("active");
    $(".dots-list > a > li > div").removeClass("up");
    $(".dots-list > a > li > div").removeClass("down");

    $(".landing-wrapper > div").removeClass("active");

    if ($(".dot-active").hasClass("1")) {
      $(".section1").addClass("active");
    }

    if ($(".dot-active").hasClass("2")) {
      $(".section2").addClass("active");
    }

    if ($(".dot-active").hasClass("3")) {
      $(".section3").addClass("active");
    }

    isScrolling = true;
    $("html, body").animate(
      { scrollTop: $(href)?.offset()?.top },
      600,
      function () {
        isScrolling = false;
      }
    );
  });
});

onUnmounted(() => {
  window.removeEventListener("wheel", scrollFunction);
});

onUnmounted(() => {
  window.removeEventListener("wheel", scrollFunction);
});
</script>

<template>
  <div class="page-indicator-wrapper" :class="checkMobile ? 'mobile' : ''">
    <ul class="dots-list">
      <a href="#section1" class="dots-list-link">
        <li class="ring ring-1">
          <div class="dot 1"></div>
        </li>
      </a>
      <a href="#section2" class="dots-list-link">
        <li class="ring ring-2">
          <div class="dot 2"></div>
        </li>
      </a>
      <a href="#section3" class="dots-list-link">
        <li class="ring ring-3">
          <div class="dot 3"></div>
        </li>
      </a>
    </ul>
  </div>

  <div class="landing-wrapper" :class="checkMobile ? 'mobile' : ''" ref="landing"
  >
    <div id="section1" class="section-landing section1">
      <div class="section-wrapper">
        <h1>This is section 1</h1>
      </div>
    </div>

    <div id="section2" class="section-landing section2">
      <div class="section-wrapper">
        <h1>This is section2</h1>
        <div class="images-wrapper">
          <transition-group name="carousel">
            <ul class="image-carousel" v-for="(image, index) in frontImages" :key="index"
            >
              <img @mouseover="hoveredImage" @mouseleave="unHoveredImage" class="image" :src="image.imgix_url"
                   :alt="image" :key="index"
              />
            </ul>
          </transition-group>
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
.page-indicator-wrapper {
  position: fixed;
  right: 0;
  width: 100px;
  top: 70px;
  height: calc(100% - 70px);
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;

  .dots-list {
    position: absolute;
    right: 0;
    margin-right: 25px;

    a li {
      list-style-type: none;
    }

    .ring {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: solid 3px var(--color-nav-bg);
      display: inline-block;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .ring-2 {
      margin: 15px 0;
    }

    .dots-active {
      background-color: var(--color-nav-bg);
      animation: bounce 0.5s 1;
      animation-direction: forwards;
    }

    .dot {
      position: relative;
      backface-visibility: hidden;
      height: 18px;
      width: 18px;
      border-radius: 50%;
      transition:
        height 0.2s ease-in-out,
        width 0.2s ease-in-out,
        border-radius 0.2s ease-in-out,
        translate 0.2s ease-in-out;
    }

    .dot.dot-active {
      background-color: var(--color-nav-bg);
    }

    .dot.down {
      animation: down 0.6s forwards;
    }

    .dot.up {
      animation: up 0.6s forwards;
    }
  }

  @keyframes down {
    0% {
    }

    50% {
    }

    80% {
    }

    100% {
      transform: translate(0, 51px);
    }
  }

  @keyframes up {
    0% {
    }

    50% {
      border-radius: 20px;
    }

    80% {
    }

    100% {
      transform: translate(0, -51.1px);
    }
  }

  @keyframes bounce {
    0% {
      transform: scale(1);
    }
  }
}

.landing-wrapper {
  height: 100%;
  width: 100%;

  .section-landing {
    height: 100vh;
    font-size: 70px;
    -webkit-font-smoothing: antialiased;

    .section-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      position: relative;
      height: calc(100% - 70px);
      width: 80%;
      top: 70px;
      right: 0;
      margin: 0 auto;
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

</style>
