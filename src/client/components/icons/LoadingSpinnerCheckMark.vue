<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import $ from "jquery";

const emit = defineEmits(["animationCompleted"]);

const props = defineProps({
  saveingCompleted: Boolean,
});

const complete = computed(() => props.saveingCompleted);

watch(
  complete,
  (newv) => {
    if (newv === true) {
      $(".check").attr("class", "check check-complete");
      $(".fill").attr("class", "fill fill-complete");
      setTimeout(() => {
        $(".check").attr("class", "check check-complete success");
        $(".fill").attr("class", "fill fill-complete success");
        $(".path").attr("class", "path path-complete");
      }, 200);
      setTimeout(() => {
        emit("animationCompleted", true);
      }, 700);
    }
  },
  { deep: true }
);

// const completed = () => {
//   setTimeout(function () {
//     $(".check").attr("class", "check check-complete");
//     $(".fill").attr("class", "fill fill-complete");
//   }, 5000);

//   setTimeout(function () {
//     $(".check").attr("class", "check check-complete success");
//     $(".fill").attr("class", "fill fill-complete success");
//     $(".path").attr("class", "path path-complete");
//   }, 6000);
// };
</script>

<template>
  <div class="checkmark">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" x="0px" y="0px"
         viewBox="0, 0, 100, 100" id="checkmark"
    >
      <g transform="">
        <circle class="path" fill="none" stroke="#7DB0D5" stroke-width="10" stroke-miterlimit="10" cx="50" cy="50" r="44"
        />
        <circle class="fill" fill="none" stroke="#7DB0D5" stroke-width="10" stroke-miterlimit="10" cx="50" cy="50" r="44"
        />
        <polyline class="check" fill="none" stroke="#7DB0D5" stroke-width="10" stroke-linecap="round" stroke-miterlimit="10" points="70,35 45,65 30,52  "
        />
      </g>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.checkmark {
  margin: 0 auto;
  z-index: 10;
}

.path {
  stroke-dasharray: 300;
  stroke-dashoffset: 0;
  -webkit-animation-name: load, spin;
  -webkit-animation-duration: 3s, 3s;
  -webkit-animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;
  animation-name: load, spin;
  animation-duration: 3s, 3s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  -webkit-transform-origin: 50% 50%;
  -moz-transform-origin: 50px 50px;
}

.path-complete {
  -webkit-animation-play-state: paused;
  animation-play-state: paused;
}

.check {
  stroke-dasharray: 110;
  stroke-dashoffset: -110;
  stroke-width: 0;
}

.check-complete {
  animation: check 0.5s ease-in forwards;
  stroke-width: 15;
  stroke-dashoffset: 0;
}

.fill {
  stroke-dasharray: 285;
  stroke-dashoffset: -257;
  -webkit-animation: spin-fill 2s cubic-bezier(0.7, 0.435, 0.12, 0.6) infinite
    forwards;
  animation: spin-fill 2s cubic-bezier(0.7, 0.465, 0.12, 0.6) infinite forwards;
  -webkit-transform-origin: 50% 50%;
  -moz-transform-origin: 50px 50px;
}

.fill-complete {
  -webkit-animation: fill 0.5s ease-out forwards;
  animation: fill 0.5s ease-out forwards;
}

@-webkit-keyframes load {
  0% {
    stroke-dashoffset: 300;
    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    stroke-dashoffset: 0;
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    stroke-dashoffset: -300;
  }
}
@keyframes load {
  0% {
    stroke-dashoffset: 285;
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    stroke-dashoffset: 0;
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    stroke-dashoffset: -285;
  }
}

@-webkit-keyframes check {
  0% {
    stroke-dashoffset: -110;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes check {
  0% {
    stroke-dashoffset: -110;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes spin-fill {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(720deg);
  }
}
@keyframes spin-fill {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(720deg);
  }
}

@-webkit-keyframes fill {
  0% {
    stroke-dashoffset: 285;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes fill {
  0% {
    stroke-dashoffset: 285;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

.success {
  stroke: #009900;
  transition: stroke 0.3s;
}
</style>
