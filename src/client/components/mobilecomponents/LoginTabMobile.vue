<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import emailSVG from "../../components/icons/email.vue";
import passwordSVG from "../../components/icons/password.vue";
import Modal from "../../components/Modal.vue";
import axios from "axios"
import { signedIn } from "../../store/signedIn";
import { storedTokens } from "../../store/accesToken"
import { userData } from "../../store/userData"

const modalActivation = ref();

const modalButtonMessage = ref()
const modalAnimation = ref()

const accToken = storedTokens()
const email = ref();
const password = ref();
const signedInCheck = signedIn()
const userD = userData()


const emit = defineEmits(['logOut'])



const modalEmit = (e: any) => {
  modalActivation.value = false
}


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
    console.log(`output->res`, res)
    accToken.accessToken = res.data.data.accessToken
    signedInCheck.uid = res.data.data.email

    console.log(res.data.data)
    if (res.data.data.userSettings.autoLogin === true) {
      localStorage.setItem('autoLogin', "true")
    }
    localStorage.setItem('loggedIn', "true")
    localStorage.setItem('email', res.data.data.email)
    modalActivation.value = true
    modalAnimation.value = true
    modalButtonMessage.value = ""
    setTimeout(() => {
      signedInCheck.state = true
      userD.data = res.data.data
    }, 100);
  }).catch((err) => {
    modalActivation.value = true
    modalAnimation.value = false
    console.log(err);
    if (err.response.status === 404) {
      modalButtonMessage.value = "User doesn't exist"
    } else if (err.response.status === 401 || err.response.status === 403) {
      modalButtonMessage.value = "Wrong credentials"
    }
  })
};




const scrollIntoView = (event: Event) => {
  const el = event.target as HTMLElement;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
};

</script>

<template>
  <div class="mobile-login-wrap">
    <transition name="modal">
      <Modal class="modal" v-if="modalActivation" :modalButtonMessage="modalButtonMessage" @closeModal="modalEmit"
        :fontSize="'2.5rem'" />
    </transition>

    <div class="inputs">
      <div class="login-input">
        <div class="input">
          <emailSVG class="icon" />
          <input type="text" placeholder="Email" v-model="email" @keyup.enter.native="signIn"   autocapitalize="none" @focus="scrollIntoView" />
        </div>

        <div class="input">
          <passwordSVG class="icon" />
          <input type="password" placeholder="Password" v-model="password" @keyup.enter.native="signIn" autocapitalize="none"
            @focus="scrollIntoView" />
        </div>
      </div>
      <div class="loginbuttons">
        <input type="button" value="LogIn" @click.prevent="signIn" />

        <input type="button" value="Register" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mobile-login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 3rem;
  list-style: none;
  display: flex;
  flex-direction: column;

  .modal {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .inputs {
    position: relative;
    display: flex;
    height: 100%;
    flex-direction: column;

    .login-input {
      position: relative;
      padding: 5px;

      .input {
        position: relative;
        display: flex;
        margin-top: 50px;
        transition: width 0.1s ease-in-out;

        .icon {
          position: absolute;
          top: 5px;
          width: 50px;
          height: 50px;
          fill: var(--color-nav-txt);
        }

        input {
          width: 100%;
          font-family: Chango;
          color: var(--color-nav-txt);
          border-style: none;
          font-size: 1.2rem;
          background-color: transparent;
          border-bottom: solid 2px rgba(0, 86, 167, 0.555);
          transition: all 0.1s ease-in-out;
        }

        input[type="text"],
        input[type="password"] {
          padding: 20px 5px 5px 60px;
        }

        input:focus {
          border-bottom: solid 5px rgba(0, 86, 167, 0.555);
        }

        input:focus-visible {
          outline: none
        }
      }
    }

    input::placeholder {
      color: var(--color-nav-txt);
      font-weight: Light;
      transition: all 0.1s ease-in-out
    }

    input:focus::placeholder {
      color: transparent;
    }

    .loginbuttons {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      gap: 20px;
      flex-direction: column;
      margin-top: 50px;

      input[type="button"] {
        width: 90%;
        font-size: 3rem;
        font-family: Chango;
        cursor: pointer;
        color: var(--color-nav-bg) !important;
        border-style: none;
        border-radius: 10px;
        box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.356);
        background-color: var(--color-nav-txt);
        transition: all 0.1s ease-in-out;
      }

      input[type="button"]:hover {
        color: var(--color-nav-bg) !important;
        background-color: var(--color-nav-txt);
      }

      input[type="button"]:active {
        box-shadow: -1px -1px 1px 0.5px rgba(0, 0, 0, 0.3);
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
