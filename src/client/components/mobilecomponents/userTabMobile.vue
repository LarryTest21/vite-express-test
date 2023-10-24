<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { userTabClick } from "../../store/userTabClick";
import { userClickedMobile } from "../../store/userClickMobile";
import { useRoute } from "vue-router";
import { signedIn } from "../../store/signedIn";
import router from "../../router";
import { userData } from "../../store/userData"
import axios from "axios";

const props = defineProps({
  isAdminCheck: String,
  userData: Object
})
const userClickMobile = userClickedMobile();
const userClick = userTabClick();

const signedInCheck = signedIn();
const activateLoginTab = ref(false);
const loginActivated = ref(false);

const route = useRoute();

const userPFP = ref();
const userEmail = ref();
if (props.userData != undefined) {
  userEmail.value = props.userData.email
}

const emit = defineEmits(['logOut'])

userPFP.value = localStorage.getItem("avatar");

if (userPFP.value == undefined) {
  if (userData != undefined) {
    userPFP.value = props.userData!.profilePic
    localStorage.setItem("avatar", userPFP.value)
  } else {
    watch(() => props.userData, () => {
      if (userData != undefined) {
        userPFP.value = props.userData!.profilePic
        localStorage.setItem("avatar", userPFP.value)
      } else {
        userPFP.value = undefined
      }
    })
  }
}

const logOut = () => {
  const signedInCheck = signedIn();
  signedInCheck.state = false;
  const userD = userData()
  userD.data = undefined
  axios.post("/api/user/logout").then((res) => {
  })
  userD.data = undefined

  signedInCheck.state = false
  localStorage.removeItem("email")
  localStorage.removeItem("avatar")
  localStorage.removeItem("loggedIn")
  if (
    route.name === "profile" ||
    route.name === "editposts" ||
    route.name === "createpost" ||
    route.name === "adminpage"
  ) {
    router.push({ name: "landing" });
  }
  emit("logOut", true)


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


onMounted(() => {
  loginActivated.value = JSON.parse(localStorage.getItem("loggedIn")!);



});
</script>

<template>
  <div class="user-tab" v-if="userClickMobile.state">
    <div class="usertab-top">
      <div class="userPFP">
        <img class="userPFP-img" v-bind:src="userPFP" />
      </div>
      <div class="user-text">
        <p class="userEmail">{{ userEmail }}</p>
      </div>
    </div>
    <div class="usertab-links" ref="userTab">
      <TransitionGroup name="links">

        <router-link to="/profile" key="profile">Profile</router-link>
        <router-link to="/createpost/newPost" key="newPost">Create Post</router-link>
        <router-link to="/editpostslist" v-if="props.isAdminCheck" key="editpostslist">Edit Posts</router-link>
        <router-link @click.native.prevent="userClick" to="/adminpage" v-if="props.isAdminCheck === 'admin'"
          key="adminpage">Admin
          Page</router-link>

        <a @click.stop.prevent="logOut()" key="logout">Logout</a>
      </TransitionGroup>
    </div>

  </div>
</template>

<style scoped lang="scss">
.user-tab {
  width: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  .usertab-top {
    padding: 10px;
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    font-size: 1.2rem;
    gap: 10px;

    .userPFP {
      height: 100px;

      img {
        height: 100%;
      }
    }
  }

  .usertab-links {
    display: flex;
    flex-direction: column;
    position:relative;

    a {
      position:relative;
      padding: 10px;
      text-decoration: none;
      font-size: 2rem;
      text-transform: uppercase;
      font-family: Chango;
      color: var(--color-nav-txt);
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


.links-move, /* apply transition to moving elements */
.links-enter-active,
.links-leave-active {
  transition: all 0.5s ease;
}

.links-enter-from,
.links-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.links-leave-active {
  position: absolute;
}
</style>
