<script setup lang="ts">
import "firebase/compat/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { ref } from "vue";
import router from "../router";
import emailSVG from "../components/icons/email.vue";
import passwordSVG from "../components/icons/password.vue";

const email = ref();
const password = ref();
const loggedIn = ref(false);

const errorB = ref(false);
const errorMessage = ref();

const errorBFalse = () => {
  console.log(errorB);
  if (errorB.value) {
    errorB.value = false;
  }
};

const auth = firebase.auth();

const signIn = () => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email.value, password.value)
    .then(() => {
      loggedIn.value = true;
      localStorage.setItem("loggedIn", JSON.stringify(loggedIn.value));

      router.push({ name: "landing" });
    })
    .catch((error) => {
      errorB.value = true;
      errorMessage.value = error.message;
      console.log(error.message);

      if (error.message == "Firebase: Error (auth/invalid-email).") {
        errorMessage.value = "Invalid e-mail";
      } else if (error.message == "Firebase: Error (auth/wrong-password).") {
        errorMessage.value = "Wrong password";
      }
    });
};
</script>

<template>
  <div class="form-wrap">
    <img src="../assets/logos/logo.svg" alt="" />
    <div class="inputs">
      <div class="input">
        <input
          type="text"
          placeholder=""
          v-model="email"
          @focus="errorBFalse"
          @keyup.enter.native="signIn"
        />
        <emailSVG class="icon" />
      </div>
      <div class="input">
        <input
          type="password"
          placeholder=""
          v-model="password"
          @keyup.enter.native="signIn"
          @focus="errorBFalse"
        />
        <passwordSVG class="icon" />
      </div>
      <div class="buttons" v-click-away="errorBFalse">
        <RouterLink to="">
          <input @click="signIn" type="button" value="LogIn" />
        </RouterLink>

        <RouterLink to="/register">
          <input type="button" value="Register" />
        </RouterLink>
        <div class="error" v-if="errorB">{{ errorMessage }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@media (min-width: 1024px) {
  .form-wrap {
    position: relative;
    left: 0;
    margin: auto;
    height: 100vh;
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-content: center;
    gap: 50px;
    overflow: hidden;

    img {
      width: 200px;
    }
    .inputs {
      background-color: var(--color-nav-bg) !important;
      width: 50%;
      height: 300px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 25px;

      .input {
        border-color: var(--vt-c-nav-text-bg-hover);
        width: 50%;
        border-width: 2px;
        border-style: default;
        border-radius: 5px;
        transition: width 0.1s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;

        .icon {
          position: absolute;
          height: 25px;
          width: 25px;
          left: 0px;
          stroke-width: 2px;
          fill: var(--color-nav-txt);
          z-index: 0;
          pointer-events: none;
          transition: all 0.2s ease-in-out;
        }
        input {
          padding: 0 0 0 30px;
          width: 100%;
          height: 30px;
          font-family: Chango;
          background: transparent;
          border-style: none;
          border-bottom: solid var(--color-nav-txt);
          outline: none;
          transition: border-bottom 0.1s ease-in-out, width 0.1s ease-in;
          caret-color: var(--color-nav-txt);
        }
        input:active {
          width: 100%;
          border-style: none;
          border-bottom: solid rgba(0, 70, 88, 0.192);
        }
        input:focus {
          border-style: none;
          border-bottom: solid rgba(0, 70, 88, 0.192);
          width: 100%;
        }
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

      .buttons {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 100%;
        gap: 25px;

        a {
          width: 50%;
        }
        input[type="button"] {
          overflow: visible;
          padding: 0 0;
          width: 100%;
          font-family: Chango;
          font-size: 16px;
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
      }
    }
  }
}
</style>
