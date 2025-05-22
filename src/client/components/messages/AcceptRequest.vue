<script setup lang="ts">
import { ref } from 'vue';
import acceptIcon from "../../components/icons/checkmark.vue";
import denyIcon from "../../components/icons/deny.vue";
import axios from "axios";
import { userData } from "../../store/userData";

const emit = defineEmits(["close", "denied", "accepted"]);

const props = defineProps({ user: Object });

const closeFN = () => {
  emit("close");
};

const accepted = ref('inbetween') as any;

const acceptUser = () => {
  accepted.value = true;

  accepted.value = false;
  // axios
  //   .post("api/user/refresh")
  //   .then(() => {
  //     axios.post("api/user/acceptUser/" + userData().data._id.toString(), {
  //       id: props.user!._id,
  //     });
  //   })
    // .then(() => {
      emit("accepted", props.user);
    // });

  setTimeout(() => {
    closeFN();
  }, 1500);
};

const denyUser = () => {
  accepted.value = false;
  axios
    .post("api/user/refresh")
    .then(() => {
      axios.post("api/user/denyUser/" + userData().data._id.toString(), {
        id: props.user!._id,
      });
    })
    .then(() => {
      emit("denied", props.user);
    });

  setTimeout(() => {
    closeFN();
  }, 1500);
};
</script>

<template>
  <div class="accept-wrapper">
    <div class="accept-or-not" @click="closeFN">Accept request?</div>
    <div class="icons">
      <TransitionGroup name="iconDisappear">
        <acceptIcon v-if="accepted === 'inbetween' || accepted" @click="acceptUser" class="checkmark icon"
        />
        <denyIcon v-if="accepted === 'inbetween' || !accepted" @click="denyUser" class="deny icon"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.accept-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 10;
  gap: 20px;
  background-color: var(--color-nav-txt-darker);
  .accept-or-not {
    position: relative;
    font-size: 1.2rem;
    color: var(--color-nav-bg);
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .icons {
    position: relative;
    height: 100%;
    width: 150px;
    display: flex;
    gap: 10px;
    .icon {
      bottom: 0;
      top: 0;
      margin: auto;
      z-index: 10;
      cursor: pointer;
      width: 40px;
      height: auto;
    }

    .checkmark {
      fill: rgb(0, 192, 0);
    }
    .deny {
      fill: rgb(226, 0, 0);
    }
  }
}

.iconDisappear-move,
.iconDisappear-enter-active,
.iconDisappear-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.iconDisappear-enter-from,
.iconDisappear-leave-to {
  opacity: 0;
  transform: translateX(100px) rotateZ(0.01deg);
}
.iconDisappear-leave-active {
  position: absolute;
}

.request-move,
.request-enter-active,
.request-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1.5);
}

/* 2. declare enter from and leave to state */
.request-enter-from,
.request-leave-to {
  border-radius: 30px 0 0 30px;
  opacity: 0;
  transform: translateX(100px) rotateZ(0.01deg);
}

.request-leave-active {
  position: absolute;
}
</style>
