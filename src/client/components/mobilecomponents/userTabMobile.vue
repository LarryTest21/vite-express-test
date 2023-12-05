<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { userTabClick } from "../../store/userTabClick";
import { useRoute } from "vue-router";
import { signedIn } from "../../store/signedIn";
import router from "../../router";
import { userData } from "../../store/userData";
import axios from "axios";
import "../icons/nopfpbase64";
import { base64NoPFP } from "../icons/nopfpbase64";
import gsap from "gsap";
import { mobileIconClicked } from "../../store/mobileIconClicked";
import $ from 'jquery';
import { createGlobalState } from "@vueuse/core";
const mobileIClicked = mobileIconClicked();

const props = defineProps({
  isAdminCheck: String,
  userData: Object,
});

const userClick = userTabClick();

const signedInCheck = signedIn();
const activateLoginTab = ref(false);
const loginActivated = ref(false);

const route = useRoute();

const userPFP = ref();
const userEmail = ref();

const emit = defineEmits(["logOut", "linkClicked"]);
const userD = userData();

const logOut = () => {
  const signedInCheck = signedIn();
  signedInCheck.state = false;
  userD.data = undefined;
  axios.post("/api/user/logout").then((res) => {});
  userD.data = undefined;

  signedInCheck.state = false;
  localStorage.removeItem("email");
  localStorage.removeItem("avatar");
  localStorage.removeItem("loggedIn");
  if (
    route.name === "profile" ||
    route.name === "editposts" ||
    route.name === "createpost" ||
    route.name === "adminpage"
  ) {
    router.push({ name: "landing" });
  }
  emit("logOut", true);

  if (
    route.name === "profile" ||
    route.name === "editposts" ||
    route.name === "createpost"
  ) {
    console.log("pushed");
    router.push({ name: "landing" });
  }
};
watch(signedInCheck, (newValue) => {
  if (signedInCheck.state) {
    activateLoginTab.value = false;
  } else {
    userClick.state = false;
  }
});

if (userD != undefined) {
  userEmail.value = userD.data.email;
}


const showNoPFP = ref(false);
onMounted(() => {
  gsap.from(".usertab-top>div", {
    delay: 0.3,
    duration: 0.2,
    stagger: 0.1,
    x: -100,
    opacity: 0,
  });

  gsap.from(".usertab-links-do>a", {
    delay: 0.5,
    duration: 0.2,
    stagger: 0.09,
    x: -100,
    opacity: 0,
  });

  loginActivated.value = JSON.parse(localStorage.getItem("loggedIn")!);
  if (userPFP.value === undefined || userPFP.value === "") {

    if (userData != undefined) {
      userPFP.value = userD.data.profilePic;
      localStorage.setItem("avatar", userPFP.value);
      if (userPFP.value === undefined) {
        userPFP.value = base64NoPFP;
        showNoPFP.value = true;
      }
    } else {
      userPFP.value = base64NoPFP;

      watch(
        () => userD.data,
        () => {
          userPFP.value = base64NoPFP;
          showNoPFP.value = true;

          if (userD.data != undefined) {
            userPFP.value = userD.data.profilePic;
            localStorage.setItem("avatar", userPFP.value);
          } else {
            userPFP.value = base64NoPFP;
            showNoPFP.value = true;
          }
        }
      );
    }
  }
});
</script>

<template>
  <div class="user-tab">
    <div class="usertab-top">
      <div class="userPFP">
        <div class="no-pfp" v-if="showNoPFP">no pfp</div>
        <img class="userPFP-img"
             :src="userPFP"
             :class="showNoPFP ? 'nopfp' : ''"
        />
      </div>
      <div class="user-text">
        <p class="userEmail">{{ userEmail }}</p>
      </div>
    </div>
    <div class="usertab-links-do" @click.prevent="mobileIClicked.state =false">
      <router-link to="/profile">Profile</router-link>
      <router-link to="/createpost/newPost" key="newPost"
        >Create Post</router-link
      >
      <router-link to="/editpostslist"
                   v-if="props.isAdminCheck"
                   key="editpostslist"
        >Edit Posts</router-link
      >
      <router-link @click.native.prevent="userClick"
                   to="/adminpage"
                   v-if="props.isAdminCheck === 'admin'"
                   key="adminpage"
        >Admin Page</router-link
      >
      <a @click.stop.prevent="logOut()" key="logout">Logout</a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-tab {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  .usertab-top {
    position: relative;
    display: flex;
    flex-direction: column;
    font-size: 1.5rem;

    .userPFP {
      position: relative;
      height: 100px;
      margin: 5px;

      .no-pfp {
        height: 100%;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        width: 100%;
        text-align: center;
        font-size: 1.5rem;
      }

      .userPFP-img {
        height: 100%;

        &.nopfp {
          opacity: 0.3;
        }
      }
    }

    .user-text {
      background-color: var(--color-nav-txt);
      color: var(--color-nav-bg-darker);
      display: flex;
      align-items: center;
      padding: 2px;
      border-radius: 0 5px 5px 0;

      .userEmail {
        width: 100%;
        padding-left: 5px;
      }
    }
  }

  .usertab-links-do {
    position: relative;
    margin-top: 10px;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    a {
      height: 100%;
      font-family: Chango;
      font-weight: 900;
      text-decoration: none;
      font-size: 2.3rem;
      text-transform: uppercase;
      color: var(--color-nav-txt);
      display: flex;
      align-items: center;

      padding-left: 5px;
    }

    a:hover {
      background-color: var(--color-nav-txt-darker);
      color: var(--color-nav-bg-darker);
      cursor: pointer;
    }

    a::after {
      box-shadow: none;
    }
  }
}
</style>
