<script setup lang="ts">
import { ref, watch } from 'vue';
import Modal from "../components/Modal.vue";
import PFP from "../components/AddPFP.vue";
import nameSVG from "../components/icons/user.vue";
import userSVG from "../components/icons/user.vue";
import emailSVG from "../components/icons/email.vue";
import passwordSVG from "../components/icons/password.vue";
import axios from 'axios';
import emailjs from "@emailjs/browser";
import { setMapStoreSuffix } from 'pinia';

const firstName = ref("");

const lastName = ref("");
const user = ref("");
const email = ref("");
const password = ref("");

const errorCheck = ref(false);
const errorMsg = ref("");

const modalActivation = ref(false);
const modalLoadingMessage = ref();
const modalAnimation = ref(false);
const modalErrorOff = ref(false);

const editProfPic = ref(false);
const PFPBase64 = ref();
const PFPEmitBase64 = (base64: any) => {
  PFPBase64.value = base64;
  PFPChangeText.value = "Change Image";
};

const PFPChangeText = ref('Select Profile Image');

const POST_URL = '/api/user/signUp';

const modalOff = () => {
  modalActivation.value = false;
};
const closeError = () => {
  errorCheck.value = false;
};
const addPFP = () => {
  editProfPic.value = true;
};

const register = () => {
  modalActivation.value = true;
  modalLoadingMessage.value = "Registering, please wait";
  modalAnimation.value = true;

  if (
    firstName.value !== "" &&
    lastName.value !== "" &&
    user.value !== "" &&
    email.value !== "" &&
    password.value !== ""
  ) {
    const info = {
      email: email.value,
      password: password.value,
      firstName: firstName.value,
      lastName: lastName.value,
      username: user.value,
      clearance: 'regular',
      activated: false,
      displayName: firstName.value + " " + lastName.value,
      profilePic: PFPBase64.value,
      userSettings: {},
    };

    axios
      .post(POST_URL, info)
      .then((response) => {
        const userID = response.data.data;
        var templateParams = {
          mail_to: email.value,
          reply_to: 'noreply@gmail.com',
          to_name: firstName.value + " " + lastName.value,
          message: userID,
        };

        return templateParams;
      })
      .then((params) => {
        console.log(params);
        emailjs
          .send(
            'service_p58jq8o',
            'template_98lmab7',
            params,
            'qgnn9s4h0TIn48Qgw'
          )
          .then(
            function (response) {
              console.log('SUCCESS!', response.status, response.text);
            },
            function (error) {
              console.log('FAILED...', error);
            }
          );
      })
      .then(() => {
        setTimeout(() => {
          modalActivation.value = true;
          modalAnimation.value = false;
          modalLoadingMessage.value =
            "Successfull registration, please activate your account with the link in the e-mail";
        }, 1000);
      })
      .catch((err) => {
        setTimeout(() => {
          modalActivation.value = true;
          modalAnimation.value = false;
          modalLoadingMessage.value = err.response.data.message;
        }, 500);
      });
  } else {
    modalActivation.value = true;
    modalAnimation.value = false;
    modalLoadingMessage.value = "Please fill out all the fields correctly!";
    return;
  }
};

const closePanel = () => {
  editProfPic.value = false;
};
</script>

<template>
  <div class="register-wrapper">
    <div class="form-wrap">
      <transition name="modal">
        <div class="modal-wrapper" v-if="modalActivation">
          <Modal :modalLoadingMessage="modalLoadingMessage" :modalAnimation="modalAnimation" :fontSize="'2rem'"
                 :spinnerColor="'var(--color-nav-txt)'" :position="'absolute'" class="modal" :backgroundOpacity="0.95"
                 v-click-away="modalOff" @click.prevent="modalOff"
          />
        </div>
      </transition>
      <img src="../assets/logos/logo.svg" alt="" />

      <div class="inputs">
        <div class="register-title">Register an account</div>
        <div class="input">
          <input type="text" placeholder="First Name" v-model="firstName" @keyup.enter.native="register"
          />
          <nameSVG class="icon" />
        </div>

        <div class="input">
          <input type="text" placeholder="Last Name" v-model="lastName" @keyup.enter.native="register"
          />
          <userSVG class="icon" />
        </div>

        <div class="input">
          <input type="text" placeholder="Username" v-model="user" @keyup.enter.native="register"
          />
          <userSVG class="icon" />
        </div>

        <div class="input">
          <input type="text" placeholder="Email" v-model="email" @keyup.enter.native="register"
          />
          <emailSVG class="icon" />
        </div>

        <div class="input">
          <input type="password" placeholder="Password" v-model="password" @keyup.enter.native="register"
          />
          <passwordSVG class="icon" />
        </div>
      </div>
      <div class="pfp">
        <transition name="pfp">
          <img :src="PFPBase64" v-if="PFPBase64 != undefined" />
        </transition>

        <input type="button" :value="PFPChangeText" @click.prevent="addPFP" />
      </div>
      <div class="buttons register">
        <input type="button" value="Register" @click.prevent="register" />
      </div>

      <transition name="pfp">
        <div class="pfp-popup-wrapper" v-if="editProfPic">
          <PFP class="pfp-popup" v-if="editProfPic" @pFPChange="PFPEmitBase64" @closePanel="closePanel"
               :propPFP="false"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
input[type="button"] {
  position: relative;
  overflow: visible;
  font-family: Chango;
  height: 100%;
  cursor: pointer;
  color: var(--color-nav-bg);
  border-style: none;
  box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.3);
  background-color: var(--color-nav-txt);
  transition: all 0.1s ease-in-out;
  font-size: 1rem;
  border-radius: 18px;
  overflow-wrap: break-word;
  width:170px;
  height:170px;
  font-size: 1.3rem;

  &:hover {
    background-color: var(--color-nav-bg);
    color: var(--color-nav-txt);
  }
}

input[type="button"]:active {
  box-shadow: -1px -1px 1px 0.5px rgba(0, 0, 0, 0.3);
}
.register-wrapper {
  position: relative;
  height: calc(100vh - 70px);
  width: 100%;
  display: flex;
  padding-top: 70px;
  justify-content: center;
  align-items: center;
}

.form-wrap {
  position: relative;
  font-family: Chango;
  color: var(--color-nav-txt);
  font-size: 1.5rem;
  height: 70%;
  position: relative;
  display: flex;
  flex-direction: colu;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: var(--color-nav-bg);
  border-radius: 18px;
  top: 40px;
  overflow: hidden;

  img {
    width: 100px;
    align-self: flex-start;
  }

  .inputs {
    border-radius: 20px;
    width: 100%;
    height: 100%;
    display: flex;
    padding: 10px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5%;
    position: relative;
    text-align: center;

    .input {
      position: relative;
      border-color: var(--vt-c-nav-text-bg-hover);
      width: 80%;
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
        left: -50px;
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
        transition:
          border-bottom 0.1s ease-in-out,
          width 0.1s ease-in;
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

      input:focus + .icon {
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
  }
  .buttons {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    margin: 5px;
    overflow: visible;
    text-decoration: none;

    &.register {
      max-height: 100%;
      width: 100%;
      align-items: center;
      height: 100px;

      input[type="button"] {
        height: 150px;
        width: 150px;
      }
    }
  }

  .pfp {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 30px;
    justify-content: center;
    align-items: center;

    input[type="button"] {
      border-radius: 100%;
      max-height: 150px;
      max-width: 150px;
      white-space: normal;
      word-wrap: break-word;
    }

    img {
      height: 200px;
      width: auto;
      align-self: center;
    }
  }

  .pfp-popup-wrapper {
    background-color: rgba(0, 0, 0, 0.322);
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .pfp-popup {
      position: relative;
      width: 70%;
      height: 90%;
    }
  }
}

.modal-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.4s ease-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.pfp-enter-active,
.pfp-leave-active {
  transition: all 0.2s ease-out;
  opacity: 1;
}

.pfp-enter-from,
.pfp-leave-to {
  opacity: 0;
  transform: translateY(-200px);
}

@media (max-height: 800px) {
  .register-wrapper {
    .form-wrap {
      width: 30%;

      img {
        height: 70px;
      }

      input[type="button"] {
        height: 120px;
        width: 120px;
        font-size: 1.2rem;
      }

      .inputs {
        font-size: 1.4rem;

        .buttons {
          &.register {
            font-size: 1.2rem;

            input[type="button"] {
              height: 60px;
              width: 130px;
              font-size: 1.2rem;
            }
          }
        }

        .input {
          width: 80%;

          .icon {
            height: 30px;
            left: -40px;
          }

          input {
            font-size: 0.8rem;
          }
        }
      }

      .pfp {
        img {
          height: 120px;
          border-radius: 50%;
          box-shadow: 1px 1px 4px 0.5px rgba(0, 0, 0, 0.658);
        }
      }
    }
  }
}

@media (max-height: 500px) {
  .register-wrapper {
    display: inline-block;
    height: 100vh;
    top: 0;
    padding: 0;
    bottom: 0;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;

    .form-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      top: 0;
      width: 100%;
      height: calc(100% - 80px);
      border-radius: 20px 20px 0 0;
      gap: 0;

      img {
        display: none;
      }

      input[type="button"] {
        height: 120px;
        width: 120px;
        font-size: 1.5rem;
      }

      .inputs {
        gap: 30px;
        font-size: 2rem;
        height: 100%;

        .register-title {
          display: none;
        }

        .input {
          width: 80%;
          height: 100%;

          .icon {
            height: 30px;
            left: -40px;
          }

          input {
            font-size: 1.5rem;
          }
        }
      }

      .register {
        width: 100%;
        display: flex;
        align-items: center;

        input[type="button"] {
          height: 60px;
          width: 100%;
          font-size: 2.5rem;
        }
      }

      .pfp {
        height: 100%;
        order: -1;
        width: 100%;

        img {
          height: 120px;
          border-radius: 50%;
          box-shadow: 1px 1px 4px 0.5px rgba(0, 0, 0, 0.658);
        }

        input[type="button"] {
          width: 80%;
          padding: 10px;
          border-radius: 20px;
        }
      }
    }
  }
}
</style>
