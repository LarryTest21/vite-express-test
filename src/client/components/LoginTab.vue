<script setup lang="ts">
import { ref, onMounted } from "vue";
import emailSVG from "../components/icons/email.vue";
import passwordSVG from "../components/icons/password.vue";
import Modal from "../components/Modal.vue";
import { signedIn } from "../store/signedIn";
import axios from "axios"
import { storedTokens } from "../store/accesToken"
import { userData } from "../store/userData"


const inputEmail = ref() as any;


const modalActivation = ref(false);
const modalButtonMessage = ref()
const modalAnimation = ref()


const emit = defineEmits(["emitRegister"]);

const emitRegister = () => {
  emit("emitRegister", true);
}
const accToken = storedTokens()
const email = ref();
const password = ref();
const signedInCheck = signedIn()
const userD = userData()


const signIn = () => {
  modalActivation.value = false
  modalButtonMessage.value = ""
  modalAnimation.value = ""
  const API_URL = "/api/user/login"

  const loginData = {
    email: email.value,
    password: password.value
  }
  axios.post(API_URL, loginData).then(async (res) => {
    accToken.accessToken = res.data.data.accessToken
    signedInCheck.uid = res.data.data.email
    console.log(`output->signedInCheck.uid`,signedInCheck.uid)
    if (res.data.data.autoLogin === true) {
      localStorage.setItem('autoLogin', "true")
    }
    localStorage.setItem('loggedIn', "true")
    localStorage.setItem('email', res.data.data.email)
    localStorage.setItem("autoLogin", res.data.data.userSettings.autoLogin)
    modalActivation.value = true
    modalAnimation.value = true
    modalButtonMessage.value = ""
    setTimeout(() => {
      signedInCheck.state = true
      userD.data = res.data.data
      console.log(`output->userD.data`,userD.data)
    }, 100);
  }).catch((err) => {
    modalActivation.value = true
    modalAnimation.value = false
    console.log(err);
    if (err.response.status === 404) {
      modalButtonMessage.value = "User doesn't exist"
    } else if (err.response.status === 401) {
      modalButtonMessage.value = "Wrong credentials"
    }
  })
};

onMounted(() => {
  setTimeout(() => {
    inputEmail.value.focus();
  }, 300);
});
</script>

<template>
  <div class="login-wrap">
    <transition name="modal">
      <Modal v-if="modalActivation" :modalLoadingMessage="modalButtonMessage" :modalAnimation="modalAnimation"
        :loadingScale="1.5" fontSize="2rem" :spinnerColor="'var(--color-nav-txt)'" class="modal"
        @click="modalActivation = !modalActivation" />
    </transition>

    <div class="inputs">
      <div class="input">
        <input type="text" ref="inputEmail" placeholder="Email" v-model="email" @keyup.enter.native="signIn" />
        <emailSVG class="icon" />
      </div>

      <div class="input">
        <input type="password" placeholder="Password" v-model="password" @keyup.enter.native="signIn" />
        <passwordSVG class="icon" />
      </div>

      <div class="buttons">
        <input type="button" value="LogIn" @click.prevent="signIn" />

        <RouterLink to="/register">
          <input type="button" value="Register" @click="emitRegister" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  position: absolute;
}

.login-wrap {
  position: fixed;
  width: 250px;
  top: 75px;
  left: 5%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 4px 4px 5px 2px rgba(0, 0, 0, 0.3);
  align-items: center;
  background: var(--color-nav-bg);
  border-radius: 5px;
  font-size: 1rem;
  font-family: Chango;
  color: var(--color-nav-txt) !important;
  cursor: default;
  z-index: -10;
  overflow: hidden;

  .inputs {
    padding: 15px;
    width: 100%;
    height: 100%;

    .input {
      border-color: var(--vt-c-nav-text-bg-hover);
      background-color: var(--color-bg);
      color: var(--color-nav-txt);
      border-style: none;
      transition: width 0.1s ease-in-out;
      display: flex;
      align-items: center;
      justify-content: center;

      .icon {
        position: absolute;
        width: 20px;
        height: 25px;
        left: 20px;
        stroke-width: 2px;
        fill: var(--color-nav-txt);
      }

      input {
        width: 100%;
        height: 40px;
        font-family: Chango;
        border-style: none;
        background: transparent;
        margin: 10px 0;
        border-bottom: solid rgba(0, 86, 167, 0.555);
        transition: all 0.1s ease-in-out;
      }

      input[type="button"] {
        width: 100%;
      }

      input[type="text"],
      input[type="password"] {
        padding: 5px 5px 5px 30px;
      }

      input:active {
        border-style: none;
        outline: none;
      }

      input:focus {
        outline: none;
        border-style: none;
        border-bottom: solid rgba(0, 86, 167, 0.192);
        width: 100%;
      }

      input,
      select,
      textarea {
        color: var(--color-nav-txt);
      }
    }

    input::placeholder {
      color: var(--color-nav-txt);
      font-weight: Light;
    }

    .buttons {
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: 10px;

      input[type="button"] {
        overflow: visible;
        padding: 0 0;
        width: 100%;
        font-family: Chango;
        font-size: 1rem;
        border-radius: 18px;
        cursor: pointer;
        height: 40px;
        color: var(--color-nav-txt) !important;
        border-style: none;
        box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.3);
        background-color: var(--color-nav-bg);
        transition: all 0.1s ease-in-out;
      }

      input[type="button"]:hover {
        color: var(--color-nav-bg) !important;
        background-color: var(--color-nav-txt);
      }

      input[type="button"]:active {
        box-shadow: -1px -1px 1px 0.5px rgba(0, 0, 0, 0.3);
      }

      a {
        display: flex;
        justify-content: center;
        margin: 5px;
        overflow: visible;
        text-decoration: none;
      }

      a:nth-child(1) {
        width: 100%;
        left: auto;
        width: 100%;
      }

      a:nth-child(2) {
        padding: 0 0;
        left: 0;
        width: 80%;
      }

      a::after {
        height: 0;
        box-shadow: 0 0 0 0;
      }

      a:hover {
        box-shadow: 0px 0 0 0 var(--vt-c-nav-text-bg-hover);
        color: var(--vt-c-nav-txt);
        background-color: transparent;
      }
    }
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease-out;
  opacity: 1;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
