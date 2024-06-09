<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import axios from "axios";
//VIEWS
import PreviousChat from "./PreviousChat.vue";
import NewChat from "./NewChat.vue";
import AddUser from "./AddUser.vue";
import RequestedUsers from "./RequestedUsers.vue";
//EMOJIS
import sadEmoji from "../../components/messages/emojis/emoji_1.vue";
import happyEmoji from "../../components/messages/emojis/emoji_3.vue";
import ballEmoji from "../../components/messages/emojis/emoji_2.vue";
import cryingEmoji from "../../components/messages/emojis/emoji_4.vue";
import sadEmojiPng from "../../components/messages/emojis/emoji1.png";
import happyEmojiPng from "../../components/messages/emojis/emoji2.png";
import cryingEmojiPng from "../../components/messages/emojis/emoji3.png";
import ballEmojiPng from "../../components/messages/emojis/emoji4.png";

//ICONS
import messagePlus from "../../components/icons/plusmessage.vue";
import usersIcon from "../../components/icons/users.vue";
import backButton from "./backButton.vue";
//CHAT SOCKET
import { socketUsers } from "../../store/socketUsers";
import { io } from 'socket.io-client';
import { userData } from "../../store/userData";
//STORE
import { stopScroll } from "../../store/stopScroll";
import gsap from "gsap";

import svgSad from "./emojis/emoji_1";
import $ from 'jquery';

const requestNotif = ref();
const view = ref(0) as any;

const emit = defineEmits(['chatViewOpened', 'seledctedUser']);

watch(view, (viewValue: number) => {
  if (viewValue === 3) {
    emit("chatViewOpened", true);
  } else {
    emit("chatViewOpened", false);
  }
});

const props = defineProps({
  socketIO: Object,
  isTyping: Boolean,
  newChatUser: String,
});

const isTyping = computed(() => props.isTyping);

const socketIO = ref(props.socketIO);

watch(
  () => props.socketIO,
  (newvalue) => {
    if (newvalue != undefined) {
    }
  }
);

const messagesView = ref(0);
const text = ref();

const changeChat = () => {
  view.value === 0 ? (view.value = 1) : (view.value = 0);
};

const userIconClick = () => {
  if (requestNotif.value != 0) {
    view.value != 2 ? (view.value = 2) : (view.value = 1);
  } else {
    view.value = 1;
  }
};

const deniedUserFn = (user: any) => {
  const socketUser = socketUsers().socketUsers;

  const userSocket = socketUser.filter(
    (socketUser: any) => socketUser.userID === user._id
  );

  const data = {
    action: "deny",
    deniedUserSocketID: userSocket[0].socketID,
    deniedUserInfo: user,
    deniedBy: userData().data._id,
  };

  props.socketIO!.emit('userAllRequests', data);
};
const acceptedUser = (user: any) => {
  const socketUser = socketUsers().socketUsers;

  const userSocket = socketUser.filter(
    (socketUser: any) => socketUser.userID === user._id
  );

  const data = {
    action: "accept",
    acceptedUserSocketID: userSocket[0].socketID,
    acceptedUserInfo: user,
    acceptedBy: userData().data._id,
  };

  props.socketIO!.emit('userAllRequests', data);
};

const requestedUser = (user: any) => {
  const socketUser = socketUsers().socketUsers;

  const userSocket = socketUser.filter(
    (socketUser: any) => socketUser.userID === user._id
  );

  const data = {
    action: "request",
    requestedUserSocketID: userSocket[0].socketID,
    requestedUserInfo: user,
    requestedBy: userData().data._id,
  };

  props.socketIO!.emit('userAllRequests', data);
};

const changeView = () => {
  view.value = 0;
};

const chatUserData = ref();

const seledctedUser = (user: any) => {
  chatUserData.value = userArray.value.filter(
    (item: any) => item._id === user._id
  )[0];
  emit("seledctedUser", chatUserData);
  view.value = 3;
};
const showChatInput = ref();
watch(view, (newvalue: number) => {
  if (newvalue === 3) {
    showChatInput.value = true;
  } else {
    showChatInput.value = false;
  }
});

const userArray = ref();
const searchUserArray = ref();

axios.post("/api/user/refresh").then(() => {
  axios.get("/api/user/getAllUsers").then((res) => {
    userArray.value = res.data;

    let search = userData().data._id;

    userArray.value = userArray.value.filter((user: any) => {
      return user._id != search;
    });
    var isConnected = userArray.value.filter((arrayEl: any) =>
      socketUsers().socketUsers.some(
        (filterEl: any) => filterEl.userID === arrayEl._id
      )
    );

    if (isConnected.length != 0) {
      isConnected[0].isConnected = true;

      userArray.value = userArray.value.filter(function (user: any) {
        return user._id !== isConnected[0]._id;
      });
      userArray.value.unshift(isConnected[0]);
    }

    searchUserArray.value = userArray.value;
  });
});

watch(
  () => socketUsers(),
  () => {
    var isConnected = userArray.value.filter((arrayEl: any) =>
      socketUsers().socketUsers.some(
        (filterEl: any) => filterEl.userID === arrayEl._id
      )
    );

    if (isConnected.length != 0) {
      isConnected[0].isConnected = true;

      userArray.value = userArray.value.filter(function (user: any) {
        return user._id !== isConnected[0]._id;
      });
      userArray.value.unshift(isConnected[0]);
    } else {
      var disConnected = userArray.value.filter(function (user: any) {
        return user.isConnected === true;
      });
      if (disConnected.length != 0) {
        disConnected[0].isConnected = false;
        userArray.value = userArray.value.filter(function (user: any) {
          return user._id !== disConnected[0]._id;
        });
        userArray.value.unshift(disConnected[0]);
      }
    }
  },
  { deep: true }
);

const messageRef = ref();
const selfMessage = ref();
const messageInput = ref();

const socketRoom = (user: any) => {
//   messageInput.value!.addEventListener('input', function (data: any) {

//     const sendTo = socketUsers().socketUsers.filter(
//       (item: any) => item.userID === chatUserData.value._id
//     );
//     const typeData = {
//       isTyping: true,
//       userTyping: userData().data._id,
//       userSendTo: sendTo,
//     };

//     console.log(typeData);
//     props.socketIO!.emit('userIsTyping', typeData);
//   });

//   watch(
//     () => messageInput.value.innerHTML,
//     (newValue) => {
// console.log(newValue)

//     },
//     { deep: true }
//   );
};

const sendMessage = () => {
  emojiShow.value = false;

  var isConnected = socketUsers().socketUsers.some(
    (e: any) => e.userID === chatUserData.value._id
  );

  const sendTo = socketUsers().socketUsers.find(
    (e: any) => e.userID === chatUserData.value._id
  );

  const messageData = {
    senderID: userData().data._id,
    sendTo: chatUserData.value._id,
    message: messageInput.value.innerHTML,
    date: new Date(),
    read: false,
  };

  const uploadMessage = () => {
    axios.post("/api/user/refresh").then(() => {
      axios
        .post("/api/user/privateMessage", messageData)
        .then((result) => {
          console.log(messageData);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    });
  };

  if (
    isConnected &&
    messageInput.value.innerHTML != undefined &&
    messageInput.value.innerHTML != ''
  ) {
    Object.assign(messageData, { sendToSocket: sendTo });
    props.socketIO!.emit('privateMessage', messageData);
    console.log("triggeredfirst");

    selfMessage.value = messageData;
    uploadMessage();
    messageRef.value = '';
  } else if (
    !isConnected &&
    messageInput.value.innerHTML != undefined &&
    messageInput.value.innerHTML != ''
  ) {
    selfMessage.value = messageData;
    uploadMessage();
    messageRef.value = '';
  }
};
const emojiShow = ref();
onMounted(() => {
  if (userData().data != undefined) {
    requestNotif.value = userData().data.friendsActions.requestUsers.length;
  } else {
    watch(userData(), () => {
      requestNotif.value = userData().data.friendsActions.requestUsers.length;
    });
  }
});

watch(emojiShow, (newvalue) => {
  if (newvalue === true) {
    gsap.from([".emoji-wrapper>.emoji"], {
      delay: 0.1,
      duration: 0.5,
      stagger: 0.1,
      opacity: 0,
      y: 20,
      ease: "elastic",
      onComplete: function () {
        gsap.set(this.targets(), { clearProps: "all" });
      },
    });
  }
});
const emoji = ref();

const customSVG = ref("hi");

const insertSvg = (emoji: any) => {
  const svg = '<img src="' + emoji + '" width="21" height="21">';
  console.log(svg);
  // Place the SVG HTML at the end of the contenteditable area
  messageInput.value.innerHTML += svg;
  const range = document.createRange();
  const selection = window.getSelection();
  range.setStart(messageInput.value, messageInput.value.childNodes.length);
  range.collapse(true);
  selection!.removeAllRanges();
  selection!.addRange(range);
};
</script>

<template>
  <div class="messages-wrapper" @mouseover="stopScroll().state = true" @mouseleave="stopScroll().state = false"
  >
    <div class="title-add">
      <div class="title" @click="view = 0">Messages</div>
      <div class="add-user" @click="userIconClick">
        <div class="notif" v-show="requestNotif != 0 && requestNotif !=undefined"
        >
          {{ "+" + requestNotif }}
        </div>

        <usersIcon />
      </div>
    </div>
    <transition name="emoji">
      <div class="emoji-wrapper" v-show="emojiShow">
        <img class="emoji" src="./emojis/emoji_3.svg" @click="insertSvg(happyEmojiPng)"
        />
        <img class="emoji" src="./emojis/emoji_1.svg" @click="insertSvg(sadEmojiPng)"
        />
        <img class="emoji" src="./emojis/emoji_4.svg" @click="insertSvg(cryingEmojiPng)"
        />
        <img class="emoji" src="./emojis/emoji_2.svg" @click="insertSvg(ballEmojiPng)"
        />
      </div>
    </transition>

    <TransitionGroup tag="div" class="views" name="changeViews">
      <PreviousChat key="0" v-if="view === 0" />
      <AddUser key="1" v-if="view === 1" :userArray="userArray" :searchUser="searchUserArray" @deniedUser="deniedUserFn" @acceptedUser="acceptedUser" @addedUser="requestedUser" @send-message="seledctedUser"
      />
      <RequestedUsers key="2" v-if="view === 2" @requestUsersEmpty="changeView" @deniedUser="deniedUserFn" @acceptedUser="acceptedUser" @addedUser="requestedUser"
      />
      <NewChat :selfMessage="selfMessage" :chatUserData="chatUserData" :isTyping="isTyping" :socket="socketIO" @socketRoom="socketRoom" key="3" v-if="view === 3"
      />
    </TransitionGroup>

    <TransitionGroup tag="div" class="newmessage-chat" name="message-chat">
      <div class="new-message" key="1" v-if="!showChatInput" @click="changeChat"
      >
        New message <messagePlus class="svg" />
      </div>

      <div class="chat-input" v-if="showChatInput">
       
    
        <div class="back" @click="view = 1">
          <backButton class="back-button" />
        </div>
        <div class="message-input" contenteditable="true"></div>


        <button class="emoji-btn" @click="emojiShow = !emojiShow">
          <img class="emoji " src="../../components/messages/emojis/emoji2.png"
          />
        </button>

        <button class="send" @click="sendMessage">Send</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.messages-wrapper {
  position: fixed;
  z-index: -1;
  top: 75px;
  left: 5%;
  width: 350px;
  min-width: 350px;
  height: 410px;
  min-height: 410px;
  border-radius: 10px;
  box-shadow: 4px 8px 5px 0px rgba(0, 0, 0, 0.3);
  background-color: var(--color-nav-bg);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 7fr 1fr;
  flex-direction: column;
  font-family: Chango;
  text-align: center;
  font-size: 2rem;
  resize: auto;
  &::-webkit-resizer {
    border: solid var(--color-nav-bg);
    border-width: 0 3px 3px 0;
    display: inline-block;
  }
  .emoji-wrapper {
    overflow-y: hidden;
    overflow-x: auto;
    z-index: 1;
    position: absolute;
    bottom: 50px;
    right: 15px;
    padding: 5px;
    height: 40px;
    border-radius: 30px;
    border: 1px solid rgba(0, 0, 0, 0.459);
    background-color: var(--color-nav-bg);
    box-shadow: 1px 1px 3px 1px rgba(24, 24, 24, 0.493);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    .emoji {
      position: relative;
      height: 30px;
      transition: scale 0.1s ease-in-out;

      &:hover {
        scale: 1.15;
      }
    }
  }
  .title-add {
    position: relative;
    width: 100%;
    background-color: var(--color-nav-txt-darker);
    color: var(--color-nav-bg);
    display: flex;
    box-shadow: 0px 0px 5px 4px rgba(0, 0, 0, 0.377);
    z-index: 10;

    .title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      cursor: pointer;
      width: 100%;
      height: 100%;
      padding: 10px;

      &:hover {
        background-color: var(--color-nav-txt);
        color: var(--color-nav-bg);
      }
    }

    .add-user {
      position: relative;
      display: flex;
      height: 100%;
      padding: 5px;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      &:hover {
        background-color: white;
        svg {
          fill: var(--color-nav-txt-darker);
          stroke: var(--color-nav-bg);
        }
        svg:deep(.cls-2) {
          fill: var(--color-nav-bg);
        }
        .notif {
          color: var(--color-nav-txt-darker);
        }
      }
      svg {
        right: 0;
        height: 50px;
        transition: all 0.2s ease-in-out;
        fill: var(--color-nav-bg);
        stroke-width: 9px;
        stroke: var(--color-nav-txt-darker);
      }

      .notif {
        height: 100%;
        width: 30px;
        font-family: Chango;
        left: -13px;
        font-size: 1rem;
        transition: all 0.2s ease-in-out;
      }
    }
  }
  .views {
    position: relative;
    height: 100%;
    width: 100%;
    overflow-y: auto;
    overflow: hidden;
  }
  .newmessage-chat {
    z-index: 3;
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    .new-message {
      width: 100%;
      padding: 5px;
      text-align: center;
      font-size: 1.7rem;
      background-color: var(--color-nav-txt);
      color: var(--color-nav-bg);
      cursor: pointer;
      gap: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      .svg {
        width: 50px;
        height: 50px;
        fill: var(--color-nav-bg);
      }
    }
    .chat-input {
      display: flex;
      width: 100%;
      height: 3rem;
      padding: 5px;
      text-align: center;
      font-size: 1.7rem;
      color: var(--color-nav-bg);
      gap: 10px;
      border-radius: 20px;
      padding: 5px;
      background-color: var(--color-nav-bg);
      border: transparent;

      button {
        font-family: Chango;
        color: var(--color-nav-txt);
        font-family: Chango;
        font-size: 1.2rem;
        border-radius: 18px;
        height: 100%;
        cursor: pointer;
        color: var(--color-nav-txt) !important;
        border-style: none;
        background-color: var(--color-nav-bg);
        transition: all 0.1s ease-in-out;

        &:hover {
          color: var(--color-nav-bg) !important;
          background-color: var(--color-nav-txt-lighter);
        }
      }
      .back {
        top: 0;
        bottom: 0;
        margin: auto;
        position: absolute;
        height: 37px;
        border-radius: 50%;
        padding: 3px;
        display: flex;
        cursor: pointer;
        transition: all 0.1s ease-in-out;
        &:hover {
          background-color: var(--color-nav-txt-darker);
          .back-button {
            fill: var(--color-nav-bg);
          }
        }
        .back-button {
          height: 100%;
          fill: var(--color-nav-txt-darker);
          transition: all 0.1s ease-in-out;
        }
      }
      .emoji-btn {
        right: 45px;
        position: absolute;
        height: 80%;
        display: flex;
        align-items: center;
        img {
          position: relative;
          height: 90%;
        }
        &:hover {
          right: 60px;
          color: var(--color-nav-bg) !important;
          background-color: transparent;
          box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
        }
        &:active {
          box-shadow: inset 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
        }
      }
      .send {
        top: 0;
        bottom: 0;
        margin: auto;
        right: 0px;
        height: 38px;
        position: absolute;
        font-size: 1rem;
        box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.3);
      }
      .message-input {
        overflow-y: auto;
        width: 100%;
        height: 100%;
        box-shadow: 1px 1px 5px 2px rgba(0, 0, 0, 0.507);
        display: table-cell;
        text-align: left;
        vertical-align: middle;
        line-height: 1.9rem;
        background-color: transparent;
        border: transparent;
        border-radius: 30px;
        font-size: 1.1rem;
        font-family: Roboto Condensed;
        font-weight: 700;
        padding: 5px 70px 5px 40px;
        color: var(--color-nav-txt-darker);
        will-change: height;
        transition: all 0.2s ease-in-out;
        &:focus-visible{
          outline: none;
          box-shadow: 1px 1px 5px 2px var(--color-nav-txt) ;

        }
      }
    }
  }
}

.changeViews-move,
.changeViews-enter-active,
.changeViews-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  opacity: 1;
}
.changeViews-enter-from,
.changeViews-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.changeViews-leave-active {
  position: absolute;
}
.message-chat-move,
.message-chat-enter-active,
.message-chat-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  opacity: 1;
}
.message-chat-enter-from,
.message-chat-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.message-chat-leave-active {
  position: absolute;
}

.emoji-enter-active,
.emoji-leave-active {
  transition: all 0.2s cubic-bezier(0.55, 0, 0.1, 1);
  opacity: 1;
}
.emoji-enter-from,
.emoji-leave-to {
  opacity: 0;
  transform: translateY(50px);
}
</style>
