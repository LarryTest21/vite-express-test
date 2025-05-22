<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { userData } from "../../store/userData";
import moment from "moment";
import $ from "jquery";
import axios from "axios";
import readDotFunction from "./readDotFunction";
import { socketUsers } from "../../store/socketUsers";
import isEqual from 'lodash/isEqual';
import { vIntersectionObserver } from '@vueuse/components';
import colorPickerButton from "./colorPickerButton.vue";
import colorPicker from "./colorPicker.vue";

const emit = defineEmits(['socketRoom']);

const props = defineProps({
  chatUserData: Object,
  isTyping: Boolean,
  privateMessage: String,
  socket: Object,
  selfMessage: Object,
});

const privateMessage = ref(props.privateMessage);

const selfMessage = ref(props.selfMessage);

const socketIO = ref(props.socket);
const messagesArray = ref([]) as any;
const isTyping = ref();
const timeout = ref();
const lastmessage = ref() as any;
const newChange = ref(false);

const messagesScrolledBottom = ref(false);

function onElementVisibility(state: any) {
  if (state) {
    console.log("elementvisible", state);
    var message = messagesArray.value.findLast(
      (message: any) => message.read === false
    );

    const userSocket = socketUsers().socketUsers.filter(
      (socketUser: any) => socketUser.userID === props.chatUserData!._id
    );

    if (!isEqual(lastmessage.value, message)) {
      lastmessage.value = message;

      const messageIndex = '';
      lastmessage.value = messageIndex;

      if (userSocket != '') {
        const readMessage = {
          sendTo: userSocket[0].socketID,
          newChange: newChange.value,
        };
        props.socket!.emit("messageRead", readMessage);
      }
      axios
        .post("/api/user/refresh")
        .then((result) => {})
        .then(() => {
          const message = {
            messageIndex: messageIndex,
            senderID: props.chatUserData!._id,
            sendTo: userData().data._id,
          };
          axios.post("/api/user/readMessage", message);
        });
    }
  }
}
const isRunning = ref(false);

props.socket!.on("messageRead", function (data: any) {
  console.log(messagesArray.value[messagesArray.value.length - 1]);
  newChange.value = data.newChange;
  setTimeout(() => {
    if (newChange.value === true) {
      messagesArray.value.find((message: any) => {
        if (message.read === true && message.senderID == userData().data._id) {
          delete message.read;
        }
      });
      messagesArray.value.findLast((message: any) => {
        if (message.read === false) {
          message.read = true;
        }
      });
    } else {
      const ifLastRead = messagesArray.value.findLastIndex(
        (message: any) =>
          message.read === true && message.senderID == userData().data._id
      );

      if (ifLastRead === messagesArray.value.length - 1) {
      } else {
        messagesArray.value.findLast((message: any) => {
          if (message.read === true) {
            delete message.read;
          }
        });
        messagesArray.value.findLast((message: any) => {
          if (message.read === false) {
            message.read = true;
          }
        });
      }
    }

    const lastRead = messagesArray.value.findLast(
      (message: any) =>
        message.read === true && message.senderID != props.chatUserData!._id
    );
    if (lastRead != undefined) {
      delete lastRead.read;
    }

    console.log(messagesArray.value);
    messagesArray.value[data.messageID].read = true;

    newChange.value = false;
  }, 1000);
});
props.socket!.on("privateMessage", function (data: any) {
  isTyping.value = false;
  newChange.value = true;

  const message = {
    date: data.date,
    senderID: data.senderID,
    message: data.message,
    read: false,
  };

  if (messagesArray.value !== undefined) {
    messagesArray.value.push(message);
    if (messagesScrolledBottom.value === true) {
      $('.msg-wrapper')
        .stop()
        .animate(
          {
            scrollTop: $('.msg-wrapper')[0].scrollHeight,
          },
          100
        );
    }
  } else {
    messagesArray.value = [];
    messagesArray.value.push(message);
  }
});

props.socket!.on("userIsTyping", function (data: any) {
  if (messagesScrolledBottom.value === true) {
    $('.msg-wrapper')
      .stop()
      .animate(
        {
          scrollTop: $('.msg-wrapper')[0].scrollHeight,
        },
        100
      );
  }

  if (isTyping.value) {
    clearTimeout(timeout.value);
    timeout.value = setTimeout(() => {
      isTyping.value = false;
    }, 1000);
  } else {
    isTyping.value = true;
    timeout.value = setTimeout(() => {
      isTyping.value = false;
    }, 1000);
  }
});

watch(
  () => props.selfMessage,
  (newvalue) => {
    if (messagesArray.value !== undefined) {
      messagesArray.value.findLast((message: any) => {
        if (message.read === false) {
          delete message.read;
        }
      });
    } else {
      messagesArray.value = [];
    }

    const newMessage = { ...newvalue };
    messagesArray.value.push(newMessage);

    $('.msg-wrapper')
      .stop()
      .animate(
        {
          scrollTop: $('.msg-wrapper')[0].scrollHeight,
        },
        100
      );
  },
  { deep: true }
);

const user = computed(() => props.chatUserData);

onMounted(() => {
  if (userData().data.chatFriendColor != undefined) {
    const userColor = ref(
      userData().data.chatFriendColor.find(
        (user: any) => user[props.chatUserData!._id] != undefined || undefined
      )
    );
    if (userColor != undefined) {
      changedUserColor.value = userColor.value[props.chatUserData!._id];
    }
  }

  emit("socketRoom", user.value);

  axios.post("/api/user/refresh").then((result) => {
    if (result.data === 'success') {
      const getData = {
        senderID: userData().data._id,
        getFrom: user.value!._id,
      };

      axios
        .post("/api/user/getPrivateMessage", getData)
        .then((result) => {
          console.log(result.data);
          if (result.data !== null) {
            messagesArray.value = result.data!.messages;
          } else {
            messagesArray.value = undefined;
          }

          readDotFunction(messagesArray.value, props.chatUserData, true);
        })
        .then(() => {
          $('.msg-wrapper')
            .stop()
            .animate(
              {
                scrollTop: $('.msg-wrapper')[0].scrollHeight,
              },
              100
            );
        });
    }
  });
});

const showDateData = ref();
const showDate = (message: any) => {
  if (showDateData.value === message) {
    showDateData.value = 0;
  } else {
    showDateData.value = message;
  }
};

const checkLastread = (date: any) => {
  const numberTime = new Date(date).getTime();
  const numberTimeArray = ref([]) as any;
  messagesArray.value.forEach((message: any) => {
    if (message.read === true) {
      if (new Date(message.date).getTime() != numberTime) {
        numberTimeArray.value.push(new Date(message.date).getTime());
      }
    }
  });

  const getY = (date: any) =>
    numberTimeArray.value.find((number: any) => number >= date) || 0;

  console.log(getY(numberTime));
  if (getY(numberTime) === 0) {
    return true;
  }
};
const isVisible = ref();
const root = ref() as any;
const onIntersectionObserver2 = (data: any) => {
  console.log(data[0].isIntersecting);
  if (data[0].isIntersecting === true) {
    console.log("intersecting");
    const messageIndex = data[0].target.getAttribute("id");
    messagesArray.value[messageIndex].read = true;

    if (lastmessage.value != messageIndex) {
      const userSocket = socketUsers().socketUsers.filter(
        (socketUser: any) => socketUser.userID === props.chatUserData!._id
      );

      lastmessage.value = messageIndex;

      if (userSocket != '') {
        const readMessage = {
          sendTo: userSocket[0].socketID,
          newChange: newChange.value,
          messageID: messageIndex,
        };

        props.socket!.emit("messageRead", readMessage);
      }
    }

    axios
      .post("/api/user/refresh")
      .then((result) => {})
      .then(() => {
        const message = {
          messageIndex: messageIndex,
          senderID: props.chatUserData!._id,
          sendTo: userData().data._id,
        };
        axios.post("/api/user/readMessage", message);
      });
  }
};
const onScroll = (e: any) => {
  const { scrollTop, offsetHeight, scrollHeight } = e.target;
  if (scrollTop + offsetHeight >= scrollHeight) {
    messagesScrolledBottom.value = true;
  } else {
    messagesScrolledBottom.value = false;
  }
};
const changedUserColor = ref('var(--color-nav-txt)');

const changeColor = (color: string) => {
  changedUserColor.value = color;
  showColorPicker.value = false;
  axios.post("/api/user/refresh").then((result) => {
    if (result.data === 'success') {
      axios
        .post("/api/user/setFriendColor", {
          selfID: userData().data._id,
          friendID: props.chatUserData!._id,
          color: color,
        })
        .then((result) => {
          console.log(result.data);
        })
        .then(() => {
          const usercolor = userData().data.chatFriendColor.find(
            (user: any) => user[props.chatUserData!._id]
          );
          usercolor[props.chatUserData!._id] = color;
        });
    }
  });
};

const showColorPicker = ref(false);
</script>

<template>
  <div class="new-conversation">
    <Transition name="color-picker">
      <colorPicker class="color-picker" @changeColor="changeColor" v-if="showColorPicker"
      />
    </Transition>
    <div class="user">
      <img :src="user!.profilePic" alt="" />
      <div class="name">{{ user!.firstName }}</div>
      <colorPickerButton class="color-picker-button" @click="showColorPicker = !showColorPicker"
      />
      <div class="online-checker" v-if="user!.isConnected"></div>
    </div>
    {{ privateMessage }}
    <TransitionGroup tag="div" ref="msgWrapper" class="msg-wrapper" name="typing-skeleton" @scroll="onScroll"
    >
      <div class="message" v-for="(message, index) in messagesArray" :key="new Date(message.date).toString()" :class="message.senderID != userData().data._id ? 'friend' : 'self' "
      >
        <TransitionGroup tag="div" class="msg-read" name="read">
          <div class="last-msg-friend" :id="index.toString()" v-if="message.read === false && message.senderID === chatUserData!._id" v-intersection-observer="onIntersectionObserver2"
          ></div>

          <div class="read-dot" v-if="message.read === false && message.senderID === userData().data._id"
          />
          <div class="profile-pic-read" v-if="message.read === true && message.senderID === userData().data._id"
          >
            <img :src="user!.profilePic" />
          </div>
        </TransitionGroup>

        <div class="message-text" @click="showDate(message.date)" v-html="message.message"
        ></div>
        <transition name="date">
          <div class="date" v-if="showDateData === message.date">
            {{
              moment(new Date(message.date)).format("MMM DD, HH:mm") + " || "
            }}
          </div>
        </transition>
      </div>
      <div class="skeleton-wrapper" v-if="isTyping" key="2">
        <div class="typing-skeleton">
          <div class="jump1"></div>
          <div class="jump2"></div>
          <div class="jump3"></div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.new-conversation {
  height: 100%;
  width: 100%;
  overflow: hidden;

  .user {
    z-index: 12;
    position: relative;
    padding: 8px;
    background-color: v-bind(changedUserColor);
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    top: 0;
    justify-content: space-between;
    border-radius: 0 0 10px 10px;
    gap: 10px;
    color: var(--color-nav-bg);
    box-shadow: 4px 3px 5px 1px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease-in-out;
    img {
      height: 100%;
      width: auto;
    }
    .color-picker-button {
      align-self: flex-end;
      fill: white;
      height: 30px;
      cursor: pointer;
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
  .user.friend {
    right: 0;
  }

  .skeleton-wrapper {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding: 5px;
    .typing-skeleton {
      position: relative;
      background-color: rgb(0, 87, 90);
      border-radius: 20px;
      height: 35px;
      padding: 13px 2px;
      width: 60px;
      justify-content: space-around;
      display: flex;
      top: 0;

      &::after {
        content: '';
        z-index: -1;
        position: absolute;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        left: -4px;
        bottom: 0px;
        background-color: rgb(0, 87, 90);
      }
      &::before {
        content: '';
        position: absolute;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        left: -8px;
        bottom: -3px;
        background-color: rgb(0, 87, 90);
      }
    }

    .jump1,
    .jump2,
    .jump3,
    .jump4,
    .jump5 {
      width: 10px;
      height: 10px;
      border-radius: 100%;
      background-color: var(--color-nav-bg);
    }

    .jump1 {
      animation: typing 1.5s linear infinite;
      animation-delay: 01.1s;
    }

    .jump2 {
      animation: typing 1.5s linear infinite;
      animation-delay: 01.2s;
    }

    .jump3 {
      animation: typing 1.5s linear infinite;
      animation-delay: 01.3s;
    }

    .jump4 {
      animation: typing 1.5s linear infinite;
      animation-delay: 01.4s;
    }

    .jump5 {
      animation: typing 1.5s linear infinite;
      animation-delay: 1.5s;
    }

    @keyframes typing {
      0% {
        transform: translateY(0px);
      }

      25% {
        transform: translateY(0px);
      }

      35% {
        transform: translateY(2px);
      }

      45% {
        transform: translateY(0px);
      }

      60% {
        transform: translateY(-2px);
      }

      75% {
        background-color: rgb(0, 87, 90);
        transform: translateY(0px);
      }

      100% {
        transform: translateY(0px);
      }
    }
  }
  .msg-wrapper::-webkit-scrollbar {
    width: 10px;
    border-radius: 5px;
  }

  .msg-wrapper::-webkit-scrollbar-track {
    background: #c5c5c5;
    border-radius: 5px;
  }

  .msg-wrapper::-webkit-scrollbar-thumb {
    background: var(--color-nav-txt);
    border-radius: 10px;
  }
  .msg-wrapper {
    position: relative;
    max-width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    height: calc(100% - 50px);
    display: flex;
    flex-direction: column;
    overflow-anchor: auto;
    gap: 7px;
    padding: 10px;
    .message {
      position: relative;
      width: 100%;
      font-family: Roboto;
      font-size: 1rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;

      .msg-read {
        position: relative;
        display: flex;
        width: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        .read-dot {
          height: 20px;
          width: 20px;
          background-color: #bbb;
          border-radius: 50%;
        }
        .profile-pic-read {
          height: 20px;
          width: 20px;

          img {
            height: 20px;
            width: 20px;
            position: relative;
            top: 0;
            bottom: 0;
          }
        }
      }

      .message-text {
        max-width: 80%;
        position: relative;
        padding: 7px;
        border-radius: 10px;
        text-align: left;
        overflow: hidden;
        transition: all 0.3s ease-in-out;
      }

      .date {
        margin-top: 4px;
        font-size: 0.8rem;
        right: 0px;
        position: relative;
        text-align: right;
        font-weight: 900;
      }

      &.self {
        justify-content: flex-start;
        .message-text {
          background-color: rgb(0, 47, 90);
          color: var(--color-nav-bg);
        }
      }
      &.friend {
        justify-content: flex-end;
        .message-text {
          background-color: v-bind(changedUserColor);
          color: var(--color-nav-bg);
        }
      }
    }
  }
}
.typing-skeleton-move,
.typing-skeleton-enter-active,
.typing-skeleton-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1.5);
  opacity: 1;
}

.typing-skeleton-enter-from,
.typing-skeleton-leave-to {
  border-radius: 30px 0 0 30px;
  opacity: 0;
  transform: translateX(100px);
}
.typing-skeleton-leave-active {
  position: absolute;
}

.date-enter-active,
.date-leave-active {
  transition: all 0.1s ease-in-out;
  opacity: 1;
  max-height: 50px;
}

.date-enter-from,
.date-leave-to {
  max-height: 0px;
  opacity: 0;
  transform: translateX(-20px);
}

.read-move,
.read-enter-active,
.read-leave-active {
  transition: all 1s cubic-bezier(0.55, 0, 0.1, 1.2);
  opacity: 1;
}

.read-enter-from,
.read-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

.read-leave-active {
  position: absolute;
}

.color-picker-enter-active,
.color-picker-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1.2);
  opacity: 1;
}

.color-picker-enter-from,
.color-picker-leave-to {
  opacity: 0;
  transform: translateY(-40px);
}
</style>
