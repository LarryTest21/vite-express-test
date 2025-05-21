<script setup lang="ts">
import { ref } from "vue";
import emailSVG from "../components/icons/email.vue";
import passwordSVG from "../components/icons/password.vue";
import Modal from "../components/Modal.vue";
import { modalButtonActive } from "../store/modalButtonActive";
import { modalActive } from "../store/modalActive";
import { signedIn } from "../store/signedIn";
import { userTabClick } from "../store/userTabClick";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import db from "../firebase/firebaseInit";
import { userLoginClickMobile } from "../store/userLoginClickMobile";

const modalActivation = modalActive();
const { modalFalse } = modalActivation;
modalFalse();

const modalButtonMessage = ref();
const email = ref("");
const password = ref("");
const signedInCheck = signedIn();

const userLoginClick = userLoginClickMobile();

const modalButtonShow = ref(false);
const modalAnimation = ref(false);
const error = ref(false);
const loggedIn = ref(false);

const signIn = () => {
  modalButtonMessage.value = "";

  modalButtonShow.value = false;
  modalAnimation.value = true;
  modalActivation.state = true;


  firebase
    .auth()
    .signInWithEmailAndPassword(email.value, password.value)
    .then(() => {
      error.value = false;
      userLoginClick.state = false
      signedInCheck.state = true;
      localStorage.setItem("loggedIn", JSON.stringify(loggedIn));
      modalActivation.state = false;
    })
    .catch((err) => {
      error.value = true;
      modalAnimation.value = false;

      setTimeout(() => {
        modalButtonShow.value = true;
      }, 300);
      modalButtonMessage.value = err.code;

      if (err.code === "auth/invalid-email") {
        modalButtonMessage.value = "Invalid E-mail";
      } else if (err.code === "auth/wrong-password") {
        modalButtonMessage.value = "Wrong Password";
      }
    })
};
</script>

<template>
  <div class="mobile-login-wrap">
    <transition name="modal">
      <Modal v-if="modalActivation.state" :modalButtonShow="modalButtonShow" :modalButtonMessage="modalButtonMessage"
        :modalAnimation="modalAnimation" />
    </transition>

    <div class="inputs">
      <div class="login-input">
        <div class="input">
          <input type="text" placeholder="Email" v-model="email" @keyup.enter.native="signIn" />
          <emailSVG class="icon" />
        </div>

        <div class="input">
          <input type="password" placeholder="Password" v-model="password" @keyup.enter.native="signIn" />
          <passwordSVG class="icon" />
        </div>
      </div>
      <div class="buttons">
        <input type="button" value="LogIn" @click.prevent="signIn" />

        <RouterLink to="/register">
          <input type="button" value="Register" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mobile-login-wrap {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Chango;
  color: var(--color-nav-txt) !important;
  cursor: default;
  overflow: hidden;
  padding: 10px;

  .inputs {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .login-input {
      height: 100%;
      display: flex;
      flex-direction: column;

      .input {
        height: 100%;
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
          left: 0;
          width: 60px;
          height: 60px;
          stroke-width: 2px;
          fill: var(--color-nav-txt);
        }

        input {
          font-size: 2rem;
          width: 100%;
          height: 70px;
          font-family: Chango;
          border-style: none;
          background: transparent;
          border-bottom: solid rgba(0, 86, 167, 0.555);
          transition: all 0.1s ease-in-out;
        }

        input[type="button"] {
          width: 100%;
        }

        input[type="text"],
        input[type="password"] {
          padding: 5px 5px 5px 70px;
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
    }

    input::placeholder {
      color: var(--color-nav-txt);
      font-weight: Light;
    }

    input:focus::placeholder {
      color: transparent;
    }

    .buttons {
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: 10px;
      height: 100%;
      width: 100%;

      input[type="button"] {
        overflow: visible;
        width: 100%;
        height: 100%;
        font-family: Chango;
        font-size: 3rem;
        cursor: pointer;
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
        height: 100%;
        width: 100%;
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
@/store/userTabClick