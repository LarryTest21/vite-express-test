<script setup lang="ts">
import { RouterLink } from "vue-router";
import { ref, watch, onMounted, computed } from "vue";
import { useTheme } from "../../store/theme";
import { signedIn } from "../../store/signedIn";
import LoginTabMobile from "./LoginTabMobile.vue";
import userTabMobile from "./userTabMobile.vue";
import LinksTabMobile from "./LinksTabMobile.vue"
import { isAdmin } from "../../store/isAdmin";
import arrowIcon from "../../components/icons/arrow.vue"
import { useSwipe } from '@vueuse/core'


const props = defineProps({
  userData: Object,
  animEnded: Boolean
})


const emit = defineEmits(['navIconClicked'])

const userWrapper = ref(null)
const { direction } = useSwipe(userWrapper)

watch(direction, (newvalue) => {
  if (newvalue == "left") {
    userTopClick.value = false
  } else if (newvalue == "right") {
    userTopClick.value = true
  }
})


const isAdminCheck = isAdmin();

const themeWrapper = ref(true)
const userTopClick = ref(false)

const theme_checked = ref();
var currentTheme = localStorage.getItem("theme-color");

const loginActivated = ref(false);
const signedInCheck = signedIn();
const activateLoginTab = ref(false);

const arrowIconRef = ref()


const displayName = ref();



const userData = computed(() => props.userData)


if (userData.value != undefined) {
  displayName.value = userData.value.firstName
  themeWrapper.value = userData.value.userSettings.themeCheck
} else {
  watch(userData, (newvalue) => {
    if (newvalue != undefined) {
      displayName.value = userData.value!.firstName
      themeWrapper.value = userData.value!.userSettings.themeCheck
    }
  }, { deep: true })
}




loginActivated.value = JSON.parse(localStorage.getItem("loggedInBefore")!);


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

watch(() => userTopClick.value, (newvalue) => {
  if (newvalue) {
    setTimeout(() => {
      arrowAnim.value = 'back'
    }, 300);
  } else {
    arrowAnim.value = ''
  }
})


const logOut = (e: any) => {
  signedInCheck.state = false
}
const userTabTransition = ref()
onMounted(() => {


  userTabTransition.value = "userTab"

  if (userData.value! != undefined) {
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
    displayName.value = getInitials(initialName.value);

  } else {
    signedInCheck.state = false;
    loginActivated.value = true;
  }

});


const loginTabClicked = () => {
  userTopClick.value = !userTopClick.value
}
</script>

<template>
  <nav :class="currentTheme" class="mobileNav" ref="userWrapper" @wheel.prevent @touchmove.prevent @scroll.prevent>
    <div class="outer">
      <div class="nav-links">
        <RouterLink to="/">
          <div class="nav-logo">
            <transition name="icon">
              <img class="logo" src="/favicon.ico" alt="" @click.native="emit('navIconClicked')" v-if="animEnded" />
            </transition>
          </div>
        </RouterLink>

        <div class="user-wrapper-mobile" @click.native.prevent="loginTabClicked">

          <TransitionGroup name="userLinks">
            <div class="login" v-if="!signedInCheck.state && loginActivated" key="1">Login</div>
            <div class="user" v-if="signedInCheck.state" key="2">
              <div class="name"> {{ displayName }}</div>
              <div class="arrowIcon" ref="arrowIconRef" :class="[{ active: userTopClick }, arrowAnim]">
                <arrowIcon class=" arrowIcon-icon" />
              </div>
            </div>
          </TransitionGroup>

        </div>

        <div class="links-bottom">
          <TransitionGroup :name="userTabTransition">
            <LoginTabMobile class="wrapper" v-if="userTopClick && !signedInCheck.state" key="1" />
            <userTabMobile class="wrapper" v-if="userTopClick && signedInCheck.state" :isAdminCheck="isAdminCheck.state"
              :userData="userData" @logOut="logOut" key="2" @navIconClicked="emit('navIconClicked')" />
            <LinksTabMobile class="wrapper" v-if="!userTopClick" key="3" @click="emit('navIconClicked')" />
          </TransitionGroup>
        </div>
      </div>

      <div class="theme-changer-wrapper" v-if="themeWrapper">
        <label class="theme-changer">
          <input v-model="theme_checked" type="checkbox" class="button" @click="themechange()" :class="currentTheme" />
          <span class="slider round"></span>
        </label>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.mobileNav {
  height: 100%;
  width: 100%;
  position: fixed;
  z-index: 10;

  .outer {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: space-around;

    &::before {
      opacity: 0.95;
      position: absolute;
      height: 100%;
      width: 100%;
      content: "";
    }

    .nav-links {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      font-family: Chango;
      font-size: 2rem;
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

      .user-wrapper-mobile {
        position: relative;
        height: 100px;
        width: 100%;
        color: var(--color-nav-bg);
        background-color: var(--color-nav-txt-darker);
        font-size: 3rem;
        padding: 10px;
        display: flex;


        .user {
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;

          .name {
            position: relative;
            height: 100%;
          }

          .arrowIcon {
            height: 100%;
            fill: var(--color-nav-bg);
            transition: 0.2s ease-in-out;
            animation-direction: reverse;


            .arrowIcon-icon {
              height: 100%;
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
            transform: translateX(-20px) rotate(180deg);
            animation: arrowIcon2;
            animation-fill-mode: forwards;
            animation-duration: 0.3s;
            animation-direction: reverse;
          }

          @keyframes arrowIcon {

            100% {
              transform: translateX(-20px) rotate(180deg);
            }
          }
        }



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
        height: 50px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 10px;
        z-index: 100;

        img {
          height: 40px;
        }
      }

      .links-bottom {
        position: relative;
        height: 100%;

        .wrapper {
          height: 100%;
        }
      }
    }

    .theme-changer-wrapper {
      position: absolute;
      bottom: 0;
      padding: 10px;
      display: flex;

      right: 0;
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

        &.theme-dark {
          .slider {
            background-color: rgb(1, 67, 131);
          }
        }
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



.icon-enter-active,
.icon-leave-active {
  opacity: 1;
  transition: all 0.8s cubic-bezier(.47, -0.5, .39, 1.2);
}

.icon-enter-from,
.icon-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}



.userTab-enter-active,
.userTab-leave-active {
  opacity: 1;
  transition: all 0.5s cubic-bezier(.47, -0.5, .39, 1.2);
}

.userTab-enter-from,
.userTab-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.userTab-leave-active {
  position: absolute;
}

.userLinks-enter-active,
.userLinks-leave-active {
  opacity: 1;
  transition: all 0.8s cubic-bezier(.47, -0.5, .39, 1.2);
}

.userLinks-enter-from,
.userLinks-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.userLinks-leave-active {
  position: absolute;
}
</style>
