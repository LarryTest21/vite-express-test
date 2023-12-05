<script setup lang="ts">
import { ref, watch } from "vue";
import router from "../router";
import emailSVG from "../components/icons/user.vue";
import passwordSVG from "../components/icons/password.vue";
import axios from "axios"
import { storedTokens } from "../store/accesToken"
import { signedIn } from "../store/signedIn"
import Modal from "../components/Modal.vue"
import bcrypt from "bcryptjs"
import { userData } from "../store/userData"
import {isAdmin} from "../store/isAdmin"


const accToken = storedTokens()
const email = ref();
const password = ref();
const loggedIn = signedIn()
const userD = userData()

const admin = isAdmin()

const modalActivation = ref(false);
const modalMessage = ref()
const modalAnimation = ref()

const writtenEmail = ref(true);
const writtenPw = ref(true);

const emailRef = ref();
const passwordRef = ref();

const errorB = ref(false);
const errorMessage = ref();

const errorBFalse = () => {
  if (errorB.value) {
    errorB.value = false;
  }

  if (email.value !== undefined) {
    if (email.value.length !== 0) {
      writtenEmail.value = false;
    }
    if (email.value.length === 0) {
      writtenEmail.value = true;
    }
  }

  if (password.value !== undefined) {
    if (password.value.length !== 0) {
      writtenPw.value = false;
    }
    if (password.value.length === 0) {
      writtenPw.value = true;
    }
  }
};

const signIn = () => {

  const API_URL = "/api/user/login"

  const loginData = {
    email: email.value,
    password: password.value
  }
  axios.post(API_URL, loginData).then(async (res) => {
    console.log(res)
    accToken.accessToken = await res.headers.authorization
    loggedIn.state = true
    loggedIn.uid = res.data.email
    localStorage.setItem('loggedIn', "true")
    localStorage.setItem('email', res.data.data.email)
    localStorage.setItem("loggedInBefore", "true")
    admin.state = res.data.clearance
    modalAnimation.value = false
    modalActivation.value = true
    modalMessage.value = "Redirecting to landing page"

    userD.data = res.data.data
    setTimeout(() => {
      router.push("/")
    }, 1000);
  }).catch((err) => {
    modalActivation.value = true
    modalAnimation.value = false
    if (err.status = 404) {
      modalMessage.value = "User doesn't exist"
    } else {
      modalMessage.value = "problem"
    }
  })

}

const getAllUsers = () => {
  axios.get("/api/user/getAllUsers").then((res) => {
    console.log(`output->res`, res)
  })

}

const hello = () => {
  axios.get("/api/hello").then((res) => {
    console.log(`output->res`, res)
  }).catch((err) => {
    console.log(`output->err`,err)
  })

}
</script>

<template>
  <div class="form-wrap">
    <div class="inputs">
      <transition name="modal">
        <div class="modal-wrapper" v-if="modalActivation" @click.prevent="modalActivation = !modalActivation">
          <Modal class="modal" :spinnerColor="'var(--color-nav-txt)'" :modalAnimation="modalAnimation"
            :position="'absolute'" :modalLoadingMessage="modalMessage" :fontSize="'3rem'" :backgroundOpacity="0.7"
            :loadingScale="3" />
        </div>

      </transition>
      <div class="input-lines">

        <div class="input">
          <input ref="emailRef" type="text" placeholder="" v-model="email" @focus="errorBFalse"
            @keyup.enter.native="signIn" />
          <emailSVG class="icon" v-if="writtenEmail" />
        </div>
        <div class="input">
          <input ref="passwordRef" type="password" v-model="password" @keyup.enter.native="signIn" @focus="errorBFalse" />
          <passwordSVG class="icon" v-if="writtenPw" />
        </div>
      </div>
      <div class="buttons" v-click-away="errorBFalse">
        <input class="login" @click="signIn" type="button" value="LogIn" />

        <RouterLink to="/register">
          <input class="register" type="button" value="Register" />
        </RouterLink>
        <input @click="getAllUsers" type="button" value="getAllUsers" />
        <input @click="hello" type="button" value="hello" />

      </div>
    </div>
  </div>
</template>

<style lang="scss">
@media (min-width: 1024px) {
  .form-wrap {
    position: relative;
    height: calc(100vh - 70px);
    width: 100%;
    top: 70px;
    padding: 30px;
    display: flex;
    justify-content: center;
    align-items: center;

    .inputs {
      position: relative;
      background-color: var(--color-nav-bg);
      border-radius: 10px;
      box-shadow: 2px 2px 5px 5px rgba(179, 176, 176, 0.527);
      width: 30%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      gap: 25px;
      padding: 30px;
      overflow: hidden;

      .input-lines {
        position: relative;
        width: 100%;
        height: 100%;
        gap: 25px;
        display: flex;
        flex-direction: column;

        .input {
          position: relative;
          border-color: var(--vt-c-nav-text-bg-hover);
          transition: width 0.1s ease-in-out;
          height: 40%;

          input[type="text"],
          input[type="password"] {
            position: relative;
            padding: 5px 5px 5px 15px;
            width: 100%;
            height: 100%;
            outline-style: solid;
            font-family: Chango;
            font-size: 2rem;
            background: transparent;
            border: var(--color-nav-txt) solid 3px;
            border-radius: 10px;
            outline: none;
            transition: border 0.1s ease-in-out, width 0.1s ease-in;
            caret-color: var(--color-nav-txt);
          }

          .icon {
            position: absolute;
            top: -2px;
            margin: auto;
            height: 60px;
            fill: var(--color-nav-txt);
            z-index: 0;
            left: 15px;
            pointer-events: none;
            transition: all 0.05s ease-in-out;
            bottom: 3px;
            border-radius: 5px;
            background-color: var(--color-nav-bg);
          }

          input:focus+.icon {
            top: -100%;
            height: 30px;
          }
        }

        input[type="text"] {
          font-size: 2rem;
        }

        input,
        select,
        textarea {
          color: var(--color-nav-txt);
        }

        input::placeholder {
          color: var(--color-nav-txt);
          font-weight: Light;
        }

        input:focus::placeholder {
          outline: none;
          color: transparent;
        }
      }

      .buttons {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        width: 100%;
        height: 100%;
        position: relative;
        list-style-type: none;
        gap: 10px;

        input[type="button"] {
          text-decoration: none;
          display: flex;
          justify-content: center;
          list-style-type: none;
          display: flex;
          overflow: visible;
          width: 100%;
          height: 100%;
          font-family: Chango;
          font-size: 3em;
          border-radius: 18px;
          cursor: pointer;
          color: var(--color-nav-txt) !important;
          border-style: none;
          box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.3);
          background-color: var(--color-nav-bg);
          transition: all 0.1s ease-in-out;

          &.login:hover {
            background-color: rgb(25, 84, 92);
          }

          &.register:hover {
            background-color: rgb(25, 92, 45);
          }
        }



        a {
          width: 100%;
          height: 100%;
          display: flex;
          list-style: none;
          text-decoration: none;
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
}

.modal-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10;

  .modal {
    position: relative;
    width: 100%;
    height: 100%;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease-out;
  opacity: 1;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateX(-200px)
}

@media (max-height: 700px) {

  .form-wrap {
    .inputs {
      width: 25%;
      height: 100%;
      display: flex;

      .input-lines {
        height: 100%;
        position: relative;

        .input {
          position: relative;
          height: 100%;

          input[type="text"],
          input[type="password"] {
            font-size: 1.3rem;
          }

          input:focus+.icon {
            top: -100%;
            height: 30px;
          }

          .icon {
            height: 40px;
          }
        }

      }

      .buttons {
        position: relative;
        height: 100%;

        input[type="button"] {
          font-size: 2.5rem;
        }

      }
    }
  }

}
</style>
