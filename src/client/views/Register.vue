<script setup lang="ts">
import { ref, onMounted } from "vue";
import nameSVG from "../components/icons/user.vue";
import userSVG from "../components/icons/user.vue";
import emailSVG from "../components/icons/email.vue";
import passwordSVG from "../components/icons/password.vue";
import firebase from "firebase/compat/app";
import "firebase/auth";
import router from "../router";
import emailjs from '@emailjs/browser';
import Modal from "../components/Modal.vue"
import type { modalActive } from "../store/modalActive";
import { newUser } from "../store/newUser"
import { getAuth, signOut } from "firebase/auth";

const checkNewUser = newUser()

const firstName = ref("");
const lastName = ref("");
const user = ref("");
const email = ref("");
const password = ref("");

const displayName = ref("");

const errorCheck = ref(false);
const errorMsg = ref("");

const modalActivation = ref(false)
const modalLoadingMessage = ref()






const closeError = () => {
  if (errorCheck.value) {
    errorCheck.value = false;
  }
};

const register = async () => {
  const Auth = getAuth()

  let originalUser = Auth.currentUser

  if (
    firstName.value !== "" &&
    lastName.value !== "" &&
    user.value !== "" &&
    email.value !== "" &&
    password.value !== ""
  ) {
    errorCheck.value = false;
    errorMsg.value = "";


    const firebaseAuth = await firebase.auth();

    const createUser = await firebaseAuth
      .createUserWithEmailAndPassword(email.value, password.value)
      .catch((error) => {
        if (error.message == "Firebase: Error (auth/email-already-in-use).") {
          errorCheck.value = true;

          errorMsg.value = "E-mail already in use";
          return;
        } else {
          errorCheck.value = true;
          errorMsg.value = error.message;
        }
      })


    function sendEmail() {
      emailjs.send('service_p58jq8o', 'template_98lmab7', regParams, 'qgnn9s4h0TIn48Qgw')
        .then((result) => {


        }, (error) => {
          alert('there was an error')
        });
    }



    const regParams = {
      to_name: (firstName.value + " " + lastName.value),
      mail_to: email.value,
    }



    const result = await createUser!;






    checkNewUser.state = false;

    return;
  }
  errorCheck.value = true;
  errorMsg.value = "Please fill out all the fields correctly!";
  return;
};
const modalOff = () => {
  modalActivation.value = false
}

onMounted(() => {
})

</script>

<template>
  <transition name="modal">
    <div class="modal-wrapper" v-if="modalActivation">
      <Modal :modalLoadingMessage="modalLoadingMessage" :spinnerColor="'var(--color-nav-txt)'" :position="'absolute'"
        class="modal" :backgroundOpacity="1" v-click-away="modalOff" />
    </div>
  </transition>
  <div class="register-wrapper">
    <div class="form-wrap">
      <img src="../assets/logos/logo.svg" alt="" />


      <div class="inputs">

        <div class="register-title">Register an account</div>
        <div class="input">
          <input type="text" placeholder="First Name" v-model="firstName" />
          <nameSVG class="icon" />
        </div>

        <div class="input">
          <input type="text" placeholder="Last Name" v-model="lastName" />
          <userSVG class="icon" />
        </div>

        <div class="input">
          <input type="text" placeholder="Username" v-model="user" />
          <userSVG class="icon" />
        </div>

        <div class="input">
          <input type="text" placeholder="Email" v-model="email" />
          <emailSVG class="icon" />
        </div>

        <div class="input">
          <input type="password" placeholder="Password" v-model="password" />
          <passwordSVG class="icon" />
        </div>
        <div class="buttons">
          <input type="button" value="Register" @click.prevent="register" />
        </div>
        <transition name="error">
          <div class="error" v-if="errorCheck" v-click-away="closeError">
            <div class="error-msg"> {{ errorMsg }}
            </div>

          </div>

        </transition>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media (min-width: 1024px) {
  .modal-wrapper {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.548);
    z-index: 1;

    .modal {
      height: 400px;
      width: 800px;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      border-radius: 30px;
      overflow: hidden;
      box-shadow: 2px 2px 5px 5px rgba(0, 0, 0, 0.3);
    }
  }

  .register-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    padding-top: 70px;
  }

  .form-wrap {
    font-family: Chango;
    color: var(--color-nav-txt);
    font-size: 1rem;
    height: 100%;
    position: relative;
    left: 0;
    margin: auto;
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    gap: 50px;
    position: relative;


    img {
      width: 100px;
    }

    .inputs {
      background-color: var(--color-nav-bg) !important;
      border-radius: 20px;
      width: 50%;
      display: flex;
      padding: 10px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 30px;
      position: relative;
      overflow: hidden;

      .input {
        position: relative;
        border-color: var(--vt-c-nav-text-bg-hover);
        width: 60%;
        border-width: 2px;
        border-style: default;
        border-radius: 5px;
        transition: width 0.1s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;

        .icon {
          position: absolute;
          width: 50px;
          height: 50px;
          stroke-width: 2px;
          fill: var(--color-nav-txt);
          z-index: 0;
          pointer-events: none;
          transition: all 0.2s ease-in-out;
          left: -70px;
        }

        input {
          font-family: Chango;
          font-size: 1.3rem;
          padding: 0 0 10px 10px;
          width: 100%;
          height: 30px;
          background: transparent;
          border-style: none;
          border-bottom: solid var(--color-nav-txt);
          outline: none;
          transition: border-bottom 0.1s ease-in-out, width 0.1s ease-in;
          caret-color: var(--color-nav-txt);
        }

        input:active {
          border-style: none;
          border-bottom: solid rgba(0, 70, 88, 0.192);
        }

        input:focus {
          border-style: none;
          border-bottom: solid rgba(0, 70, 88, 0.192);
        }

        input:focus+.icon {
          opacity: 0;
        }
      }

      input,
      select,
      textarea {
        color: var(--color-nav-txt);
      }

      input::placeholder {
        color: rgba(52, 104, 158, 0.575);
        font-weight: Light;
        font-family: Chango;
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
        gap: 10px;

        display: flex;
        justify-content: center;
        margin: 5px;
        overflow: visible;
        text-decoration: none;

        input[type="button"] {
          overflow: visible;
          padding: 0 0;
          width: 50%;
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

      .error {
        position: absolute;
        background-color: white;

        .error-msg {
          position: relative;
        }
      }
    }
  }
}

.error-enter-active,
.error-leave-active {
  transition: all 0.1s ease-out;
  opacity: 0.9;
}

.error-enter-from,
.error-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease-out;
  opacity: 1;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
