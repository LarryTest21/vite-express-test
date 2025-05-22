<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { signedIn } from "../store/signedIn";
import { isAdmin } from "../store/isAdmin";
import router from "../router";
import { useRoute } from "vue-router";
import { userTabClick } from "../store/userTabClick";
import Modal from "../components/Modal.vue";
import { base64NoPFP } from "../components/icons/nopfpbase64";
import bellIcon from "../components/icons/bell.vue";
import axios from "axios";
import { userData } from "../store/userData";




const userPFP = ref();
const noPFP = ref();
const route = useRoute();
const userEmail = ref();
const displayName = ref();
const signedInCheck = signedIn();
const userActivated = ref(false);
const notifClicked = ref(false);
const notifCounter = ref();
const isAdminCheck = isAdmin();

const emit = defineEmits(["closeTab"]);

userPFP.value = localStorage.getItem("avatar") || undefined;

if (localStorage.getItem("avatar") == base64NoPFP) {
  noPFP.value = true;
}
const userD = userData().data;

const notifArray = ref([]) as any;

const checkUserData = () => {
  if (userD != undefined) {
    displayName.value = userD.firstName + userD.lastName;
    userActivated.value = userD.activated;
    userEmail.value = userD.email;
    notifCounter.value = notifArray.value.length + 1;
    if (userD.clearance === "regular") {
      isAdminCheck.state = false;
    } else if (userD.clearance === "admin") {
      isAdminCheck.state = true;
    }
  }
};
checkUserData();

if (
  userPFP.value === 'null' ||
  userPFP.value === '' ||
  userPFP.value === undefined
) {
  userPFP.value = userD.profilePic;
  if (userPFP.value === '' || userPFP.value === undefined) {
    userPFP.value = base64NoPFP;
    localStorage.setItem("avatar", userPFP.value);
    noPFP.value = true;
  } else {
    localStorage.setItem("avatar", userPFP.value);
  }
}

const modalActivation = ref(false);
const modalAnimation = ref(true);
const modalQuestion = ref();
const modalButtonActive = ref(false);

const modalActivationLogout = ref(false);

const userClick = () => {
  const userClick = userTabClick();
  userClick.state = false;
};
const modalAnswer = (t: any) => {
  signedInCheck.state = false;
  isAdminCheck.state = false;

  localStorage.removeItem("loggedIn");
  localStorage.removeItem("userClearance");
  localStorage.removeItem("aT_hsh");
  localStorage.removeItem("savedEvent");
  localStorage.removeItem("savedPost");


  if (t == 1) {
    axios
      .post("/api/user/refresh")
      .then((res) => {
        return res;
      })
      .then((res) => {
        console.log(`output->res`, res);
        var userEmail = { email: localStorage.getItem("email") };
        console.log(`output->userEmail`, userEmail);

        axios
          .post("/api/user/disableAutoLogin/", userEmail)
          .then(() => {
            localStorage.removeItem("autoLogin");
            localStorage.removeItem("email");
            localStorage.removeItem("avatar");
            localStorage.removeItem("loggedIn");
            localStorage.removeItem("savedEvent");
            localStorage.removeItem("savedPost");

          })
          .then(() => {
            axios
              .post("/api/user/logout")
              .then((res) => {
                userData().data = undefined;
              })
              .catch((err) => {
                console.log(err);
              });
          })

          .catch((err) => {
            console.log(err);
          });
      });
  } else if (t == 2) {
    signedInCheck.state = false;
    axios
      .post("/api/user/logout")
      .then((res) => {
        userData().data = undefined;
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        localStorage.removeItem("loggedIn");
      });
  }
  emit('closeTab');
  if (
    route.name === "profile" ||
    route.name === "editposts" ||
    route.name === "createpost" ||
    route.name === "adminpage"
  ) {
    router.push({ name: "landing" });
  }
};

const logOut = () => {
  const AL = userD.userSettings.autoLogin;
  if (AL) {
    modalActivationLogout.value = true;
    modalQuestion.value = "Disable Auto-Login?";
    modalButtonActive.value = true;

  } else {
    axios.post("/api/user/logout").then((res) => {});
    userD.data = undefined;

    signedInCheck.state = false;
    localStorage.removeItem("email");
    localStorage.removeItem("avatar");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("savedEvent");
    localStorage.removeItem("savedPost");


    if (
      route.name === "profile" ||
      route.name === "editposts" ||
      route.name === "createpost" ||
      route.name === "adminpage"
    ) {
      router.push({ name: "landing" });
    }
  }
};

const closeActivatedNotif = () => {
  userActivated.value = !userActivated.value;
  notifCounter.value = notifArray.value.length;
};
const notiTargetfClicked = (s: any) => {
  console.log(s);
};

onMounted(() => {
  watch(
    notifCounter,
    () => {
      console.log(`output->notifCounter`, notifCounter);
    },
    { deep: true }
  );
});
</script>

<template>
  <div class="user-tab-wrapper">
    <div class="user-tab">
      <transition name="modal">
        <Modal class="modal" v-if="modalActivationLogout" spinnerColor="var(--color-nav-txt)" :position="'absolute'"
               :modalAnimation="false" :modalQuestion1="'Yes'" :modalQuestion2="'No'" :backgroundOpacity="0.9"
               :modalQuestion="modalQuestion" @emitAnswer="modalAnswer"
        />
      </transition>
      <div class="usertab-info">
        <div class="usertab-top">
          <div class="userPFP">
            <transition name="modal">
              <Modal v-if="modalActivation" spinnerColor="var(--color-nav-txt)" :position="'absolute'"
                     :modalAnimation="modalAnimation" :backgroundOpacity="1"
              />
            </transition>
            <div class="img-wr">
              <img class="userPFP-img" v-bind:src="userPFP" :class="noPFP ? 'nopfp' : ''"
              />
              <div class="no-pfp" v-if="noPFP">no profile picture</div>
            </div>
            <div class="notif-wr" v-if="notifCounter != 0" @click="notifClicked = !notifClicked"
            >
              <div class="notif-counter">
                {{ notifCounter }}
              </div>
              <div class="notif-counter-icon-wrapper">
                <bellIcon />
              </div>
            </div>
          </div>
          <div class="user-text">
            <p class="displayName">{{ displayName }}</p>
            <p class="userEmail">{{ userEmail }}</p>
          </div>
        </div>
        <div class="usertab-links">
          <router-link @click.native.prevent="userClick" to="/profile"
            >Profile</router-link
          >
          <router-link @click.native.prevent="userClick" to="/createpost/newPost"
            >Create Post</router-link
          >
          <router-link @click.native.prevent="userClick" to="/createevent/newEvent"
            >Create Event</router-link
          >
          <router-link @click.native.prevent="userClick" to="/editpostslist" v-if="!isAdminCheck.state"
            >Edit Posts</router-link
          >
          <router-link @click.native.prevent="userClick" to="/adminpage" v-if="isAdminCheck.state"
            >Admin Page</router-link
          >
          <a @click.stop.prevent="logOut()">Logout</a>
        </div>
      </div>
      <transition name="notif">
        <div class="notification-wrapper" v-if="notifClicked">
          <transition name="activated">
            <ul v-if="userActivated" class="notifications">
              <li class="activate notif" @click="closeActivatedNotif">
                Please activate your account
              </li>
            </ul>
          </transition>

          <ul class="notifications" v-for="notif in notifArray">
            <li class="notif" @click="notiTargetfClicked(notif)">
              {{ notif }}
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-tab-wrapper {
  position: fixed;
  z-index: -1;
  top: 75px;
  left: 5%;

  .user-tab {
    border-radius: 5px;
    font-size: 1.5rem;
    font-family: Chango;
    color: var(--color-nav-txt) !important;
    box-shadow: 4px 8px 5px 0px rgba(0, 0, 0, 0.3);

    .modal {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    ul {
      position: relative;
      height: 50px;
      z-index: 10;
      background-color: var(--color-nav-bg);
      border-top: var(--color-nav-txt) 2px solid;
      display: flex;
      border-radius: 3px;
      overflow: hidden;
      list-style: none;
      padding-inline-start: 0;
      margin-block-start: 0;
      margin-block-end: 0;

      li {
        display: flex;
        padding-inline-start: 0;
        width: 100%;
        align-items: center;
        justify-content: flex-start;
        height: 100%;
        transition: all 0.1s ease-in-out;
        padding-left: 10px;
      }

      li::before {
        content: "\A";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--color-nav-txt);
        margin-right: 10px;
      }

      li:first-child {
        border-top: transparent;
      }

      li:hover {
        cursor: pointer;
        background-color: var(--color-nav-bg-darker);
        color: var(--color-nav-bg-darker);
      }
    }

    .notification-wrapper {
      position: absolute;
      margin-left: 10px;
      top: 20px;
      left: 100%;
      color: var(--color-nav-txt);
      font-family: Roboto Condensed;
      font-weight: 700;
      font-size: 1.4rem;
      display: flex;
      flex-direction: column;
      width: 300px;
      height: 100%;
      z-index: -1;
      gap: 10px;
      .notifications {
        position: relative;
        display: flex;
        flex-direction: column;
        list-style: none;
        padding-inline-start: 0;
        background-color: var(--color-nav-bg);
        width: 100%;
        box-shadow: 4px 2px 3px 2px rgba(0, 0, 0, 0.534);
      }

      .notif:hover {
        background-color: transparent;
        color: var(--color-nav-bg);
      }

      .notif::before {
        content: "";
        position: absolute;
        z-index: -1;
        width: 100%;
        border-radius: 0;
        left: -150%;
        height: 100%;
        background-color: var(--color-nav-txt-lighter);
        transition: all 0.2s ease-in-out;
      }

      .notif:hover::before {
        left: 0%;
        transform: rotate(0deg);
      }
    }

    .usertab-info {
      background-color: var(--color-nav-bg);
      border-radius: 5px;
      z-index: 10;

      .usertab-top {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .userPFP {
          position: relative;
          display: flex;
          flex-direction: row;
          height: 100%;
          width: 100%;
          align-items: center;
          justify-content: center;

          .userPFP-img.nopfp {
            opacity: 0.2;
          }

          .no-pfp {
            position: absolute;
            display: flex;
            font-size: 0.8rem;
            justify-content: center;
            text-align: center;
            align-items: center;
            height: 100%;
            width: 100%;
          }

          .add-pfp {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;

            input[type="button"] {
              position: relative;
              width: 50%;

              z-index: 1000;
              padding: 0 0;
              font-family: Chango;
              font-size: 16px;
              border-radius: 18px;
              cursor: pointer;
              height: 40px;
              color: var(--color-nav-txt) !important;
              border-style: none;
              background-color: var(--color-nav-bg);
              transition: all 0.1s ease-in-out;
            }

            input[type="button"]:hover {
              color: var(--color-nav-bg) !important;
              background-color: var(--color-nav-txt);
            }
          }

          .img-wr {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 10px;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .notif-wr {
            position: relative;
            width: 100%;
            height: 100%;
            transition: all 0.1s ease-in-out;
            border-radius: 10px;
            display: flex;
            justify-content: flex-end;
            padding: 10px;

            .notif-counter {
              position: absolute;
              background-color: rgb(32, 97, 1);
              color: var(--color-nav-bg);
              font-family: Roboto Condensed;
              font-weight: 700;
              font-size: 1.2rem;
              z-index: 1;
              right: 10px;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              transition: all 0.2s;
            }

            .notif-counter-icon-wrapper {
              position: relative;
              height: 100%;
              width: 100%;
              display: flex;
              flex-direction: row;
              justify-content: flex-end;
              transition: all 0.1s ease-in-out;
              border-radius: 10px;

              &:hover {
                cursor: pointer;
                background-color: var(--color-nav-txt);
                svg {
                  stroke: var(--color-nav-bg);
                }
              }

              svg {
                position: relative;
                fill: none;
                stroke: var(--color-nav-txt);
                stroke-width: 6px;
                animation: bell 3s ease-in-out infinite;
                transform-origin: top;
                transition: all 0.1s ease-in-out;
              }

              @keyframes bell {
                35% {
                  transform: rotate(0);
                }

                40% {
                  transform: rotate(-20deg);
                }

                45% {
                  transform: rotate(20deg);
                }

                50% {
                  transform: rotate(-20deg);
                }

                55% {
                  transform: rotate(20deg);
                }

                60% {
                  transform: rotate(-20deg);
                }

                65% {
                  transform: rotate(0);
                }
              }
            }
          }
        }

        .user-text {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          padding: 0 0 0 10px;
          margin-bottom: 10px;

          .displayName {
            font-family: Chango;
            text-align: right;
            padding-right: 5px;
          }

          .userEmail {
            position: relative;
            width: 100%;
            background-color: var(--color-nav-txt);
            color: var(--color-nav-bg);
            padding: 5px 0.3rem;
            border-radius: 10px 0 0 10px;
            font-size: 0.8rem;
          }
        }
      }
    }

    .usertab-links {
      display: flex;
      flex-direction: column;
      width: 100%;

      a {
        position: relative;
        width: 100%;
        text-align: left;
        text-decoration: none;
        font-size: 1.3rem;
        text-transform: uppercase;
        font-family: Chango;
        padding: 0 1rem;
        transition:
          font 0.1s,
          background-color 0.3s;
        padding: 10px;
        height: 100%;
        color: var(--color-nav-txt);
      }

      a:hover {
        background-color: var(--color-nav-txt);
        color: var(--color-nav-txt-hover);
        cursor: pointer;
        border-radius: 0 0 3px 3px;
      }

      a :nth-last-child {
        border-radius: 20px;
      }
    }
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease-out;
  opacity: 1;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.notif-enter-active,
.notif-leave-active {
  transition: all 0.2s ease-out;
  opacity: 1;
}

.notif-enter-from,
.notif-leave-to {
  opacity: 0;
  transform: translatex(-180px);
}

.activated-enter-active,
.activated-leave-active {
  transition: all 0.2s ease-out;
  opacity: 1;
}

.activated-enter-from,
.activated-leave-to {
  opacity: 0;
  transform: translatex(-180px);
}
</style>
