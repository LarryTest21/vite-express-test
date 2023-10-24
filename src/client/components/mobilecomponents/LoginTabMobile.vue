<script setup lang="ts">
import { ref } from "vue";
import emailSVG from "../../components/icons/email.vue";
import passwordSVG from "../../components/icons/password.vue";
import Modal from "../../components/Modal.vue";
import { modalActive } from "../../store/modalActive";
import axios from "axios"


const modalActivation = ref();
modalActivation.value = false

const email = ref("");
const password = ref("");

const modalAnimation = ref(false);

const emit = defineEmits(['logOut'])

const signIn = () => {
  modalAnimation.value = true;
  modalActivation.value = true;

  // const API_URL = "/api/user/login"

  // const loginData = {
  //   email: email.value,
  //   password: password.value
  // }
};
</script>

<template>
  <div class="mobile-login-wrap">
    <transition name="modal">
      <Modal class="modal" v-if="modalActivation" :modalAnimation="modalAnimation" />
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

  .modal {
    position: absolute;
  }

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
      padding: 5px;
      gap: 10px;

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
          position: relative;
          left: 5px;
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

        input[type="button"] {
          width: 100%;
        }

        input[type="text"],
        input[type="password"] {
          padding: 5px 5px 5px 30px;
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
        border-radius: 5px;
        ;
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