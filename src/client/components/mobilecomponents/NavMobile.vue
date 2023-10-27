<script setup lang="ts">
import { RouterLink } from "vue-router";
import { ref, watch, onMounted, computed } from "vue";
import { useTheme } from "../../store/theme";
import { signedIn } from "../../store/signedIn";
import { userClickedMobile } from "../../store/userClickMobile";
import { userLoginClickMobile } from "../../store/userLoginClickMobile";
import LoginTabMobile from "./LoginTabMobile.vue";
import userTabMobile from "./userTabMobile.vue";
import LinksTabMobile from "./LinksTabMobile.vue"
import { mobileIconClicked } from "../../store/mobileIconClicked";
import { isAdmin } from "../../store/isAdmin";
import arrowIcon from "../../components/icons/arrow.vue"
import { useSwipe } from '@vueuse/core'
import gsap from "gsap";


const userWrapper = ref(null)
const { isSwiping, direction } = useSwipe(userWrapper)

watch(direction, (newvalue) => {
  if (signedInCheck.state) {
    if (newvalue == "left") {
      userTabClicked.state = false
    } else if (newvalue == "right") {
      userTabClicked.state = true
    }
  }
})


const isAdminCheck = isAdmin();

const themeWrapper = ref()
const userTabClicked = userClickedMobile();
const mobileIClicked = mobileIconClicked();
const userLoginClick = userLoginClickMobile();

const theme_checked = ref();
var currentTheme = localStorage.getItem("theme-color");

const loginActivated = ref(false);
const signedInCheck = signedIn();
const activateLoginTab = ref(false);

const arrowIconRef = ref()


const props = defineProps({
  userData: Object,
})

const userData = ref(props.userData)
loginActivated.value = JSON.parse(localStorage.getItem("loggedInBefore")!);
console.log(`output->loginActivated.value`, loginActivated.value)



const displayName = ref();
console.log(`output->userData`, userData)
if (userData.value != undefined) {
  displayName.value = props.userData!.firstName
  themeWrapper.value = props.userData!.userSettings.themeCheck
}

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
  changeTheme.state = 'theme-dark'
} else if (currentTheme === "theme-light") {
  theme_checked.value = true;
  const changeTheme = useTheme();
  changeTheme.state = 'theme-light'
} else {
  localStorage.setItem("theme-color", "theme-dark");
}

const themechange = () => {
  currentTheme = localStorage.getItem("theme-color");
  if (currentTheme === "theme-dark") {
    theme_checked.value = false;
    currentTheme = "theme-light";
    const changeTheme = useTheme();
    changeTheme.state = 'theme-light'
    localStorage.setItem("theme-color", "theme-light");
  } else if (currentTheme === "theme-light") {
    theme_checked.value = true;
    currentTheme = "theme-dark";
    const changeTheme = useTheme();
    changeTheme.state = 'theme-dark'
    localStorage.setItem("theme-color", "theme-dark");
  } else {
    const changeTheme = useTheme();
    changeTheme.state = 'theme-light'
    theme_checked.value = true;
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
const initialName = ref()

const arrowAnim = ref('')

watch(() => userTabClicked.state, (newvalue) => {
  if (newvalue) {
    setTimeout(() => {
      arrowAnim.value = 'back'
    }, 300);
  } else {
    arrowAnim.value = ''
  }
})


const logOut = (e: any) => {
  userTabClicked.state = false
  userData.value = undefined
}

onMounted(() => {

  gsap.from(".links>a", {
    delay: 0.3,
    duration: 0.2,
    stagger: 0.05,
    x: -400,
  })

  if (userData.value != undefined) {
    signedInCheck.state = true;
    activateLoginTab.value = false;

    var getInitials = function (name: any) {
      var parts = name.split(" ");
      var initials = "";
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].length > 0 && parts[i] !== "") {
          initials += parts[i][0];
        }
      }
      return initials;
    };

    initialName.value = userData.value!.firstName + " " + userData.value!.lastName;
    console.log(`output->initialName.value`, initialName.value)
    displayName.value = getInitials(initialName.value);

  } else {
    signedInCheck.state = false;
    loginActivated.value = true;
  }
  watch(userData, (newvalue) => {
    if (newvalue === undefined) {
      console.log(`output->loginActivated`, loginActivated)
      console.log("itsfalse")
      signedInCheck.state = false
    }
  }, { deep: true })
});


</script>

<template>
  <header class="mobileNav" @wheel.prevent @touchmove.prevent @scroll.prevent>
    <div class="wrapper">
      <nav :class="currentTheme">
        <ul class="nav-links" ref="userWrapper">
          <RouterLink to="/">
            <div class="nav-logo">
              <img class="logo" src="/favicon.ico" alt="" @click.native="mobileIClicked.state = false" />
            </div>
          </RouterLink>
          <TransitionGroup name="userLinks">

            <a class="login-wrapper" v-if="!signedInCheck.state && loginActivated"
              @click.native.prevent="userLoginClick.state = !userLoginClick.state" key="1">Login</a>
            <a class="user-wrapper" v-if="signedInCheck.state" key="2">
              <a key="1" class="user" @click.native.prevent="
                userTabClicked.state = !userTabClicked.state
                ">
                {{ displayName }}
              </a>
              <div class="arrowIcon" ref="arrowIconRef" :class="[{ active: userTabClicked.state }, arrowAnim]">
                <arrowIcon class=" arrowIcon-icon" />
              </div>
            </a>

          </TransitionGroup>

          <div class="links-usertab-login">
            <TransitionGroup name="userTab">
              <LoginTabMobile v-if="userLoginClick.state && !signedInCheck.state" />
              <userTabMobile v-if="userTabClicked.state" @click.native="mobileIClicked.state = false"
                :isAdminCheck="isAdminCheck.state" :userData="userData" @logOut="logOut" />
              <LinksTabMobile />
            </TransitionGroup>
          </div>
        </ul>

        <div class="theme-changer-wrapper" v-if="themeWrapper">
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

        .login-wrapper {
          padding: 10px;
          color: var(--color-nav-bg);
          background-color: var(--color-nav-txt);
        }

        .links-usertab-login {
          height: 100%;
          width: 100%;
          display: flex;

          .links {
            width: 100%;
            display: flex;
            flex-direction: column;



            a.router-link-exact-active {
              background-color: var(--color-nav-txt-darker);
              color: var(--color-nav-bg-darker);
            }

            a.router-link-exact-active:hover {
              background-color: var(--color-nav-txt);
              color: var(--color-nav-bg);
            }

            a:hover {
              color: var(--color-nav-bg)
            }
          }
        }

        .nav-logo {
          display: flex;
          justify-content: center;
          margin: 10px 0;

          img {
            height: 100px;
          }
        }

        .user-wrapper {
          position: relative;
          margin-bottom: 20px;
          height: 60px;
          width: 100%;
          display: flex;
          background-color: var(--color-nav-txt);

          .login {
            height: 100%;
            width: 100%;
            transition: opacity 0.2s;
          }

          .user {
            position: relative;
            display: flex;
            width: 100%;
            margin-left: 10px;
            color: var(--color-nav-bg);
            display: flex;
            font-size: 3rem;
            align-items: center;
          }

          .arrowIcon {
            height: 100%;
            fill: var(--color-nav-bg);
            transition: 0.2s ease-in-out;
            margin-right: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 10px;
            animation-direction: reverse;

            .arrowIcon-icon {
              height: 80%;
              width: auto;
              transition: all 0.3s ease-in-out
            }
          }


          .arrowIcon.active {
            animation: arrowIcon;
            animation-fill-mode: forwards;
            animation-duration: 0.3s;
          }

          .arrowIcon.back {
            transform: rotate(180deg);
            animation: arrowIcon2;
            animation-fill-mode: forwards;
            animation-duration: 0.3s;
            animation-direction: reverse;
          }

          @keyframes arrowIcon {
            100% {
              transform: rotate(180deg);
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
  transform: translateX(0%);
  transition: all 0.2s cubic-bezier(.47, -0.5, .39, 1.43);
}

.userTab-enter-from,
.userTab-leave-to {
  opacity: 0;

  transform: translateX(-100%);
}

.userLinks-enter-active,
.userLinks-leave-active {
  opacity: 1;
  transition: all 0.3s ease-in-out;
}

.userLinks-enter-from,
.userLinks-leave-to {
  opacity: 0;
}

.userLinks-leave-active {
  position: absolute;
}
</style>
