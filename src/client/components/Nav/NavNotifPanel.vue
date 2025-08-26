<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { userData } from "../../store/userData";
import axios from "axios";
import { AnyARecord } from "node:dns";
import { useRouter } from "vue-router";
import { useElementVisibility } from '@vueuse/core'
import type { ComponentPublicInstance } from 'vue'
import blogIcon from "../icons/blog.vue";


const router = useRouter();
const notifAnim = ref("0.9s");

const notifRefs = ref<HTMLElement[]>([])
const animationDisabledIndices = ref<number[]>([]);
const hoveredIndex = ref(null)

const registerRef = (el: any, index: any) => {
  if (!el) return

  el.addEventListener('mouseenter', () => {
    if (hoveredIndex.value === null) {
      hoveredIndex.value = index
    }
  })
}


type PostNotification = {
  postID: string;
  [key: string]: any; // Optional: for flexibility
};

type SystemNotification = {
  notifMessage: string;
  [key: string]: any;
};

const emit = defineEmits(["closeNotifPanel", "openNotifPanel"]);

const notifArray = ref(userData().data.notificationArray);

const notiTargetfClicked = (notif: any) => {
  if (notif.postID != undefined) {
    router.push("/blog/" + notif._id);
    emit("closeNotifPanel");
  }
};
const hoveredNotif = computed(() =>
  hoveredIndex.value !== null ? notifArray.value[hoveredIndex.value] : null
)

// Log hovered object to console whenever it changes
watch(hoveredNotif, (notif) => {
  if (notif) {
    console.log('✨ Hovered notif:', notif)
    setTimeout(() => {
      if (hoveredIndex.value !== null) {
        userData().data.notificationArray[hoveredIndex.value].isSeen = true
        console.log(userData().data.notificationArray)
      }
    }, 1000);

  } else {
    console.log('🧯 Hover cleared')
  }
})
onMounted(async () => {
  setTimeout(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const index = notifRefs.value.findIndex(el => el === entry.target)
        if (index !== -1) {
          console.log(`Notification ${index} is ${entry.isIntersecting ? 'in view' : 'NOT in view'}`)
        }
      })
    })

    notifRefs.value.forEach(el => {
      if (el) observer.observe(el)
    })
  }, 2000)

});
</script>

<template>
  <div class="notification-wrapper">
    <div :ref="el => registerRef(el, index)" class="notif-inner" v-for="(notif, index) in notifArray"
      @click="notiTargetfClicked(notif)"
      :class="[{ last: index === notifArray.length - 1 }, { hovered: index === hoveredIndex }]">
      <div class="notif" v-if="notif.postID === undefined" :class="{ 'regular': notif.postID === undefined }">
        <div class="notif-message" style="grid-area: left;">
          {{ notif.notifMessage }}
        </div>
        <transition name="notifFade">
          <div class="notif-icon-wr" style="grid-area: center;">
            <div class="notif-icon" />
          </div>
        </transition>


        <div class="notif-date" style="grid-area: right;">
          {{
            (() => {
              const elapsed = Date.now() - notif.notifDate;

              if (elapsed < 180000) return "just now"; const minutes = Math.floor(elapsed / (1000 * 60)); const
                hours = Math.floor(elapsed / (1000 * 60 * 60)); const days = Math.floor(elapsed / (1000 * 60 * 60 * 24)); if
                (days >= 1) {
                return `${days} day${days > 1 ? "s" : ""} ago`;
              } else if (hours >= 1) {
                return `${hours} hour${hours > 1 ? "s" : ""} ago`;
              } else {
                return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
              }
            })()
          }}
        </div>
      </div>
      <div class="notif" v-if="notif.postID != undefined" :class="{ 'post': notif.postID === undefined }">
        <div class="title-text" style="grid-area: left;">
          <div class="post-title">
            {{ notif.postTitle }}
          </div>
          <img :src="notif.coverImage" class="image" />
        </div>
        <div class="read-icons" :class="{ 'animate': !notif.isSeen }" style="grid-area: center;">
          <blogIcon class="blog-icon" />
        </div>

        <div class="notif-date" style="grid-area: right;">
          {{
            (() => {
              const elapsed = Date.now() - notif.postID;

              if (elapsed < 180000) return "just now"; const minutes = Math.floor(elapsed / (1000 * 60)); const
                hours = Math.floor(elapsed / (1000 * 60 * 60)); const days = Math.floor(elapsed / (1000 * 60 * 60 * 24)); if
                (days >= 1) {
                return `${days} day${days > 1 ? "s" : ""} ago`;
              } else if (hours >= 1) {
                return `${hours} hour${hours > 1 ? "s" : ""} ago`;
              } else {
                return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
              }
            })()
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.notification-wrapper {
  box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.329);

  position: fixed;
  z-index: -1;
  width: 400px;
  top: 75px;
  background-color: var(--color-nav-bg);
  border-radius: 10px;
  margin: 10px;
  overflow: hidden;

  .notif-inner {
    position: relative;
    width: 100%;
    height: 100%;
    padding-inline-start: 0;
    position: absolute;
    padding: 10px;
    margin: 0;
    text-align: left;
    position: relative;
    width: 100%;
    height: 100%;
    cursor: pointer;
    font-family: Roboto;
    transition: all 0.1s ease-in-out;
    border-bottom: 2px solid var(--color-nav-bg-darker);



    &.last {
      border-bottom: none;
    }

    .notif {
      width: 100%;
      display: grid;
      grid-template-columns: 4fr 1fr 1fr;
      grid-template-areas:
        "left center right";
      gap: 10px;
      font-size: 1.2rem;
      font-family: Roboto;
      gap: 10px;

      .notif-message {
        display: flex;
        align-items: center;
      }

      .title-text {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        height: 100px;

        /* or whatever works for your layout */
        .post-title {
          grid-column: 1;
          grid-row: 2;
          width: 100%;
        }

        img {
          position: relative;
          grid-column: 2;
          grid-row: 1 / span 2;
          /* This makes it span both rows */
          background-color: #f08080;
          width: 60px;
          height: 40px;
          max-height: 100%;
          top: 0;
          border: 1px solid var(--color-nav-txt);
          border-radius: 5px;
          justify-self: center;
          align-self: center;
        }
      }

      .notif-date {
        display: flex;
        justify-self: center;
        align-self: center;
        font-size: 0.8rem;
        text-align: center;
        font-family: Roboto;
      }

      .notif-icon-wr {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }

          50% {
            transform: scale(1.7);
            opacity: 0.3;
          }

          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .notif-icon {
          position: relative;
          width: 10px;
          height: 10px;
          background-color: var(--color-nav-txt-darker);
          border-radius: 50%;
          right: 0;
          left: 0;
          margin: auto;
          animation: pulse v-bind(notifAnim) infinite;

        }

        .noAnimation .notif-icon {
          animation: none !important;
        }
      }



      .read-icons {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .blog-icon {
          height: 50px;
          width: auto;
          color: var(--color-nav-txt-lighter);
          stroke-width: 6;
          transition: all 0.1s ease-in-out;
        }
      }
    }

    &.hovered {
      .notif {
        .notif-icon-wr {
          .notif-icon {
            animation: none !important
          }
        }
      }
    }

    &:hover {
      background-color: var(--color-nav-txt);
      color: var(--color-nav-bg);

      .notif {
        .read-icons {
          .blog-icon {
            color: white;

          }
        }
      }

    }
  }
}



</style>
