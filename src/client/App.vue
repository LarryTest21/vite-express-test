<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref, watch, onMounted } from "vue";
import PreLoader from "./components/PreLoader.vue";
import { isLoading } from "./store/isloading";
import { useTheme } from "./store/theme";
import Nav from "./components/Nav.vue";
import MobileNav from "./components/mobilecomponents/NavMobile.vue";
import MobileNavIcon from "./components/mobilecomponents/NavIconMobile.vue";
import { useRoute } from "vue-router";
import { mobileIconClicked } from "./store/mobileIconClicked";
import { onMountApp } from "./store/onMountApp";
import { userData } from "./store/userData"
import { getUser } from "./views/user";
import "./assets/datepicker.scss"

//GETTING USER DATA ON START
getUser()

const mobileNav = ref();
const mobileNavButton = ref(false);
const showNav = ref(false);
var windowWidth = document.documentElement.clientWidth;

const theme = useTheme();

const usrData = userData()

const mobileNavIconClicked = mobileIconClicked();

const navigation = ref(false);

const route = useRoute();

const isLoadingCheck = isLoading();
const mountApp = onMountApp();
mountApp.state = false;


const onResize = () => {
  windowWidth = document.documentElement.clientWidth;

  if (windowWidth > 0 && windowWidth < 767) {
    mobileNav.value = "mobile";
    mobileNavButton.value = true;
  } else if (windowWidth > 768 && windowWidth < 1199) {
    mobileNav.value = "medium";
    mobileNavButton.value = true;
  } else if (windowWidth > 1200) {
    mobileNav.value = "full";
    mobileNavButton.value = false;
  }
};

window.addEventListener("resize", onResize);

const checkRoute = () => {
  navigation.value = true;
};

watch(
  () => route.name,
  () => {
    checkRoute();
    if (route.name === "blogpost" || route.name === "newspost") {
      window.addEventListener("scroll", moveScrollIndicator);
    } else {
      window.removeEventListener("scroll", moveScrollIndicator);
    }
  }
);
const showScroll = ref(false)

function moveScrollIndicator(e: any) {
  const scrollIndicator = document.getElementById("scrollIndicator");

  let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  let scrolled = (winScroll / height) * 100;
  scrollIndicator!.style.width = scrolled + "%";
  if (scrolled > 0) {
    showScroll.value = true
  } else {
    showScroll.value = false
    scrollIndicator!.style.boxShadow = "0 0 0 0 transparent"
  }

}

const themeLocal = ref(localStorage.getItem("theme-color"))

onMounted(() => {

  if (themeLocal.value === "theme-dark") {
    document.body.classList.add("theme-dark")
    theme.state = "theme-dark"
  } else if (themeLocal.value === "theme-light") {
    document.body.classList.add("theme-light")
    theme.state = "theme-light"
  } else {
    document.body.classList.add("theme-light")
    theme.state = "theme-light"

  }

  if (usrData.data != undefined) {
    theme.state = usrData.data.userSettings.themeName

    watch(() => usrData.data.userSettings.themeName, (newvalue) => {
      theme.state = usrData.data.userSettings.themeName

    })
  }

  watch(() => theme.state, (newvalue) => {
    if (newvalue === "theme-dark") {
      document.body.classList.remove("theme-light")
      document.body.classList.add("theme-dark")
    } else if (newvalue === "theme-light") {
      document.body.classList.remove("theme-dark")
      document.body.classList.add("theme-light")
    }
  })






  if (!isLoadingCheck.state) {
      setTimeout(() => {
        showNav.value = true;
      }, 100);
    }


  watch(() => isLoadingCheck.state, (loaded) => {

    if (!loaded) {
      setTimeout(() => {
        showNav.value = true;
      }, 100);
    }

  })
  mountApp.state = true;
  onResize();
});

</script>

<script lang="ts"></script>

<template>
  <div id="app" v-if="mountApp" :class="[mobileNav]">
    <transition name="nav">
      <Nav v-if="mobileNav === 'full' && showNav || mobileNav === 'medium' && showNav" :userData="usrData.data" :class="mobileNav" />
    </transition>
    <transition name="scroll">
      <div ref="scrollLineTop" class="scrollLineTop" id="scrollIndicator" v-show="showScroll"></div>
    </transition>

    <transition name="mobileNav">
      <MobileNav v-if="mobileNav === 'mobile' && mobileNavIconClicked.state" :userData="usrData.data" />
    </transition>
    <MobileNavIcon class="mobilenav" v-if="mobileNav === 'mobile'" />

    <transition name="fadeRoute">
      <PreLoader v-if="isLoadingCheck.state" :class="[theme.state]" />
    </transition>
    <RouterView />
  </div>
</template>


<style lang="scss">
.scrollLineTop {
  background: rgb(0, 217, 255);
  height: 50px;
  left: 0;
  border-radius: 0px 4px 0 0;
  position: fixed;
  top: 30px;
  width: 0%;
  left: 30px;
  z-index: 6;
  border-radius: 0 0 0 5px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.308);
  transition: opacity 1s ease-in-out;
}


.fadeRoute-enter-active,
.fadeRoute-leave-active {
  opacity: 1;
  transition: all 0.2s ease-in-out;
}

.fadeRoute-leave-to {
  opacity: 0;
}

.nav-enter-active,
.nav-leave-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.5s ease-in-out;
}

.nav-enter-from,
.nav-leave-to {
  opacity: 0;
  transform: translateX(50%);
}

.mobileNav-enter-active {
  opacity: 1;
  transition: all 0.7s ease-in-out;
}

.mobileNav-enter-from {
  opacity: 0.5;
  transform: translateX(-100%);
}

.mobileNav-leave-to {
  opacity: 0;
  transform: translateX(-100%);

  transition: all 0.3s ease-in-out;
}

.scroll-enter-active,
.scroll-leave-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.5s ease-in-out;
}

.scroll-enter-from,
.scroll-leave-to {
  opacity: 0;
}

.error {
  position: absolute;
  opacity: 0.9;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-nav-bg);
  font-family: Chango;
  text-align: center;
  font-size: 2rem;
  color: red;
}
</style>
