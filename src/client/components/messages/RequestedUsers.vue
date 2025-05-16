<script setup lang="ts">
import { ref, watch } from 'vue';
import { userData } from "../../store/userData";
import axios from "axios";
import AcceptRequest from "./AcceptRequest.vue";

const requestedUsersArray = ref() as any;
const isLoading = ref();

const requestPressedUser = ref();

const requestPressed = (user: any) => {
  requestPressedUser.value = user;
};

const emit = defineEmits(['deniedUser', 'acceptedUser', 'requestUsersEmpty']);

axios.post("api/user/refresh").then(() => {
  isLoading.value = true;

  axios.get("api/user/getAllUsers").then((res) => {
    const userArray = res.data;
    const requestedUsers = userData().data.friendsActions.requestUsers;

    requestedUsersArray.value = userArray.filter((item: any) =>
      requestedUsers.includes(item._id)
    );
    isLoading.value = false;
  });
});

const deniedUser = (user: any) => {
  requestedUsersArray.value = requestedUsersArray.value.filter(
    (val: any) => val._id !== user
  );

  userData().data.friendsActions.requestUsers =
    userData().data.friendsActions.requestUsers.filter((user: any) => {
      !(user != user);
    });
  if (userData().data.friendsActions.requestUsers.length === 0) {
    emit('requestUsersEmpty');
  }
  emit("deniedUser", user);
};

const acceptedUser = (user: any) => {
  userData().data.friendsActions.requestUsers = userData().data.friendsActions.requestUsers.filter((user2:any) => user2 != user._id )
  requestedUsersArray.value = requestedUsersArray.value.filter((user2:any) => user2 == user._id )
  emit("acceptedUser", user);
};
</script>

<template>
  <div class="requested-users-wrapper">
    <div class="requested-title" v-if="!isLoading">Friend Requests</div>
    <TransitionGroup name="requested">
      <div class="user" v-for="user in requestedUsersArray" :key="user._id" v-if="!isLoading"
      >
        <div class="click-part" @click="requestPressed(user._id)"></div>

        <transition name="request">
          <AcceptRequest v-if="requestPressedUser == user._id" class="accept-request" :user="user" @close="requestPressed" @denied="deniedUser" @accepted="acceptedUser"
          />
        </transition>

        <div class="profPic">
          <img :src="user.profilePic" alt="" />
        </div>
        <div class="user-text">
          <div class="username">
            {{ user.firstName }}
          </div>
          <div class="email">{{ user.email }}</div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.requested-users-wrapper {
  width: 100%;
  height: 100%;
  position: inherit;
  .requested-title {
    font-size: 1.2rem;
    padding: 10px;
    background-color: rgb(0, 87, 90);
    border-top: 2px solid var(--color-nav-bg);
    color: var(--color-nav-bg);
    border-radius: 0 0 10px 10px;
    box-shadow: 4px 3px 5px 1px rgba(0, 0, 0, 0.3);
  }
  .user {
    position: relative;
    width: 100%;
    height: 60px;
    cursor: pointer;
    color: var(--color-nav-txt);
    font-size: 1rem;
    display: grid;
    grid-template-columns: 50px 1fr 50px;
    padding-left: 10px;
    gap: 20px;
    transition: all 0.3s ease-in-out;
    .click-part {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .accept-request {
      position: absolute;
    }
    &.added {
      color: var(--color-nav-bg);
      border-bottom: 1px solid var(--color-nav-bg);

      background-color: green;
    }
    .profPic {
      height: 50px;
      top: 0;
      bottom: 0;
      margin: auto;

      img {
        height: 100%;
        width: auto;
      }
    }
    .user-text {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      .email {
        font-size: 0.6rem;
      }
    }

    .plus-icon {
      opacity: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 40px;
      justify-content: flex-end;
      transition: all 0.1s ease-in-out;
      fill: var(--color-nav-bg);
    }
    &:hover {
      background-color: var(--color-nav-txt-lighter);
      color: var(--color-nav-bg);
    }
    &:hover > .plus-icon {
      opacity: 1;
    }
  }
}

.requested-enter-active,
.requested-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1.5);
}

/* 2. declare enter from and leave to state */
.requested-enter-from,
.requested-leave-to {
  border-radius: 30px 0 0 30px;
  opacity: 0;
  transform: translateX(50px) rotateZ(0.01deg);
}
</style>
