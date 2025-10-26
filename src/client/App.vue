<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref, watch, computed, onMounted } from "vue";
import PreLoader from "./components/PreLoader.vue";
import { isLoading } from "./store/isloading";
import { useTheme } from "./store/theme";
import Nav from "./components/Nav.vue";
import NavMobile from "./components/mobilecomponents/NavMobile.vue";
import NavIconMobile from "./components/mobilecomponents/NavIconMobile.vue";
import NavMobileNew from "./components/mobilecomponents/NavMobileNew.vue";
import { useRoute } from "vue-router";
import { onMountApp } from "./store/onMountApp";
import { userData } from "./store/userData";
import { getUser } from "./views/user";
import "./assets/datepicker.scss";
import { isMobile } from "./store/isMobile";
import { storeRouterAnalytics } from "./components/newAnalytics";
import { signedIn } from "./store/signedIn";
import { subscribesFn } from "./components/Nav/subscribe";

const router = useRoute();
const path = computed(() => router.name);

//GETTING USER DATA ON START

const mobileNav = ref();
const mobileNavButton = ref(false);
const showNav = ref(false);
var windowWidth = document.documentElement.clientWidth;

const theme = useTheme();

const usrData = userData();


const navigation = ref(false);

const route = useRoute();

const isLoadingCheck = isLoading();
const mountApp = onMountApp();
mountApp.state = false;

const mobile = isMobile();

const onResize = () => {
  windowWidth = document.documentElement.clientWidth;

  if (windowWidth > 0 && windowWidth < 767) {
    mobile.state = true;
    mobileNav.value = "mobile";
    mobileNavButton.value = true;
  } else if (windowWidth > 768 && windowWidth < 1199) {
    mobile.state = false;
    mobileNav.value = "medium";
    mobileNavButton.value = true;
  } else if (windowWidth > 1200) {
    mobile.state = false;
    mobileNav.value = "full";
    mobileNavButton.value = false;
  }
};

const checkRoute = () => {
  navigation.value = true;
};

const opacity = ref(1);
const showScroll = ref(false);

function moveScrollIndicator(e: any) {
  const scrollIndicator = document.getElementById("scrollIndicator");

  let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  let height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  let scrolled = (winScroll / height) * 100;
  scrollIndicator!.style.width = scrolled + "%";
  if (scrolled > 0) {
    showScroll.value = true;
  } else {
    showScroll.value = false;
    scrollIndicator!.style.boxShadow = "0 0 0 0 transparent";
  }
}

const themeLocal = ref(localStorage.getItem("theme-color"));

onMounted(() => {

  if (themeLocal.value === "theme-dark") {
    document.body.classList.add("theme-dark");
    theme.state = "theme-dark";
  } else if (themeLocal.value === "theme-light") {
    document.body.classList.add("theme-light");
    theme.state = "theme-light";
  } else {
    document.body.classList.add("theme-light");
    theme.state = "theme-light";
  }

  if (usrData.data != undefined) {
    theme.state = usrData.data.userSettings.themeName;
  }

  watch(
    () => theme.state,
    (newvalue) => {
      if (newvalue === "theme-dark") {
        document.body.classList.remove("theme-light");
        document.body.classList.add("theme-dark");
      } else if (newvalue === "theme-light") {
        document.body.classList.remove("theme-dark");
        document.body.classList.add("theme-light");
      }
    }
  );

  if (!isLoadingCheck.state) {
    showNav.value = true;
  }

  watch(
    () => isLoadingCheck.state,
    (loaded) => {
      if (!loaded) {
        showNav.value = true;
      }
    }
  );

  mountApp.state = true;

  const observer = new ResizeObserver(entries => {
    for (let entry of entries) {
      onResize()
    }
  });


  observer.observe(document.body); // or a specific container



  getUser().then(() => {
    watch(
      () => route.name,
      () => {

        checkRoute();
        if (route.name === "blogpost" || route.name === "newspost") {
          window.addEventListener("scroll", moveScrollIndicator);
        } else {
          window.removeEventListener("scroll", moveScrollIndicator);
          showScroll.value = false;
        }
        const pageID = ref(route.name);
        const userID = ref();

        const checkUserAnalytics = new Promise(async (resolve, reject) => {
          if (userData().data != undefined) {
            resolve("success");
          } else {
            reject("rejected");
          }
        });

        checkUserAnalytics
          .then((res) => {

            userID.value = userData().data._id;
            if (route.name === "blogpost") {
              pageID.value = route.params.blogSlug.toString();
            } else if (route.name === "newspost") {
              pageID.value = route.params.newsSlug.toString();
            }
          })
          .then(() => {
            storeRouterAnalytics(pageID.value, userID.value);
          })
          .catch(() => {
            userID.value = "randomUser";

            storeRouterAnalytics(pageID.value, userID.value);
          });
      }
    );
  });

});

const navIconClicked = ref(false);

const animEnded = ref()
function onMobileNavEnter() {
  console.log("finished")
  animEnded.value = !animEnded.value
}

const onMobileNavLeave = () => {
  console.log("leave")
  animEnded.value = false
}


</script>

<script lang="ts"></script>

<template>
  <div id="app" v-if="mountApp" :class="[mobileNav]">

    <div id="longpress-overlay"></div>
    <transition name="nav">
      <Nav v-if="
        (mobileNav === 'full' && showNav) ||
        (mobileNav === 'medium' && showNav)
      " :class="mobileNav" />
    </transition>
    <transition name="scroll">
      <div ref="scrollLineTop" class="scrollLineTop" id="scrollIndicator" v-show="showScroll"></div>
    </transition>
    <div v-if="mobileNav === 'mobile'" :class="['mobile-top', navIconClicked ? 'expanded' : 'collapsed']" key="1">
      <NavIconMobile class="NavIconMobile" v-if="mobileNav === 'mobile'" :navIconClicked="navIconClicked"
        @navIconClicked="navIconClicked = !navIconClicked" />
      <transition name="mobileNav" @before-enter="onMobileNavEnter" @before-leave="onMobileNavLeave">
        <NavMobile v-show="mobileNav === 'mobile' && navIconClicked" :userData="usrData.data" class="mobile-nav"
          @navIconClicked="navIconClicked = false" :animEnded="animEnded" />
      </transition>
    </div>


    <NavMobileNew />

    <transition name="fadeRoute">
      <PreLoader v-if="isLoadingCheck.state" :class="[theme.state]" />
    </transition>
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
#app {
  width: 100vw;
  max-width: 100vw
}

#longpress-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: none;
}



.background {
  position: absolute;
  width: 100%;
  height: 100%;
  display: block;

  .background-image {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 1;
    object-fit: cover;
    opacity: 0.1;
  }
}

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


.NavIconMobile {
  position: fixed;
  width: 100vw;
  z-index: 100;
}

.scrollLineTop {
  height: 5px;
  top: 0;
  left: 0;
  border-radius: 0;
  width: 0;
  box-shadow: none;
}

.mobile-top {
  position: fixed;
  top: 0;
  left: 0;
  height: 50px;
  width: 100vw;
  background-color: var(--color-nav-bg);
  z-index: 10000;
  border-radius: 0 0 10px 10px;
  overflow: hidden;
  transition: height 0.5s ease;

  .mobile-nav {
    position: relative;
    height: 100dvh;
    border-radius: 50px;
  }
}

.mobile-top.collapsed {}

.mobile-top.expanded {
  height: 100dvh;
  border-radius: 0;
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

.mobileNav-enter-active,
.mobileNav-leave-active {
  transition: 0.5s ease-in-out;
}

.mobileNav-enter-from,
.mobileNav-leave-to {
  height: 0vh;
}

.mobileNav-enter-to,
.mobileNav-leave-from {
  height: 100vh;
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





.landing-wrapper.mobile .section-wrapper {
  padding: 10px !important;
  flex-direction: column !important;
  height: auto !important;
}

.landing-wrapper.mobile .section2 .images-wrapper {
  width: 100% !important;
  overflow-x: auto;
  display: block !important;
  padding: 0 10px;
}

.landing-wrapper.mobile .image-carousel {
  position: relative !important;
  width: 100% !important;
  height: auto !important;
  transform: none !important;
  opacity: 1 !important;
  box-shadow: none !important;
  margin-bottom: 15px;
}

.landing-wrapper.mobile .image-carousel img {
  width: 100% !important;
  height: auto !important;
  transform: none !important;
}

/* Smaller font sizes for titles */
.landing-wrapper.mobile .section1 .title-wrapper h1 {
  font-size: 2rem !important;
  text-align: center;
  padding: 0 10px;
  line-height: 1.2;
}

/* General paddings for all sections */
.landing-wrapper.mobile .section-landing .section-wrapper {
  padding: 20px 10px !important;
  box-sizing: border-box;
}

/* Responsive font scaling */
@media (max-width: 400px) {
  .landing-wrapper.mobile .section1 .title-wrapper h1 {
    font-size: 1.5rem !important;
  }
}

/* Prevent horizontal overflow on body */
</style>
