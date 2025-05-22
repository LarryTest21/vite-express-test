<script setup lang="ts">
import { ref, watch } from "vue";
import { modalActive } from "../store/modalActive";
import { modalButtonActive } from "../store/modalButtonActive";

const emit = defineEmits(['emitAnswer', 'emitSaved', "closeModal"]);

const props = defineProps({
  modalAnimation: Boolean,
  loadingScale: Number,
  modalLoadingMessage: String,
  modalLoadingMessageColor: String,
  modalButtonMessage: String,
  backgroundOpacity: Number,
  spinnerColor: String,
  position: String,
  fontSize: String,
  modalQuestion: String,
  modalQuestion1: String,
  modalQuestion2: String,
  modalSaved: Boolean,
  socketAction: String,
  userInfo: Object,
});

const spinnerColor = ref(props.spinnerColor || 'var(--color-nav-txt)');
const modalLoadingMessageColor = ref(
  props.modalLoadingMessageColor || 'var(--color-nav-txt)'
);
const modalSaved = props.modalSaved;
const scaleMargin = props.loadingScale! * 20 + "px";

const closeModal = () => {
  emit("closeModal");
};

const emitAnswer = (target: any) => {
  emit("emitAnswer", target);
};

const emitSaved = (target: any) => {
  emit("emitSaved", target);
};

console.log(props.userInfo);
</script>

<template>
  <div class="modal" @click="closeModal" v-click-away="closeModal">
    <div class="user-action" v-if="props.socketAction != undefined">
      <div class="text" v-if="props.socketAction === 'userConnected'">
        Connected
      </div>
      <div class="usera denied">
        <div class="text" v-if="props.socketAction === 'userDenied'">
          Denied Friend Request
        </div>
      </div>
      <div class="usera requested">
        <div class="text" v-if="props.socketAction === 'userRequested'">
          Friend Request
        </div>
      </div>
      <div class="usera accepted">
        <div class="text" v-if="props.socketAction === 'userAccepted'">
          Friend Request Accepted
        </div>
      </div>
      <div class="name">
        {{ props.userInfo!.displayName }}
      </div>
      <img class="pfp" :src="props.userInfo!.profilePic" />
    </div>
    <TransitionGroup name="fade">
      <div class="wrapper" key="lorem1" v-if="modalLoadingMessage">
        <transition name="fade" mode="out-in">
          <p class="modal-message" :key="modalLoadingMessage" v-if="modalLoadingMessage"
          >
            {{ props.modalLoadingMessage }}
          </p>
        </transition>

        <transition name="fade" mode="out-in">
          <div class="modal-loading" :key="props.modalButtonMessage?.toString() || 10" v-if="props.modalAnimation"
          >
            <span class="loader"></span>

            <div class="lds-roller" key="lorem3">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </transition>
      </div>
    </TransitionGroup>

    <transition name="fade">
      <div class="modal-button" v-if="props.modalButtonMessage != undefined">
        <div class="modal-content">
          <p>
            {{ props.modalButtonMessage }}
          </p>
          <button>Close</button>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="modal-question" v-if="props.modalQuestion != undefined">
        <div class="question-text">{{ props.modalQuestion }}</div>
        <div class="buttons">
          <button class="modalQuestion1" @click.prevent="emitAnswer(1)">
            {{ props.modalQuestion1 }}
          </button>
          <button class="modalQuestion2" @click.prevent="emitAnswer(2)">
            {{ props.modalQuestion2 }}
          </button>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="modal-saved-post" v-if="modalSaved">
        <p>Would you like to load saved post?</p>
        <div class="buttons">
          <input type="button" value="Yes" class="yes" @click.prevent="emitSaved(1)"
          />
          <input type="button" value="No" class="no" @click.prevent="emitSaved(2)"
          />
          <input type="button" value="Delete" class="deelete" @click.prevent="emitSaved(3)"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.modal::before {
  position: absolute;
  content: "";
  height: 100%;
  width: 100%;
  background-color: var(--color-nav-bg);
  opacity: 0.9;
  opacity: v-bind(backgroundOpacity);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;
}

button {
  width: 80%;
  font-family: Chango;
  font-size: 1.5rem;
  border-radius: 18px;
  cursor: pointer;
  height: 50px;
  color: var(--color-nav-txt) !important;
  border-style: none;
  box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.3);
  background-color: var(--color-nav-bg);
  transition: all 0.1s ease-in-out;
}

button:hover {
  color: var(--color-nav-bg) !important;
  background-color: var(--color-nav-txt);
}

button:active {
  box-shadow: -1px -1px 1px 0.5px rgba(0, 0, 0, 0.3);
}

.modal {
  width: 100%;
  position: v-bind(position);
  justify-content: center;
  align-items: center;
  color: var(--color-nav-txt) !important;
  display: flex;
  flex-direction: column;
  z-index: 70;
  font-size: v-bind(fontSize);
  .user-action {
    position: relative;
    width: 100%;
    padding:10px;
    display:flex;
    flex-direction: column;
    align-items: center;
    font-size: 1rem;
    font-weight: 900;
    gap:7px;
    .text {
      text-align: center;
      font-family: Chango;
      font-size: 1.1rem;
    }

    .usera {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      align-self: center;
    }
    .name {
      font-size: 1rem;
      font-family: Roboto Condensed;
    }
    .pfp {
      height: 40px;
    }
  }
  .wrapper {
    position: relative;
    height: 100%;
    padding: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .modal-message {
    font-family: Chango;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: var(--color-nav-bg);
    color: v-bind(modalLoadingMessageColor);
  }

  .modal-content {
    text-align: center;
    display: flex;
    justify-content: center;

    p {
      top: 0;
      margin: 0;
    }
  }

  .modal-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: v-bind(scaleMargin);
    scale: v-bind(loadingScale);
  }

  .loader {
    width: 48px;
    height: 48px;
    border-width: 3px;
    border-style: dashed solid solid dotted;
    border-color: v-bind(spinnerColor) v-bind(spinnerColor) transparent
      v-bind(spinnerColor);
    border-radius: 50%;
    box-sizing: border-box;
    animation: rotation 1.5s linear infinite;
  }

  .loader::after {
    content: "";
    box-sizing: border-box;
    position: absolute;
    left: 20px;
    top: 31px;
    border: 10px solid transparent;
    border-right-color: v-bind(spinnerColor);
    transform: rotate(-40deg);
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
      opacity: 0;
    }

    25% {
      opacity: 1;
    }

    50% {
      opacity: 1;
    }

    75% {
      opacity: 1;
    }

    100% {
      transform: rotate(360deg);
      opacity: 0;
    }
  }

  .modal-button {
    position: absolute;

    .modal-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 30px;

      p {
        font-family: Chango;
        text-align: center;
        color: var(--color-nav-txt);
      }
    }
  }

  .modal-question {
    position: absolute;
    height: 100%;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;

    .question-text {
      text-align: center;
    }

    .buttons {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      justify-content: center;
      align-items: center;
    }
  }

  .modal-saved-post {
    position: relative;
    font-family: Chango;
    font-size: 2rem;
    display: flex;
    gap: 10px;
    padding: 10px;
    justify-content: space-around;

    p {
      display: flex;
      align-items: center;
    }

    .buttons {
      display: flex;
      gap: 10px;

      input[type="button"] {
        font-size: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color-nav-bg);
        font-family: Roboto Condensed;
        font-weight: 900;
        border-radius: 5px;
        box-sizing: border-box;
        cursor: pointer;
        color: var(--color-nav-txt);
        display: inline-block;
        position: relative;
        border: 1px solid transparent;
        transition: all 0.1s ease-in-out;
        box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.363);
        padding: 5px;
      }

      input[type="button"]:hover {
        background-color: var(--color-nav-bg-darker);
      }
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.4s ease-in-out;
    opacity: 1;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
