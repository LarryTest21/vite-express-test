<script setup lang="ts">
import { RouterLink } from "vue-router";
import { ref, watch, onMounted } from "vue";
import { useTheme } from "../store/theme";
import { modalActive } from "../store/modalActive";
import { signedIn } from "../store/signedIn";
import { userClickedMobile } from "../store/userClickMobile";
import { userTabClick } from "../store/userTabClick";
import { userLoginClickMobile } from "../store/userLoginClickMobile";
import LoginTabMobile from "../components/LoginTabMobile.vue";
import userTabMobile from "../components/userTabMobile.vue";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { mobileIconClicked } from "../store/mobileIconClicked";
import { isAdmin } from "../store/isAdmin";
import arrowIcon from "../components/icons/arrow.vue"

const isAdminCheck = isAdmin();

const userClick = userTabClick();

const userTabClicked = userClickedMobile();
const mobileIClicked = mobileIconClicked();
const userLoginClick = userLoginClickMobile();

const theme_checked = ref();
var currentTheme = localStorage.getItem("theme-color");

const loginActivated = ref(false);
const signedInCheck = signedIn();
const activateLoginTab = ref(false);

loginActivated.value = JSON.parse(localStorage.getItem("loggedIn")!);

const initialName = ref();
const displayName = ref();

const activeLogin = () => {
  if (!activateLoginTab.value) {
    activateLoginTab.value = true;
  } else {
    activateLoginTab.value = false;
  }
};

if (currentTheme === "theme-dark") {
  theme_checked.value = false;
  const changeTheme = useTheme();
  const { changeStateDark } = changeTheme;
  changeStateDark();
} else if (currentTheme === "theme-light") {
  theme_checked.value = true;
  const changeTheme = useTheme();
  const { changeStateLight } = changeTheme;
  changeStateLight();
} else {
  localStorage.setItem("theme-color", "theme-dark");
}

const themechange = () => {
  currentTheme = localStorage.getItem("theme-color");
  if (currentTheme === "theme-dark") {
    theme_checked.value = false;
    currentTheme = "theme-light";
    const changeTheme = useTheme();
    const { changeStateLight } = changeTheme;
    changeStateLight();
    localStorage.setItem("theme-color", "theme-light");
  } else if (currentTheme === "theme-light") {
    theme_checked.value = true;
    currentTheme = "theme-dark";
    const changeTheme = useTheme();
    const { changeStateDark } = changeTheme;
    changeStateDark();
    localStorage.setItem("theme-color", "theme-dark");
  } else {
    const changeTheme = useTheme();
    const { changeStateLight } = changeTheme;
    theme_checked.value = true;
    changeStateLight();
    localStorage.setItem("theme-color", "theme-light");
  }
};

watch(theme_checked, (newValue, oldValue) => {
  localStorage.setItem("theme-checked", JSON.stringify(newValue));
});

theme_checked.value =
  JSON.parse(localStorage.getItem("theme-checked") as string) || false;

//LOGIN
watch(signedIn, (newValue, oldValue) => {
  localStorage.setItem("loggedIn", JSON.stringify(newValue));
});

onMounted(() => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      if (firebase.auth().currentUser?.uid != undefined) {
        signedInCheck.state = true;
        loginActivated.value = true;
        activateLoginTab.value = false;
      }

      signedInCheck.state = true;
      var getInitials = function (name:any) {
        var parts = name.split(" ");
        var initials = "";
        for (var i = 0; i < parts.length; i++) {
          if (parts[i].length > 0 && parts[i] !== "") {
            initials += parts[i][0];
          }
        }
        return initials;
      };
      initialName.value = firebase.auth().currentUser?.displayName;
      displayName.value = getInitials(initialName.value);
    } else {
      signedInCheck.state = false;
    }
  });
});
</script>

<template>
  <header class="mobileNav">
    <div class="wrapper">
      <nav :class="currentTheme">
        <ul class="nav-links">
          <RouterLink to="/">
            <div class="nav-logo">
              <img class="logo" src="/src/assets/logos/logo.svg" alt="" @click.native="mobileIClicked.state = false" />
            </div>
          </RouterLink>
          <a class="login" v-if="!signedInCheck.state && loginActivated"
            @click.native.prevent="userLoginClick.state = !userLoginClick.state">Login</a>
          <a class="user-wrapper">
            <a key="1" v-show="signedInCheck.state" class="user" @click.native.prevent="
              userTabClicked.state = !userTabClicked.state
              ">
              {{ displayName }}
            </a>
            <div class="arrowIcon" :class="userTabClicked.state ? 'active' : ''">
              <arrowIcon class=" arrowIcon-icon" />

            </div>

          </a>

          <div class="links-usertab-login">
            <TransitionGroup name="userTab">
              <LoginTabMobile v-if="userLoginClick.state && !signedInCheck.state" />
            </TransitionGroup>
            <TransitionGroup name="userTab">
              <userTabMobile v-if="userClick" @click.native="mobileIClicked.state = false"
                :isAdminCheck="isAdminCheck.state" />
            </TransitionGroup>
            <TransitionGroup name="userTab">
              <div class="links" v-if="!userTabClicked.state && !userLoginClick.state"
                @click.native="mobileIClicked.state = false">
                <RouterLink to="/rulebook">
                  <li>Rulebook</li>
                </RouterLink>
                <RouterLink to="/news">
                  <li>News</li>
                </RouterLink>
                <RouterLink to="/bsl">
                  <li>BSL</li>
                </RouterLink>
                <RouterLink to="/custom-teams">
                  <li>Custom Teams</li>
                </RouterLink>
                <RouterLink to="/contact">
                  <li>Contact</li>
                </RouterLink>
              </div>
            </TransitionGroup>
          </div>
        </ul>

        <div class="theme-changer-wrapper">
          <label class="theme-changer">
            <input v-model="theme_checked" type="checkbox" class="button" @click="themechange()" :class="currentTheme" />
            <span class="slider round"></span>
          </label>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped lang="scss">
.mobileNav {
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 100;

  .wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: space-around;

    nav {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      position: relative;
      box-shadow: 5px 4px 6px rgba(0, 0, 0, 0.4);

      .nav-links {
        width: 100%;
        height: 100%;
        font-family: Chango;
        font-size: 2rem;
        display: flex;
        flex-direction: column;
        padding: 0 0rem;
        color: var(--color-nav-txt);

        a:hover {
          background-color: var(--color-nav-txt);
          color: var(--vt-c-nav-text-hover);
          cursor: pointer;
        }

        a::after {
          box-shadow: none;
        }

        a {
          text-decoration: none;
          font-size: 2rem;
          text-transform: uppercase;
          font-family: Chango;
          color: var(--color-nav-txt);

          li {
            list-style-type: none;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 10px 10px;
          }
        }

        a.router-link-exact-active:first-child {
          background-color: transparent;
        }

        a.router-link-exact-active:first-child:hover {
          background-color: transparent;
        }

        .login {
          padding: 10px;
          color: var(--color-nav-bg);
          background-color: var(--color-nav-txt);
        }

        .links-usertab-login {
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;

          .links {
            width: 100%;
            display: flex;
            flex-direction: column;

            a.router-link-exact-active:first-child {
              background-color: var(--color-nav-txt);
              color: var(--color-nav-bg);
            }

            a.router-link-exact-active:first-child:hover {
              background-color: var(--color-nav-txt);
            }
          }
        }

        .nav-logo {
          background-color: transparent;
          display: flex;
          justify-content: center;
          margin: 10px 0;

          img {
            height: 20vh;
          }
        }

        .user-wrapper {
          position: relative;
          margin-bottom: 20px;
          display: flex;
          width: 100%;
          background-color: var(--color-nav-txt);
          align-items: center;

          .login {
            height: 100%;
            width: 100%;
            transition: opacity 0.2s;
          }



          .user {
            position: relative;

            display: flex;
            width: 100%;
            padding: 10px;
            color: var(--color-nav-bg);
          }

          .arrowIcon {
            height: 40px;
            fill: var(--color-nav-bg);
            transition: 0.2s ease-in-out;
            margin-right: 20px;
            width: 30px;


            .arrowIcon-icon {
              height: 100%;
              width: 30px;
            }
          }

          .arrowIcon.active {
            animation: arrowIcon;
            animation-fill-mode: forwards;
            animation-duration: 0.3s;

          }

          @keyframes arrowIcon {
            100% {
              transform: translate(80px) rotate(90deg);
            }


          }
        }
      }

      .theme-changer-wrapper {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 10px;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;

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
          background-color: rgb(1, 67, 131);
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
          background-color: rgb(235, 235, 235);
          -webkit-transition: 0.4s;
          transition: 0.4s;
        }

        input:checked+.slider {
          background-color: rgb(235, 235, 235);
        }

        input:checked+.slider:before {
          background-color: rgba(0, 54, 107, 1);
        }

        input:focus+.slider {
          box-shadow: 0 0 1px rgb(1, 67, 131);
        }

        input:checked+.slider:before {
          transform: translateX(26px);
        }

        /* Rounded sliders */
        .slider.round {
          border-radius: 34px;
        }

        .slider.round:before {
          border-radius: 50%;
        }
      }
    }
  }

  .wrapper::before {
    opacity: 0.95;
    position: absolute;
    height: 100%;
    width: 100%;
    content: "";
    background-color: var(--color-nav-bg);
  }
}

.userTab-enter-active,
.userTab-leave-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.3s ease-in-out;
}

.userTab-enter-from,
.userTab-leave-to {
  opacity: 0;

  transform: translateX(-400px);
}
</style>
@/store/userTabClick