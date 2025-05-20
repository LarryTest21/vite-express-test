<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { userTabClick } from "../store/userTabClick";
import { userClickedMobile } from "../store/userClickMobile";
import { useRoute } from "vue-router";
import { getBlob, getStorage, ref as storageFBRef } from "firebase/storage";
import { signedIn } from "../store/signedIn";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import router from "../router";
import $ from "jquery";
import { userLoginClickMobile } from "../store/userLoginClickMobile";
import { mobileIconClicked } from "../store/mobileIconClicked";

const mobileIClicked = mobileIconClicked();

const props = defineProps({
  isAdminCheck: String,
})
const userClickMobile = userClickedMobile();
const userClick = userTabClick();

const signedInCheck = signedIn();
const activateLoginTab = ref(false);
const loginActivated = ref(false);

const modalActivation = ref(false);
const modalAnimation = ref(true);
const route = useRoute();

const userPFP = ref();
const userEmail = firebase.auth().currentUser?.email;
const userPFPDownload = ref();
const initialName = ref();
const displayName = ref();

userPFP.value = localStorage.getItem("avatar");

const checkPFP = () => {
  if (userPFP.value == null) {
    modalActivation.value = true;
    const userStorage = firebase.auth().currentUser?.uid;
    const storage = getStorage();

    const storageRef = storageFBRef(
      storage,
      "/" + userStorage + "/" + "avatar.png"
    );
    const convertBase64 = async () => {
      const blob = await getBlob(storageRef);
      var reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = function () {
        var base64data = reader.result;
        userPFPDownload.value = base64data;
        userPFP.value = base64data;
        localStorage.setItem("avatar", userPFPDownload.value);
        return;
      };
    };
    convertBase64().then(() => {
      setTimeout(() => {
        modalActivation.value = false;
      }, 700);
    });
  } else {
    userPFP.value = localStorage.getItem("avatar");
  }
};

checkPFP();

const logOut = () => {
  const signedInCheck = signedIn();
  signedInCheck.state = false;
  firebase.auth().signOut();

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
      userClickMobile.state = false
    }
  });


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
      <router-link to="/profile">Profile</router-link>
      <router-link to="/createpost/newPost">Create Post</router-link>
      <router-link to="/editpostslist" v-if="!props.isAdminCheck">Edit Posts</router-link>
      <router-link @click.native.prevent="userClick" to="/adminpage" v-if="props.isAdminCheck === 'admin'">Admin
        Page</router-link>

      <a @click.stop.prevent="logOut()">Logout</a>
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
      height: 70px;

      img {
        height: 100%;
      }
    }
  }

  .usertab-links {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    a {
      padding: 10px;
      text-decoration: none;
      font-size: 2rem;
      text-transform: uppercase;
      font-family: Chango;
      color: var(--color-nav-txt);
    }

    a:hover {
      background-color: var(--color-nav-txt);
      color: var(--vt-c-nav-text-hover);
      cursor: pointer;
    }

    a::after {
      box-shadow: none;
    }
  }
}
</style>
@/store/userTabClick