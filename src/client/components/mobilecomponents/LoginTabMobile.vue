<script setup lang="ts">
import { ref, onMounted } from "vue";
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



const modalEmit = (e:any) => {
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
    console.log(`output->res`,res)
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
    if (err.response.status  === 404) {
      modalButtonMessage.value = "User doesn't exist"
    } else if (err.response.status === 401 || err.response.status === 403) {
      modalButtonMessage.value = "Wrong credentials"
    } 
  })
};

onMounted(() => {

})

</script>

<template>
  <div class="mobile-login-wrap">
    <transition name="modal">
      <Modal class="modal" v-if="modalActivation" :modalButtonMessage="modalButtonMessage" @closeModal="modalEmit" :fontSize="'2.5rem'" />
    </transition>

    <div class="inputs">
      <div class="login-input">
        <div class="input">
          <emailSVG class="icon" />

          <input type="text" placeholder="Email" v-model="email" @keyup.enter.native="signIn" />
        </div>

        <div class="input">
          <passwordSVG class="icon" />

          <input type="password" placeholder="Password" v-model="password" @keyup.enter.native="signIn" />
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
  font-family: Chango;
  color: var(--color-nav-txt) !important;

  .modal {
    position: absolute;
    width:100%;
    height:100%;

  }

  .inputs {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;

    .login-input {
      position: relative;
      height: 100%;
      padding: 5px;

      .input {
        position: relative;
        margin-top: 50px;
        border-color: var(--vt-c-nav-text-bg-hover);
        background-color: var(--color-bg);
        color: var(--color-nav-txt);
        border-style: none;
        transition: width 0.1s ease-in-out;

        .icon {
          position: absolute;
          left: -10px;
          top: 10px;
          width: 50px;
          height: 50px;
          stroke-width: 2px;
          fill: var(--color-nav-txt);
        }

        input {
          font-size: 2rem;
          width: 100%;
          font-family: Chango;
          border-style: none;
          background: transparent;
          border-bottom: solid 2px rgba(0, 86, 167, 0.555);
          transition: all 0.1s ease-in-out;
        }

        input[type="text"],
        input[type="password"] {
          padding: 5px 5px 5px 50px;
        }

        input:focus {
          width: 100%;
          border-bottom: solid 5px rgba(0, 86, 167, 0.555);
        }

        input:focus-visible {
          outline: none
        }

        input,
        select,
        textarea {
          color: var(--color-nav-txt);
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
      gap: 10px;
      flex-direction: column;
      justify-content: flex-end;

      input[type="button"] {
        width: 100%;
        height: 40%;
        font-size: 3rem;
        ;
        font-family: Chango;
        cursor: pointer;
        color: var(--color-nav-txt) !important;
        border-style: none;
        box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.356);
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
}</style>
