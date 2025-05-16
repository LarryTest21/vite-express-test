<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import axios from "axios";
//ICONS
import searchIcon from "../../components/icons/search.vue";
import plusIcon from "../../components/icons/plus.vue";
import userRequestInIcon from "../../components/icons/userrequestin.vue";
import userRequestOutIcon from "../../components/icons/userrequestout.vue";
import friendIcon from "../../components/icons/checkmark.vue";
import writeMessageIcon from "../../components/icons/writemessage.vue";
//STORE
import { userData } from "../../store/userData";
//VIEWS
import AcceptRequest from "./AcceptRequest.vue";
import { socketUsers } from "../../store/socketUsers";

const props = defineProps({
  userArray: Array,
  searchUser: Array,
});

const userArray = ref(props.userArray) as any;
const searchUserArray = ref(props.searchUser) as any;

const searchClicked = ref(false);

const searcInputhRef = ref() as any;
const cursor = ref(false) as any;

const searchInput = ref() as any;

const resultsUserName = ref();
const resultsEmail = ref();

const results = ref([]) as any;
const resulstCheck = ref() as any;

const searchStarted = ref(false);
const isLoading = ref();
watch(
  () => searchInput.value,
  (newValue: any) => {
    if (newValue === '') {
      searchStarted.value = false;
    }
    isLoading.value = true;
    results.value.forEach((post: any) => {
      delete post.whereFound2;
      delete post.whereFound3;
    });

    if (newValue != "" || newValue != undefined) {
      results.value = [];
      resulstCheck.value = false;
      searchStarted.value = true;

      if (searchInput.value !== "") {
        resulstCheck.value = true;

        resultsUserName.value = searchUserArray.value!.filter(
          (item: any) =>
            item.firstName
              .toLowerCase()
              .indexOf(searchInput.value.toLowerCase()) !== -1
        );
        resultsEmail.value = searchUserArray.value!.filter(
          (item: any) =>
            item.email
              .toLowerCase()
              .indexOf(searchInput.value.toLowerCase()) !== -1
        );

        resultsUserName.value.forEach((post: any) => {
          const whereFound = { whereFound1: "email" };
          Object.assign(post, whereFound);

          const email = post;
          results.value.push(email);
        });
        resultsEmail.value.forEach((post: any) => {
          const whereFound = { whereFound2: "username" };
          Object.assign(post, whereFound);
          const username = post;
          results.value.push(username);
        });

        const ids = results.value.map((id: any) => id);
        results.value = results.value.filter(
          (id: any, index: any) => !ids.includes(id, index + 1)
        );

        isLoading.value = false;
      }
    }
  }
);
const emit = defineEmits([
  'addedUser',
  'deniedUser',
  'acceptedUser',
  'sendMessage',
  'selectedUser',
]);
const requestPressed = ref();
const userAddFn = (user: any) => {
  const currentUser = userData().data._id;

  const addedUser = ref(userData().data.friendsActions.addedUsers);
  const requestUsers = ref(userData().data.friendsActions.requestUsers);
  const acceptedUsers = ref(userData().data.friendsActions.acceptedUsers);

  if (
    addedUser.value != undefined &&
    addedUser.value.some((e: any) => e === user._id)
  ) {
  } else if (
    requestUsers.value != undefined &&
    requestUsers.value.some((e: any) => e === user._id)
  ) {
    console.log('requestUsers');

    requestPressed.value = true;
  } else if (
    acceptedUsers.value != undefined &&
    acceptedUsers.value.some((e: any) => e === user._id)
  ) {
    emit("sendMessage", user);
  } else {

    if (
      socketUsers().socketUsers.some((user2: any) => user2.userID === user._id)
    ) {

      emit("addedUser", user);
    }
    userData().data.friendsActions.addedUsers.push(user._id);

    // axios.post("api/user/refresh").then(() => {
    //   axios
    //     .post("api/user/addUser/" + currentUser, { id: user._id })
    //     .then((ress) => {
    //       if (ress.status == 200) {
    //         userData().data.friendsActions.addedUsers.push(user._id);
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error.response);
    //       console.log(results.value);
    //     });
    // });
  }
};

watch(
  () => socketUsers(),
  () => {
    var isConnected = userArray.value!.filter((arrayEl: any) =>
      socketUsers().socketUsers.some(
        (filterEl: any) => filterEl.userID === arrayEl._id
      )
    ) as any;

    if (isConnected.length != 0) {
      isConnected[0].isConnected = true;

      userArray.value = userArray.value!.filter(function (user: any) {
        return user._id !== isConnected[0]._id;
      });
      userArray.value.unshift(isConnected[0]);
    } else {
      var disConnected = userArray.value!.filter(function (user: any) {
        return user.isConnected === true;
      }) as any;
      if (disConnected.length != 0) {
        disConnected[0].isConnected = false;
        userArray.value = userArray.value!.filter(function (user: any) {
          return user._id !== disConnected[0]._id;
        });
        userArray.value.unshift(disConnected[0]);
      }
    }
  },
  { deep: true }
);

const addedCheck = (user: any) => {
  const request = ref(userData().data.friendsActions.requestUsers);
  const added = ref(userData().data.friendsActions.addedUsers);
  const accepted = ref(userData().data.friendsActions.acceptedUsers);

  if (
    request.value != undefined &&
    request.value.find((obj: any) => obj == user)
  ) {
    return 'requested';
  } else if (
    added.value != undefined &&
    added.value.find((obj: any) => obj == user)
  ) {
    return 'added';
  } else if (
    accepted.value != undefined &&
    accepted.value.find((obj: any) => obj == user)
  ) {
    return 'friend';
  }
};
const deniedUser = (user: any) => {
  requestPressed.value = false;
  userData().data.friendsActions.requestUsers =
    userData().data.friendsActions.requestUsers.filter(
      (array: any) => array != user._id
    );
  emit("deniedUser", user);
};
const acceptedUser = (user: any) => {
  requestPressed.value = false;
  userData().data.friendsActions.requestUsers =
    userData().data.friendsActions.requestUsers.filter(
      (array: any) => array != user
    );
  emit("acceptedUser", user);
};
onMounted(() => {
  emit("selectedUser");
});
</script>

<template>
  <div class="add-user-wrapper">
    <div class="search">
      <transition name="searchIcon">
        <searchIcon class="search-icon" v-if="!searchClicked" />
      </transition>
      <input ref="searcInputhRef" type="text" @focus="searchClicked = true" @blur="searchClicked=false" v-model="searchInput"
      />
    </div>
    <TransitionGroup name="search" tag="div" class="all-wrapper">
      <div class="users-array array" v-if="results.length === 0" key="1">
        <div class="title">All users</div>
        <TransitionGroup name="search">
          <div class="user" v-for="user in userArray" :key="1" :class="addedCheck(user._id)"
          >
            <div class="click-part" @click="userAddFn(user)"></div>
            <transition name="request">
              <AcceptRequest class="accept-request" v-if="addedCheck(user._id) == 'requested' && requestPressed" @close="requestPressed = false" :user="user" @denied="deniedUser" @accepted="acceptedUser"
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
            <plusIcon v-if="!addedCheck(user._id) " class="plus-icon" />
            <userRequestInIcon v-if="(addedCheck(user._id) === 'added')" class="request-icon in"
            />
            <writeMessageIcon v-if="(addedCheck(user._id) === 'friend')" class="friend-icon"
            />
            <userRequestOutIcon v-if="(addedCheck(user._id) === 'requested')" class="request-icon out"
            />
            <div class="online-checker" v-if="user.isConnected && (addedCheck(user._id) === 'friend')"
            ></div>
          </div>
        </TransitionGroup>
      </div>
      <div class="search-users-array array" v-if="results.length != 0" key="2">
        <TransitionGroup name="search2">
          <div class="title" v-if="!isLoading">Search results</div>
          <div :class="addedCheck(user)" class="user" v-for="user in results" :key="user._id" v-if="!isLoading" @click="userAddFn(user)"
          >
            <div class="click-part" @click="userAddFn(user)"></div>
            <transition name="request">
              <AcceptRequest class="accept-request" v-if="addedCheck(user._id) == 'requested' && requestPressed" @close="requestPressed = false" :user="user" @denied="deniedUser" @accepted="acceptedUser"
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
            <plusIcon v-if="!addedCheck(user._id) || (addedCheck(user._id) === 'friend') " class="plus-icon"
            />
            <userRequestInIcon v-if="(addedCheck(user._id) === 'added')" class="request-icon in"
            />
            <userRequestOutIcon v-if="(addedCheck(user._id) === 'requested')" class="request-icon out"
            />
          </div>
        </TransitionGroup>
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.add-user-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

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
    justify-self: center;
    gap: 20px;
    transition: all 0.3s ease-in-out;

    &.friend {
      background-color: green;
      color: var(--color-nav-bg);
    }
    .click-part {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .accept-request {
      position: absolute;
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
    .request-icon {
      position: relative;
      width: 50px;
      top: 0;
      bottom: 0;
      margin: auto;
      &.in {
        fill: var(--color-nav-txt-darker);
      }
      &.out {
        fill: rgb(0, 189, 0);
      }
    }
    .plus-icon {
      opacity: 0;
      height: 100%;
      right: 10px;
      position: relative;
      fill: var(--color-nav-bg);
      transition: all 0.2s ease-in-out;
    }
    &:hover > .plus-icon {
      opacity: 1;
    }
    .request-sent {
      position: absolute;
      font-size: 0.6rem;
      left: 80px;
    }
    .friend-icon {
      opacity: 0;
      height: 100%;
      width: 40px;
      right: 10px;
      position: absolute;
      fill: var(--color-nav-bg);
    }
    &:hover > .friend-icon {
      opacity: 1;
    }
    &:hover > .plus-message-icon {
      opacity: 1;
      position: absolute;
    }
    &:hover > .online-checker {
      animation: none;
      opacity: 0;
    }
    .online-checker {
      height: 25px;
      width: 25px;
      background-color: var(--color-nav-bg);
      border-radius: 50%;
      display: inline-block;
      top: 0;
      bottom: 0;
      margin: auto;
      margin-right: 20px;
      animation: 2s blinking infinite;
      transition: all 0.4s ease-in-out;
      box-shadow: inset 0px 0px 1px 1px rgba(0, 0, 0, 0.24);

      @keyframes blinking {
        0% {
          opacity: 1;
        }
        40% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
        60% {
          opacity: 1;
        }
        100% {
          opacity: 1;
        }
      }
    }
  }

  .search {
    position: relative;
    height: 40px;
    display: flex;
    padding: 3px;

    .search-icon {
      position: absolute;
      top: 5px;
      width: 27px;
      margin-left: 10px;
      fill: var(--color-nav-txt-darker);
    }
    input {
      padding-block: 0;
      padding-inline: 0;
      padding: 10px 20px;
      height: 100%;
      width: 100%;
      border-radius: 21px;
      background-color: var(--color-nav-bg-lighter);
      border: 1px solid var(--color-nav-txt);
      font-size: 1.3rem;
      color: var(--color-nav-txt-darker);
      font-family: Roboto Condensed;
      font-weight: 700;

      &:focus-visible {
        outline: 1px solid var(--color-nav-txt-darker);
      }
    }
  }

  .all-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;

    .array {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .title {
        font-size: 1rem;
        text-align: left;
      }
    }
  }
  .all-wrapper::-webkit-scrollbar {
    width: 10px;
    border-radius: 5px;
  }

  .all-wrapper::-webkit-scrollbar-track {
    background: #c5c5c5;
    border-radius: 5px;
  }

  .all-wrapper::-webkit-scrollbar-thumb {
    background: var(--color-nav-txt);
    border-radius: 10px;
  }
}

.user:nth-child(odd) {
  background-color: var(--color-nav-bg-darker);
}

.searchIcon-enter-active,
.searchIcon-leave-active {
  transition: all 0.1s cubic-bezier(0.55, 0, 0.1, 1);
}
.searchIcon-enter-from,
.searchIcon-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.search2-move,
.search2-enter-active,
.search2-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.search2-enter-from,
.search2-leave-to {
  opacity: 0;
  transform: translateX(100px) rotateZ(0.01deg);
}

.search2-leave-active {
  position: absolute;
}

.search-move,
.search-enter-active,
.search-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.search-move,
.search-enter-from,
.search-leave-to {
  opacity: 0;
}
.search-leave-active {
  position: absolute;
}

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
</style>
