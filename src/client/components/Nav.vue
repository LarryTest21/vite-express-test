<script setup lang="ts">
import { RouterLink } from "vue-router";
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useTheme } from "../store/theme";
import $ from "jquery";
import gsap from "gsap";
import LoginTab from "../components/LoginTab.vue";
import UserTab from "../components/UserTab.vue";
import { modalActive } from "../store/modalActive";
import { signedIn } from "../store/signedIn";
import { userTabClick } from "../store/userTabClick";
import { isAdmin } from "../store/isAdmin";
import { getweather } from "./Nav/weather";
import { timeCurrent } from "./Nav/time";
import { userData } from "../store/userData";
import searchIcon from "../components/icons/search.vue";
import { useRouter } from "vue-router";
import { blogSearch } from "../store/blogSearch";
import { blogSearchIcon } from "../store/blogSearchIcon";
import "../components/newAnalytics";
import { log } from "console";

const searchIcon2 = blogSearchIcon();

const searchIconActive = ref();
const router = useRouter();
const searchActive = blogSearch();

watch(
  () => router.currentRoute.value.path,
  (newValue) => {
    if (newValue.toString() === "/bsl") {
      searchIconActive.value = true;
    } else {
      searchIconActive.value = false;
    }
  }
);

const search = ref(false) as any;

const signedInCheck = signedIn();
const displayName = ref();

const notificationArray = ref([]) as any;
const notifCounter = ref(0);
const isActivated = ref();
const showNotif = ref(false);

watch(notificationArray.value, (newValue) => {
  if (!isActivated.value) {
    notifCounter.value = notificationArray.value.length + 1;
  } else {
    notifCounter.value = notificationArray.value.length;
  }
});

const themeCheck = ref(true);

const userD = userData();

if (userD.data != undefined) {
  displayName.value = userD.data.firstName[0] + userD.data.lastName[0];
  if (userD.data.activated) {
    notifCounter.value = userD.data.notificationArray.length + 1;
  } else {
    notifCounter.value = userD.data.notificationArray.length;
  }
  if (userD.data.userSettings.themeCheck) {
    themeCheck.value = true;
  } else {
    themeCheck.value = false;
  }
}

watch(
  signedInCheck,
  (newValue) => {
    console.log(signedInCheck.state);
    setTimeout(() => {
      if (signedInCheck.state) {
        showNotif.value = true;
      } else {
        showNotif.value = false;
      }
    }, 500);

    if (userD.data != undefined) {
      displayName.value = userD.data.firstName[0] + userD.data.lastName[0];
    }
  },
  { deep: true }
);
const isAdminCheck = isAdmin();

const langEn = ref(false) as any;
const langHu = ref(false) as any;

const Logo = new URL("../assets/logos/logo.svg", import.meta.url).href;

//FETCHING LOCATION FOR LANGUAGE

var requestUrl = "https://geolocation-db.com/json/";

$.ajax({
  url: requestUrl,
  type: "GET",
  success: function (json) {
    if (json.country_name == "Hungary") {
      langHu.value = true;
    } else {
      langEn.value = true;
    }
  },
  error: function (err) {
    console.log("Request failed, error= " + err);
  },
});

const loginActivated = ref(false);
loginActivated.value =
  JSON.parse(localStorage.getItem("loggedInBefore")!) || false;
const activateLoginTab = ref(false);

const userTabClicked = userTabClick();

watch(
  showNotif,
  () => {
    console.log("showNotif", showNotif.value);
  },
  { deep: true }
);

watch(
  userTabClicked,
  () => {
    if (userTabClicked.state && signedInCheck.state) {
      showNotif.value = false;
    } else {
      showNotif.value = true;
    }
  },
  { deep: true }
);
const activeLogin = () => {
  if (!activateLoginTab.value) {
    activateLoginTab.value = true;
  } else {
    activateLoginTab.value = false;
  }
};

const closeLoginTab = () => {
  const modalActivation = modalActive();
  if (activateLoginTab.value && !modalActivation.state) {
    activateLoginTab.value = false;
  }
};

const closeProfileTab = () => {
  if (userTabClicked) {
    userTabClicked.state = true;
  }
};

//THEME SCRIPT
const theme = useTheme();

const themeButtonChecked = ref();

if (theme.state === "theme-dark") {
  themeButtonChecked.value = true;
} else if (theme.state === "theme-light") {
  themeButtonChecked.value === false;
}

watch(
  () => theme.state,
  (newvalue) => {
    if (newvalue === "theme-dark") {
      themeButtonChecked.value = true;
    } else if (newvalue === "theme-light") {
      themeButtonChecked.value = false;
    }
  }
);

const themechange = () => {
  if (themeButtonChecked.value) {
    theme.state = "theme-light";
    localStorage.setItem("theme-color", "theme-light");
  } else if (!themeButtonChecked.value) {
    theme.state = "theme-dark";
    localStorage.setItem("theme-color", "theme-dark");
  }
};

const closeTab = () => {
  activateLoginTab.value = false;
};

//WEATHER
const city = ref();
const temp = ref();

const weatherHov = ref(false);
const timeWeatherUp = ref(false);

//TIME CALCULATION
const time = timeCurrent().time;

//WEATHER SCRIPT

//WEATHER HOVERING
const weatherHovered = () => {
  weatherHov.value = true;
};
const weatherUnHovered = () => {
  weatherHov.value = false;
};

//ACTIVATION LOGIN TAB

const navRef = ref();
const UserTabHeight = ref();

onMounted(async () => {
  watch(
    () => userD.data,
    (newValue) => {
      if (newValue === undefined) {
        themeCheck.value = true;
      } else {
        if (userD.data.userSettings != undefined) {
          themeCheck.value = userD.data.userSettings.themeCheck;
        }
      }
    },
    { deep: true }
  );
  const weather = getweather();

  setTimeout(() => {
    city.value = weather.city.value;
    temp.value = weather.temp.value;
  }, 1000);

  gsap
    .from([".nav-links>a, .nav-links>div"], {
      delay: 0.55,
      duration: 0.2,
      stagger: 0.05,
      y: -100,
    })
    .then(() => {
      if (router.currentRoute.value.path === "/bsl") {
        searchIconActive.value = true;
      }
      showNotif.value = true;
    });

  gsap.from(".weather-time", { delay: 0.8, opacity: 0 });
  if (themeCheck.value) {
    gsap.from(".theme-changer-wrapper", { delay: 1, opacity: 0 });
  }

  watch(
    search,
    () => {
      console.log(`output->search.value`, search.value);
    },
    { deep: true }
  );

  const intervalId = setInterval(function () {
    timeWeatherUp.value = true;
    setTimeout(function () {
      timeWeatherUp.value = false;
    }, 2000);
  }, 15000);
});

const notifClickedRef = ref(false);
const notifClicked = (value: any) => {
  notifClickedRef.value = true;
};
</script>

<template>
  <header class="fullNav" ref="navRef">
    <div class="wrapper">
      <nav>
        <ul class="nav-links">
          <TransitionGroup name="hey">
            <RouterLink to="/" key="1">
              <div class="nav-logo">
                <img class="logo" :src="Logo" />
              </div>
            </RouterLink>
            <a class="user-wrapper" key="2">
              <transition name="notif">
                <div class="notif-counter"
                     v-if="notifCounter != 0 && showNotif"
                     @click="notifClicked"
                >
                  {{ notifCounter }}
                </div>
              </transition>

              <div class="login-user-wrapper">
                <TransitionGroup name="user">
                  <a key="1"
                     v-if="signedInCheck.state"
                     class="user"
                     @click.native.prevent="userTabClicked.state = !userTabClicked.state"
                  >
                    {{ displayName }}
                  </a>
                  <a key="2"
                     v-if="!signedInCheck.state && loginActivated"
                     to="/login"
                     class="login"
                     @click.stop.prevent="activeLogin()"
                     :class="activateLoginTab ? 'active' : ''"
                  >
                    <li>Login</li>
                  </a>
                </TransitionGroup>
              </div>
            </a>
            <RouterLink to="/rulebook" key="3">
              <li>Rulebook</li>
            </RouterLink>
            <RouterLink to="/news" key="4">
              <li>News</li>
            </RouterLink>

            <RouterLink to="/bsl" key="5">
              <li>BSL</li>
            </RouterLink>
            <div class="search" v-if="searchIcon2.state" key="6">
              <searchIcon class="searchIcon"
                          @click="searchActive.state = !searchActive.state"
                          key="2"
              />
            </div>
            <RouterLink to="/custom-teams" key="7">
              <li>Custom Teams</li>
            </RouterLink>
            <RouterLink to="/contact" key="8">
              <li>Contact</li>
            </RouterLink>
          </TransitionGroup>
        </ul>

        <div class="wt-wrapper">
          <div @mouseover="weatherHovered"
               @mouseleave="weatherUnHovered"
               :class="[
              'weather-time',
              { active: weatherHov },
              timeWeatherUp ? 'up' : 'down',
            ]"
          >
            <div class="time">{{ time }}</div>
            <div class="weather">
              <div class="city">{{ city }}</div>
              <div class="temp">{{ temp }} Celsius</div>
            </div>
          </div>
        </div>
        <div class="language-wrapper"></div>
        <transition name="fadeLogin">
          <div class="theme-changer-wrapper" v-if="themeCheck">
            <label class="theme-changer">
              <input v-model="themeButtonChecked"
                     type="checkbox"
                     class="button"
                     @click="themechange()"
              />
              <span class="slider round"></span>
            </label>
          </div>
        </transition>

        <transition name="fadeLogin">
          <LoginTab v-if="activateLoginTab && !signedInCheck.state"
                    v-click-away="closeLoginTab"
                    @emitRegister="activateLoginTab = !activateLoginTab"
          />
        </transition>
        <transition name="userTab">
          <UserTab class="usertab"
                   :userData="userData"
                   ref="UserTabHeight"
                   v-if="signedInCheck.state && userTabClicked.state"
                   @notifClicked="notifClicked"
                   v-click-away="closeProfileTab"
                   :isAdminCheck="isAdminCheck.state"
                   :notifCounter="notifCounter"
                   :notificationArray="notificationArray"
                   :closeTab="closeTab"
          />
        </transition>
      </nav>
    </div>
  </header>
</template>

<style scoped lang="scss">
.search {
  position: relative;
  bottom: 0;
  right: 0;
  display: flex;
  height: 100%;
  z-index: 1000;
  padding: 0 30px;
}
.fullNav {
  z-index: 100;
  position: fixed;
  width: 100%;
  height: 70px;

  .notif-wrapper {
    position: absolute;
  }

  .wrapper {
    height: 100%;
    width: 100%;

    nav {
      position: relative;
      background-color: var(--color-nav-bg);
      box-shadow: 4px 8px 5px 0px rgba(0, 0, 0, 0.24);
      gap: 40px;
      height: 100%;
      width: 100vw;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      transition: all 0.5s ease-out;

      .nav-links {
        position: relative;
        height: 100%;
        display: flex;
        margin-block-start: 0;
        padding-inline-start: 0;
        align-items: center;
        max-width: 100%;
        width: 90%;
        .search {
          height: 100%;
          position: relative;
          top: 0;
          display: flex;
          justify-content: center;
          .searchIcon {
            position: relative;
            width: 40px;
            height: auto;
            fill: var(--color-nav-txt-darker);
            cursor: pointer;

            &:hover {
              scale: 1.1;
            }
            &::after {
              content: "";
              height: 100%;
              width: 100%;
              position: absolute;
              box-shadow: #888;
              box-shadow: 0px 5px 15px 5px var(--color-nav-txt-lighter);
              left: 0;
            }
          }
        }

        a {
          color: var(--color-nav-txt);
          text-decoration: none;
          font-size: 1.4rem;
          text-transform: uppercase;
          font-family: Chango;
          height: 100%;
          padding: 0 40px;
          position: relative;
          overflow: hidden;
          li {
            position: relative;
            list-style-type: none;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            transition: all 0.2s;
          }
        }

        a::after {
          content: "";
          height: 100%;
          width: 100%;
          position: absolute;
          box-shadow: #888;
          box-shadow: 0px 5px 15px 5px var(--color-nav-txt-lighter);
          opacity: 0;
          left: 0;
          transition: all 0.2s ease-in-out;
        }

        a:hover::after {
          opacity: 1;
        }
        a:hover {
          background-color: var(--color-nav-bg);
          color: var(--vt-c-nav-text);
        }
        a:first-child::after {
          display: none;
        }
        a:first-child:hover::after {
          display: none;
        }
        a:first-child {
          background-color: transparent;
        }
        a:first-child {
          padding: 0;
          left: 0;
        }
        a:nth-child(2).router-link-exact-active::after {
          height: 0;
          width: 0;
        }
        a:nth-child(2)::after {
          display: none;
        }
        a:nth-child(2):hover::after {
          display: none;
        }
        a.router-link-exact-active:first-child {
          background-color: transparent;
        }
        a.router-link-exact-active {
          color: var(--color-nav-txt-darker);
        }
        a.router-link-exact-active:hover::after {
          opacity: 1;
        }
        a.router-link-exact-active::after {
          opacity: 1;
        }
        .user-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: visible;
          padding: 3px;
          margin: 0 40px;
          width: 100px;
          .notif-counter {
            position: absolute;
            background-color: var(--color-nav-txt-lighter);
            box-shadow: 1px 1px 3px 1px rgba(32, 32, 32, 0.664);
            color: var(--color-nav-bg);
            font-family: Roboto Condensed;
            font-weight: 700;
            font-size: 1.5rem;
            z-index: 1;
            width: 35px;
            height: 35px;
            border-radius: 10%;
            top: 0;
            right: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 3px;
            cursor: pointer;
            animation: fading 2s ease-in-out infinite;
          }

          @keyframes fading {
            0% {
              opacity: 0;
            }

            10% {
              opacity: 1;
            }

            90% {
              opacity: 1;
            }

            100% {
              opacity: 0;
            }
          }

          a {
            cursor: pointer;
            padding: 0;
          }
          .login-user-wrapper {
            position: relative;
            height: 100%;
            width: 100%;
            .login {
              height: 100%;
              width: 100%;
              transition: opacity 0.2s;
              overflow: visible;
              width: 65px;
              height: 65px;
            }

            .login:hover {
              background-color: transparent;
              color: var(--color-nav-txt);
            }

            .user {
              transform: translate(0, 0);
              align-self: center;
              border-radius: 50%;
              display: flex;
              width: 65px;
              height: 65px;

              align-items: center;
              justify-content: center;
              color: var(--color-nav-user-txt);
              background: var(--color-nav-user);
              transition: all 0.1s ease-in-out;

              &:hover {
                background: var(--color-nav-user-hover);
              }

              a {
                position: absolute;
              }
            }
          }
        }

        .nav-logo {
          position: relative;
          left: 0;
          height: 100%;

          .logo {
            height: 70px;
            position: relative;
            padding: 2px;
          }
        }
      }
    }
  }

  .wt-wrapper {
    height: 100%;
    overflow: hidden;
    width: 200px;

    .weather-time {
      top: -35px;
      height: 200%;
      margin-right: 20px;
      display: flex;
      flex-direction: column;
      font-family: Chango;
      font-size: 1.5rem;
      color: var(--color-nav-txt);
      transition: transform 0.1s ease-in-out;

      .weather {
        width: 100%;
        height: 50%;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        align-content: center;

        div {
          width: 100%;
        }
      }

      .time {
        width: 100%;
        height: 50%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        align-content: center;
      }
    }

    .weather-time.up {
      transform: translateY(-50%);
    }

    .weather-time.down {
      transform: translateY(0%);
    }

    .weather-time.active {
      transform: translateY(-50%);
    }
  }

  .language-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    cursor: pointer;

    svg {
      border-radius: 10px;
      width: 50%;
      height: 50%;
    }
  }

  .theme-changer-wrapper {
    height: 100%;
    width: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 25px;

    .theme-changer {
      position: relative;
      width: 60px;
      height: 34px;
    }

    .button {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--color-nav-txt);
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: var(--color-nav-bg);
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }

    /* Rounded sliders */
    .slider.round {
      border-radius: 34px;
    }

    .slider.round:before {
      border-radius: 50%;
    }

    a.router-link-exact-active {
      span {
        transform: scale(1.1);
      }
    }
  }
}

.content-wrapper {
  position: relative;
  height: calc(100vh - 70px);
  bottom: -70px;
}

@keyframes weatherAnimHover {
  0% {
    transform: translateY(0%);
  }

  100% {
    transform: translateY(-50%);
  }
}

@keyframes weatherAnim {
  0% {
    transform: translateY(0%);
  }

  35% {
    transform: translateY(0%);
  }

  40% {
    transform: translateY(-50%);
  }

  50% {
    transform: translateY(-50%);
  }

  55% {
    transform: translateY(0%);
  }

  100% {
    transform: translateY(0%);
  }
}

.fullNav.medium {
  .wrapper {
    nav {
      .nav-links {
        a {
          font-size: 1rem;
        }
      }
    }
  }
}
.user-move,
.user-enter-active,
.user-leave-active {
  transition: all 0.3s ease-in-out;
  opacity: 0;
}
.user-enter-from,
.user-leave-to {
  opacity: 0;
}
.user-leave-to {
  position: absolute;
}

.fadeLogin-enter-active,
.fadeLogin-leave-active {
  transform: translateY(0px);
  transition: transform 0.3s;
}

.fadeLogin-enter-from,
.fadeLogin-leave-to {
  transform: translateY(-300px);
}

.userTab-enter-active,
.userTab-leave-active {
  transform: translateY(0px);
  opacity: 1;
  transition: transform 0.3s;
}

.userTab-enter-from,
.userTab-leave-to {
  transform: translateY(-120%);
}

.notif-enter-active,
.notif-leave-active {
  transform: translateY(0px);
  opacity: 1;
  overflow: hidden;
  transition: transform 0.3s;
}

.notif-enter-from,
.notif-leave-to {
  transform: translateY(-400px);
}

.hey-move,
.hey-enter-active,
.hey-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.hey-enter-from,
.hey-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.hey-leave-active {
  position: absolute !important;
}
</style>
