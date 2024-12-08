<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from "axios";
import router from "../../router";
import editButton from "../../components/icons/edit.vue";
import moment from "moment";
import { userData } from "../../store/userData";
import $ from "jquery";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const eventsArray = ref();

const showEditButton = ref();

const eventsWrapper = ref();

const eventTransition = ref();

const isScrolling = ref(false);

const showScroll = ref();

if (userData().data != undefined) {
  showEditButton.value = true;
} else {
  watch(
    () => userData(),
    (newvalue) => {
      if (newvalue.data != undefined) {
        newvalue.data.clearance === 'admin'
          ? (showEditButton.value = true)
          : (showEditButton.value = false);
      } else {
        showEditButton.value = false;
      }
    },
    { deep: true }
  );
}

const editEvent = (id: any) => {
  router.push({ path: "/CreateEvent/" + id });
};
const eventRef = ref(0) as any;

const onWheel = (e: any) => {
  if (isScrolling.value === false) {
    if (e.deltaY > 0) {
      isScrolling.value = true;

      eventTransition.value = 'left';
      const index = eventsArray.value.findIndex(
        (event: any) => event.active === true
      );

      if (index === eventsArray.value.length - 1) {
        isScrolling.value = false;
        delete eventsArray.value[index].active;
        eventsArray.value[0].active = true;
        gsap.to('.event', {
          duration: 0.8,
          ease: "back.out(1.7)",
          x: 0,
        });
        setTimeout(() => {
          gsap.to('.event.active', {
            duration: 0.6,
            scale: 1,
            webkitFilter: "blur(" + 0 + "px)",
            height: '80%',
            width: '60%',
          });
          gsap.to('.event:not(.active)', {
            duration: 0.6,
            scale: 1,
            webkitFilter: "blur(" + 10 + "px)",
            height: '50%',
            width: '30%',
          });
        }, 2);
      } else {
        delete eventsArray.value[index].active;
        eventsArray.value[index + 1].active = true;
        setTimeout(() => {
          gsap.to('.event.active', {
            duration: 0.6,
            scale: 1,
            webkitFilter: "blur(" + 0 + "px)",
            height: '80%',
            width: '60%',
          });
          gsap.to('.event:not(.active)', {
            duration: 0.6,
            scale: 1,
            webkitFilter: "blur(" + 10 + "px)",
            height: '50%',
            width: '30%',
          });
        }, 1);

        gsap.to('.event', {
          duration: 0.8,
          ease: "back.out(1.7)",
          x: -180 * (index + 1),
        });
        setTimeout(() => {
          isScrolling.value = false;
        }, 700);
      }
    } else if (e.deltaY < 0) {
      isScrolling.value = true;
      const index = eventsArray.value.findIndex(
        (event: any) => event.active === true
      );

      if (index === 0) {
        isScrolling.value = false;
        delete eventsArray.value[0].active;
        eventsArray.value[eventsArray.value.length - 1].active = true;
        gsap.to('.event', {
          duration: 0.8,
          ease: "back.out(1.7)",
          x: -400,
        });
        setTimeout(() => {
          gsap.to('.event.active', {
            duration: 0.6,

            scale: 1,
            webkitFilter: "blur(" + 0 + "px)",
            height: '80%',
            width: '60%',
          });

          gsap.to('.event:not(.active)', {
            duration: 0.6,
            scale: 1,
            webkitFilter: "blur(" + 10 + "px)",
            height: '50%',
            width: '30%',
          });
        }, 2);
      } else {
        delete eventsArray.value[index].active;
        eventsArray.value[index - 1].active = true;

        if (index === 2) {
          gsap.to('.event', {
            duration: 0.8,
            ease: "back.out(1.7)",
            x: -190,
          });
          setTimeout(() => {
            gsap.to('.event.active', {
              duration: 0.6,
              scale: 1,
              webkitFilter: "blur(" + 0 + "px)",
              height: '80%',
              width: '60%',
            });
            gsap.to('.event:not(.active)', {
              duration: 0.6,

              scale: 1,
              webkitFilter: "blur(" + 10 + "px)",
              height: '50%',
              width: '30%',
            });
          }, 1);
        } else if (index === 1) {
          gsap.to('.event', {
            duration: 0.8,
            ease: "back.out(1.7)",
            x: 0,
          });
          setTimeout(() => {
            gsap.to('.event.active', {
              duration: 0.6,

              scale: 1,
              webkitFilter: "blur(" + 0 + "px)",
              height: '80%',
              width: '60%',
            });
            gsap.to('.event:not(.active)', {
              duration: 0.6,

              scale: 1,
              webkitFilter: "blur(" + 10 + "px)",
              height: '50%',
              width: '30%',
            });
          }, 1);
        }

        setTimeout(() => {
          isScrolling.value = false;
        }, 700);
      }
    }
  } else {
    e.preventDefault();
  }
};

onMounted(() => {
  axios
    .get("/api/content/events/")
    .then((res) => {
      eventsArray.value = [...res.data];
    })
    .then(() => {
      eventsArray.value.sort(function compare(a: any, b: any) {
        var dateA = new Date(a.eventDate) as any;
        var dateB = new Date(b.eventDate) as any;

        return dateA - dateB;
      });
      eventsArray.value[0].active = true;
    })
    .then(() => {
      gsap.to('.event.active', {
        scale: 1,
        webkitFilter: "blur(" + 0 + "px)",
        height: '80%',
        width: '60%',
      });
    });
});
</script>

<template>
  <div class="outer-overflow" ref="eventsWrapper">
    <transition-group :name="eventTransition" tag="div" class="events-wrapper" @wheel.prevent="onWheel" @mouseover="showScroll = true" @mouseleave="showScroll = false"
    >
      <template v-for="event in eventsArray" :key="event._id">
        <div class="event" ref="eventRef" :class="(event.active ? 'active' : '') "
        >
          <div class="edit-button" v-if="showEditButton" @click="editEvent(event._id)"
          >
            <editButton class="editButton" />
          </div>

          <div class="img-wrapper">
            <div class="date-wrapper">
              <div class="month">
                {{ moment(new Date(event.eventDate)).format("MMM") }}
              </div>
              <div class="day">
                {{ moment(new Date(event.eventDate)).format("DD") }}
              </div>
              <div class="time">
                {{ moment(new Date(event.eventDate)).format("HH:mm") }}
              </div>
            </div>
            <img :src="event.eventImage" class="event-image" />
          </div>
          <div class="text-outer">
            <div class="text-inner">
              <div class="title">{{ event.eventTitle }}</div>
            </div>
            <!-- <div class="rsvp-button">
          <button>RSVP</button>
        </div> -->
          </div>
        </div>
      </template>
    </transition-group>
  </div>
</template>

<style lang="scss" scoped>
.outer-overflow {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  max-height: 500px;
  display: flex;
  justify-content: center;
  padding: 0px;
  .show-scroll {
    position: absolute;
    z-index: 10;
    color: var(--color-nav-bg);
  }
  .events-wrapper {
    scroll-behavior: none;
    z-index: 1;
    position: relative;
    width: 600%;
    height: 100%;
    border-radius: 5;
    padding: 20px;
    font-family: Chango;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    font-size: 2rem;
    gap: 10px;

    .event {
      z-index: 1;
      border-radius: 20px;
      overflow: hidden;
      background-color: var(--color-nav-bg);
      display: flex;
      flex-direction: column;
      box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.363);
      width: 40%;
      height: 70%;
      filter: blur(5px);

      .edit-button {
        position: absolute;
        right: 5px;
        top: 10px;
        z-index: 1;
        height: 70px;
        width: 70px;
        border-radius: 50%;
        padding: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0px 0px 3px 3px rgba(0, 0, 0, 0.363);
        background-color: var(--color-nav-bg);
        cursor: pointer;
        transition: all 0.1s ease-in-out;
        svg {
          transform: translateX(2px);
          fill: var(--color-nav-txt-darker);
          transition: all 0.1s ease-in-out;
          height: 70px;
          width: 70px;
        }

        &:hover {
          box-shadow: 0px 0px 3px 3px rgba(228, 228, 228, 0.363);
        }
      }
      .img-wrapper {
        position: relative;
        width: 100%;
        height: 70%;
        .date-wrapper {
          width: 100px;
          height: 120px;
          position: absolute;
          display: flex;
          flex-direction: column;
          background-color: var(--color-nav-bg);
          border-radius: 10px;
          color: var(--color-nav-txt-darker);
          align-items: center;
          font-size: 1.5rem;
          overflow: hidden;
          text-align: center;
          margin: 10px;
          bottom: 0;
          box-shadow: 0px 0px 3px 3px var(--color-nav-txt-darker);
          .month {
            text-transform: uppercase;
            padding: 2px;
            text-align: justify;
          }
          .day {
            text-align: justify;
          }
          .time {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            background-color: var(--color-nav-bg-darker);
            color: var(--color-nav-txt-darker);
            text-align: center;
            padding: 2px;
          }
        }
        .event-image {
          object-fit: cover;
          width: 100%;
          height: 100%;
          border-radius: 5px 5px 0 0;
        }
      }
      .text-outer {
        position: relative;
        height: 100%;
        width: 100%;

        .text-inner {
          position: relative;
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 20px;
          margin-left: 10px;
          .title {
            font-size: 2rem;
          }
        }
      }
      .rsvp-button {
        display: flex;
        bottom: 0;
        right: 0px;
        margin: 20px;
        position: absolute;
        button {
          font-size: 2rem;
          border-radius: 10px;
          background-color: var(--color-nav-bg);
          border: none;
          font-family: Chango;
          color: var(--color-nav-txt-darker);
          box-shadow: 1px 1px 3px 3px rgba(85, 85, 85, 0.445);
          cursor: pointer;
          transition: all 0.1s ease-in-out;
          &:hover {
            box-shadow: 0px 0px 10px 3px rgba(212, 212, 212, 0.363);
          }
          &:active {
            box-shadow: inset 1px 1px 5px 1px rgba(34, 34, 34, 0.363);
          }
        }
      }
    }
  }
}
.left-enter-active,
.left-leave-active {
  transition: all 0.7s ease-in-out;
  opacity: 1;
}
.left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.left-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.right-enter-active,
.right-leave-active {
  transition: all 0.7s ease-in-out;
  opacity: 1;
}
.right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.right-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.showScroll-enter-active,
.showScroll-leave-active {
  transition: all 0.1s cubic-bezier(0.55, 0, 0.1, 1.2);
  opacity: 1;
}

.showScroll-enter-from,
.showScroll-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
