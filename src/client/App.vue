<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import PreLoader from "./components/PreLoader.vue";
import { isLoading } from "./store/isloading";
import { useTheme } from "./store/theme";
import Nav from "./components/Nav.vue";
import MobileNav from "./components/mobilecomponents/NavMobile.vue";
import MobileNavIcon from "./components/mobilecomponents/NavIconMobile.vue";
import { useRoute } from "vue-router";
import { mobileIconClicked } from "./store/mobileIconClicked";
import { onMountApp } from "./store/onMountApp";
import { userData } from "./store/userData";
import { getUser } from "./views/user";
import "./assets/datepicker.scss";
import { isMobile } from "./store/isMobile";
import axios from "axios";
import { storeRouterAnalytics } from "./components/newAnalytics";
import { signedIn } from "./store/signedIn";

const router = useRoute();
const path = computed(() => router.name);

//GETTING USER DATA ON START

const mobileNav = ref();
const mobileNavButton = ref(false);
const showNav = ref(false);
var windowWidth = document.documentElement.clientWidth;

const theme = useTheme();

const usrData = userData();

const mobileNavIconClicked = mobileIconClicked();

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

const moveScrollIndicator2 = () => {
  let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  let height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  let scrolled = (winScroll / height) * 100;
  if (scrolled > 0) {
    opacity.value = 0.5;
  } else {
    opacity.value = 1;
  }
};
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
  window.addEventListener("scroll", moveScrollIndicator2);

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
    console.log(usrData.data);
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
  window.addEventListener("resize", onResize);
  onResize();

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
          .then(() => {
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
</script>

<script lang="ts"></script>

<template>
  <div id="app" v-if="mountApp" :class="[mobileNav]">
    <MobileNavIcon class="mobilenavicon" v-if="mobileNav === 'mobile'" />
    <div class="background"></div>

    <transition name="nav">
      <Nav v-if="
          (mobileNav === 'full' && showNav) ||
          (mobileNav === 'medium' && showNav)
        "
           :class="mobileNav"
      />
    </transition>
    <transition name="scroll">
      <div ref="scrollLineTop"
           class="scrollLineTop"
           id="scrollIndicator"
           v-show="showScroll"
      ></div>
    </transition>
    <div class="mobile-top"
         v-if="mobileNav === 'mobile'"
         :class="mobileNavIconClicked.state ? 'active' : ''"
    ></div>
    <transition name="mobileNav">
      <MobileNav v-if="mobileNav === 'mobile' && mobileNavIconClicked.state"
                 :userData="usrData.data"
      />
    </transition>

    <transition name="fadeRoute">
      <PreLoader v-if="isLoadingCheck.state" :class="[theme.state]" />
    </transition>
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
.mobilenavicon {
  z-index: 100;
  position: fixed;
  width: 100%;
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

.mobile-top {
  height: 50px;
  width: 100%;
  opacity: v-bind(opacity);
  border-radius: 0 0 10px 10px;
  position: fixed;
  z-index: 10;
  background-color: var(--color-nav-bg);
  will-change: height;
  transition: all 0.5s cubic-bezier(0.45, -0.2, 0.39, 1.2);

  &.active {
    height: 100%;
    opacity: 1;
  }
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
  transition: all 0.4s cubic-bezier(0.47, -0.5, 0.39, 1.2);
}

.mobileNav-enter-from {
  opacity: 0.5;
  transform: translateY(-100%);
}

.mobileNav-leave-to {
  opacity: 0;
  transform: translateY(-100%);
  transition: all 0.5s cubic-bezier(0.47, -0.5, 0.39, 1.5);
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

#app.mobile {
  width: 100vw;
}
</style>
