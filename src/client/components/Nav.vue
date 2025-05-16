<script setup lang="ts">
//BASIC
import { RouterLink } from "vue-router";
import { ref, watch, onMounted } from "vue";
import $ from "jquery";
import gsap from "gsap";
import axios from "axios";
//MODULES
import LoginTab from "../components/LoginTab.vue";
import UserTab from "../components/UserTab.vue";
import Messages from "../components/messages/Messages.vue";
import Modal from "../components/Modal.vue";
//STORES
import { useTheme } from "../store/theme";
import { modalActive } from "../store/modalActive";
import { signedIn } from "../store/signedIn";
import { userTabClick } from "../store/userTabClick";
import { isAdmin } from "../store/isAdmin";
import { getweather } from "./Nav/weather";
import { timeCurrent } from "./Nav/time";
import { userData } from "../store/userData";
import { useRouter } from "vue-router";
import { blogSearch } from "../store/blogSearch";
import { blogSearchIcon } from "../store/blogSearchIcon";
import { socketUsers } from "../store/socketUsers";

//ICONS
import searchIcon from "../components/icons/search.vue";
import messageIcon from "../components/icons/message.vue";
//NOTIFICATION SOUNDS
import notifSound from "./messages/notificationSounds/signedIn.mp3";
//SCRIPTS
import "../components/newAnalytics";
import { io } from 'socket.io-client';

const searchIcon2 = blogSearchIcon();
const searchIconActive = ref(false);
const router = useRouter();
const searchActive = blogSearch();
const messageNotifCount = ref();

const userD = ref(userData());

const userConnectedInfo = ref() as any;
const userSocketNotif = ref();
const socketAction = ref();
const socket = ref();

const userIsInChat = ref();

const messageTabOpened = (value: boolean) => {
  userIsInChat.value = value;
};
const sendToUser = ref();
const seledctedUser = (user: any) => {
  sendToUser.value = user.value;
};

const userIsTyping = ref();

const messageGottenNotifCount = ref(0);

const socketIoFn = () => {
  socket.value = io();

  socket.value.on("userDisconnected", function (value: any) {
    var isPresent = socketUsers().socketUsers.some(function (user: any) {
      return user.socketID === value;
    });
    if (isPresent) {
      socketUsers().socketUsers = socketUsers().socketUsers.filter(
        (e: any) => e.socketID !== value
      );
    }
  });

  socket.value.on("privateMessage", function (message: any) {
    messageGottenNotifCount.value = ++messageGottenNotifCount.value;
  });

  const audio = ref();
  const notifConnected = new Audio("f");

  socket.value!.emit("userListRequest", "");

  socket.value!.on("userListRequest", function () {
    socket.value!.emit("userListInitial", {
      socketID: socket.value!.id,
      userID: userData().data._id,
      userInfo: userData().data,
    });
  });

  socket.value!.on("userDenied", function (deniedBy: any) {
    console.log(deniedBy.deniedUserInfo);
    userConnectedInfo.value = deniedBy.deniedUserInfo;

    socketAction.value = "userDenied";
    userSocketNotif.value = true;

    setTimeout(() => {
      userSocketNotif.value = false;
    }, 4000);

    userData().data.friendsActions.addedUsers =
      userData().data.friendsActions.addedUsers.filter(
        (user: any) => user != deniedBy.deniedBy
      );
  });
  socket.value!.on("userAccepted", function (acceptedBy: any) {
    console.log(acceptedBy);
    userConnectedInfo.value = acceptedBy.acceptedUserInfo;

    socketAction.value = "userAccepted";
    userSocketNotif.value = true;

    setTimeout(() => {
      userSocketNotif.value = false;
    }, 4000);

    userData().data.friendsActions.acceptedUsers.push(acceptedBy);
      userData().data.friendsActions.addedUsers =
      userData().data.friendsActions.addedUsers .filter(
        (user: any) => user != acceptedBy.acceptedBy
      );
      console.log(userData().data.friendsActions.addedUsers)
  });
  socket.value!.on("userRequested", function (requestedBy: any) {
    userConnectedInfo.value = requestedBy.requestedUserInfo;
    socketAction.value = "userRequested";
    userData().data.friendsActions.requestUsers.push(requestedBy.requestedBy);
    deleteMessagesNotif.value = true;
    userSocketNotif.value = true;
    setTimeout(() => {
      userSocketNotif.value = false;
    }, 4000);
  });

  socket.value!.on("userListInitial", function (value: any) {
    if (socketUsers().socketUsers != undefined) {
      var isPresent = socketUsers().socketUsers.some(function (user: any) {
        return user.userID === value.userID;
      });
      if (isPresent) {
        socketUsers().socketUsers = socketUsers().socketUsers.filter(
          (e: any) => e.userID !== value.userID
        );

        socketUsers().socketUsers.push(value);
      } else {
        socketUsers().socketUsers.push(value);
      }
    } else {
      socketUsers().socketUsers.push(value);
    }
  });

  socket.value.on("userListUpdate", async function (value: any) {
    socketAction.value = "userConnected";

    var isFriend = userData().data.friendsActions.acceptedUsers.some(
      (user2: any) => (user2._id = value.userID)
    );

    userConnectedInfo.value = {
      userName: value.userName,
      userProfilepic: value.userProfPic,
    };

    if (isFriend) {
      userSocketNotif.value = true;

      if (userData().data.userSettings.notifSounds) {
        setTimeout(() => {
          const audio = new Audio(notifSound);
          audio.play();
        }, 10);
      }

      setTimeout(() => {
        userSocketNotif.value = false;
      }, 2000);
    }

    if (socketUsers().socketUsers != undefined) {
      var isPresent = socketUsers().socketUsers.some(function (user: any) {
        return user.userID === value.userID;
      });
      if (isPresent) {
        socketUsers().socketUsers = socketUsers().socketUsers.filter(
          (e: any) => e.userID !== value.userID
        );

        socketUsers().socketUsers.push(value);
      } else {
        socketUsers().socketUsers.push(value);
      }
    } else {
      socketUsers().socketUsers.push(value);
    }
  });

  if (userD.value.data != undefined) {
    socket.value.on('connect', function () {
      socket.value.emit("userConnected", {
        socketID: socket.value.id,
        userID: userData().data._id,
        userProfPic: userData().data.profilePic,
        userName: userData().data.firstName,
      });
    });
  } else {
    watch(
      () => userD.value.data,
      () => {
        if (userD.value.data != undefined) {
          socket.value.on('connect', function () {
            socket.value.emit("userConnected", {
              socketID: socket.value.id,
              userID: userData().data._id,
              userProfPic: userData().data.profilePic,
              userName: userData().data.firstName,
            });
          });
        }
      },
      { deep: true }
    );
  }
};

const search = ref(false) as any;

const signedInCheck = signedIn();
const displayName = ref();

const notificationArray = ref([]) as any;
const notifCounter = ref(0);
const isActivated = ref();
const showNotif = ref(false);

watch(notificationArray.value, (newValue) => {
  if (!isActivated.value) {
    notifCounter.value = notificationArray.value.length + 1;
  } else {
    notifCounter.value = notificationArray.value.length;
  }
});

const themeCheck = ref(true);

if (userD.value.data != undefined) {
  if (userData().data.friendsActions.requestUsers.length != 0) {
    messageNotifCount.value =
      userData().data.friendsActions.requestUsers.length;
  }

  displayName.value =
    userD.value.data.firstName[0] + userD.value.data.lastName[0];
  if (userD.value.data.activated) {
    notifCounter.value = userD.value.data.notificationArray.length + 1;
  } else {
    notifCounter.value = userD.value.data.notificationArray.length;
  }
  if (userD.value.data.userSettings.themeCheck) {
    themeCheck.value = true;
  } else {
    themeCheck.value = false;
  }
} else {
  watch(
    () => userD.value.data,
    (newValue) => {
      if (newValue != undefined) {
        if (userData().data.friendsActions.requestUsers.length != 0) {
          messageNotifCount.value =
            userData().data.friendsActions.requestUsers.length;
        }

        if (newValue === undefined) {
          themeCheck.value = true;
        } else {
          if (userD.value.data.userSettings != undefined) {
            themeCheck.value = userD.value.data.userSettings.themeCheck;
          }
        }
      }
    },
    { deep: true }
  );
}

watch(
  signedInCheck,
  (newValue) => {
    if (newValue.state) {
      socketIoFn();
    }

    setTimeout(() => {
      if (signedInCheck.state) {
        showNotif.value = true;
      } else {
        showNotif.value = false;
      }
    }, 500);

    if (userData().data != undefined) {
      displayName.value =
        userD.value.data.firstName[0] + userD.value.data.lastName[0];
      if (userD.value.data.activated) {
        notifCounter.value = userD.value.data.notificationArray.length + 1;
      } else {
        notifCounter.value = userD.value.data.notificationArray.length;
      }
    } else {
      watch(
        userData(),
        () => {
          displayName.value =
            userD.value.data.firstName[0] + userD.value.data.lastName[0];
          if (userD.value.data.activated) {
            notifCounter.value = userD.value.data.notificationArray.length + 1;
          } else {
            notifCounter.value = userD.value.data.notificationArray.length;
          }
        },
        { deep: true }
      );
    }
  },
  { deep: true }
);
const isAdminCheck = isAdmin();

const langEn = ref(false) as any;
const langHu = ref(false) as any;

const Logo = new URL("../assets/logos/logo.svg", import.meta.url).href;

//FETCHING LOCATION FOR LANGUAGE

var requestUrl = "https://geolocation-db.com/json/";

$.ajax({
  url: requestUrl,
  type: "GET",
  success: function (json) {
    if (json.country_name == "Hungary") {
      langHu.value = true;
    } else {
      langEn.value = true;
    }
  },
});

const loginActivated = ref(false);
loginActivated.value =
  JSON.parse(localStorage.getItem("loggedInBefore")!) || false;
const activateLoginTab = ref(false);

const userTabClicked = userTabClick();

watch(
  userTabClicked,
  () => {
    if (userTabClicked.state && signedInCheck.state) {
      showNotif.value = false;
    } else {
      showNotif.value = true;
    }
  },
  { deep: true }
);
const activeLogin = () => {
  if (!activateLoginTab.value) {
    activateLoginTab.value = true;
  } else {
    activateLoginTab.value = false;
  }
};

const closeLoginTab = () => {
  const modalActivation = modalActive();
  if (activateLoginTab.value && !modalActivation.state) {
    activateLoginTab.value = false;
  }
};

const closeProfileTab = () => {
  console.log("closed");
  if (userTabClicked) {
    userTabClicked.state = false;
  }
};
function closeModal() {
  userTabClicked.state = false;
}

//THEME SCRIPT
const theme = useTheme();

const themeButtonChecked = ref();

if (theme.state === "theme-dark") {
  themeButtonChecked.value = true;
} else if (theme.state === "theme-light") {
  themeButtonChecked.value === false;
}

watch(
  () => theme.state,
  (newvalue) => {
    if (newvalue === "theme-dark") {
      themeButtonChecked.value = true;
    } else if (newvalue === "theme-light") {
      themeButtonChecked.value = false;
    }
  }
);

const themechange = () => {
  if (themeButtonChecked.value) {
    theme.state = "theme-light";
    localStorage.setItem("theme-color", "theme-light");
  } else if (!themeButtonChecked.value) {
    theme.state = "theme-dark";
    localStorage.setItem("theme-color", "theme-dark");
  }
};

const closeTab = () => {
  activateLoginTab.value = false;
};

//WEATHER
const city = ref();
const temp = ref();

const weatherHov = ref(false);
const timeWeatherUp = ref(false);

//TIME CALCULATION
const time = timeCurrent().time;

//WEATHER SCRIPT

//WEATHER HOVERING
const weatherHovered = () => {
  weatherHov.value = true;
};
const weatherUnHovered = () => {
  weatherHov.value = false;
};

//ACTIVATION LOGIN TAB

const navRef = ref();
const UserTabHeight = ref();

const showMessagesTab = ref();

onMounted(async () => {
  setTimeout(() => {
    watch(
      () => router.currentRoute.value.path,
      (newValue) => {
        if (newValue.toString() === "/bsl") {
          searchIconActive.value = true;
        } else {
          searchIconActive.value = false;
        }
      }
    );
  }, 100);

  const weather = getweather();

  setTimeout(() => {
    city.value = weather.city.value;
    temp.value = weather.temp.value;
  }, 1000);

  gsap
    .from([".nav-links>a, .nav-links>div"], {
      delay: 0.55,
      duration: 0.2,
      stagger: 0.05,
      y: -100,
    })
    .then(() => {
      if (router.currentRoute.value.path === "/bsl") {
        setTimeout(() => {}, 800);
        searchIconActive.value = true;
      }
      showNotif.value = true;
    });

  gsap.from(".weather-time", { delay: 0.8, opacity: 0 });
  if (themeCheck.value) {
    gsap.from(".theme-changer-wrapper", { delay: 1, opacity: 0 });
  }

  const intervalId = setInterval(function () {
    timeWeatherUp.value = true;
    setTimeout(function () {
      timeWeatherUp.value = false;
    }, 2000);
  }, 15000);

  axios.post("/api/user/refresh").then((result) => {
    if (result.data === 'success') {
      axios.post("/api/user/getPrivateMessage").then((result) => {});
    }
  });
});

const notifClickedRef = ref(false);
const notifClicked = (value: any) => {
  notifClickedRef.value = true;
};
const deleteMessagesNotif = ref(true) as any;
const deleteMesagesNotifFn = () => {
  deleteMessagesNotif.value = false;
};
</script>

<template>
  <header class="fullNav" ref="navRef">
    <div class="wrapper">
      <transition name="modal">
        <Modal  class="modal" v-if="userSocketNotif" :socketAction="socketAction" :userInfo="userConnectedInfo" :position="'absolute'"
        />
      </transition>
      <nav>
        <ul class="nav-links">
          <TransitionGroup name="hey">
            <RouterLink to="/" key="1">
              <div class="nav-logo">
                <img class="logo" :src="Logo" />
              </div>
            </RouterLink>
            <TransitionGroup name="user" tag="a" class="user-wrapper" key="user"
            >
              <div class="user-outer" key="1" v-if="signedInCheck.state!">
                <a class="user"
                   @click.native.prevent="userTabClicked.state = !userTabClicked.state; showMessagesTab = false"
                >
                  {{ displayName }}
                  <div class="notif-counter" v-if="showNotif && notificationArray.length != 0"
                       @click="notifClicked"
                  >
                    {{ notifCounter }}
                  </div>
                </a>
                <div class="messages">
                  <messageIcon @click="showMessagesTab = !showMessagesTab; userIsInChat=false; userTabClicked.state = false; deleteMesagesNotifFn()"
                  />
                  <div class="message-request-notif" v-if="userData().data.friendsActions.requestUsers.length != 0 && deleteMessagesNotif"
                  >
                    {{ messageNotifCount }}
                  </div>
                  <div class="message-notif" v-if="messageGottenNotifCount != 0"
                  >
                    {{ messageGottenNotifCount }}
                  </div>
                </div>
              </div>
              <div key="2"
                   v-if="!signedInCheck.state && loginActivated"
                   to="/login"
                   class="login"
                   @click.stop.prevent="activeLogin()"
              >
                <li>Login</li>
              </div>
            </TransitionGroup>
            <RouterLink to="/rulebook" key="3">
              <li>Rulebook</li>
            </RouterLink>
            <RouterLink to="/news" key="4">
              <li>News</li>
            </RouterLink>

            <RouterLink to="/bsl" key="5">
              <li>BSL</li>
            </RouterLink>
            <div class="search" v-if="searchIconActive" key="6">
              <searchIcon class="searchIcon"
                          @click="searchActive.state = !searchActive.state"
                          key="2"
              />
            </div>
            <RouterLink to="/custom-teams" key="7">
              <li>Shop</li>
            </RouterLink>
            <RouterLink to="/contact" key="8">
              <li>Contact</li>
            </RouterLink>
          </TransitionGroup>
        </ul>

        <div class="wt-wrapper">
          <div @mouseover="weatherHovered"
               @mouseleave="weatherUnHovered"
               :class="[
              'weather-time',
              { active: weatherHov },
              timeWeatherUp ? 'up' : 'down',
            ]"
          >
            <div class="time">{{ time }}</div>
            <div class="weather">
              <div class="city">{{ city }}</div>
              <div class="temp">{{ temp }}°C</div>
            </div>
          </div>
        </div>
        <div class="language-wrapper"></div>
        <transition name="fadeLogin">
          <div class="theme-changer-wrapper" v-if="themeCheck">
            <label class="theme-changer">
              <input v-model="themeButtonChecked"
                     type="checkbox"
                     class="button"
                     @click="themechange()"
              />
              <span class="slider round"></span>
            </label>
          </div>
        </transition>

        <transition name="fadeLogin">
          <LoginTab v-if="activateLoginTab && !signedInCheck.state"
                    v-click-away="closeLoginTab"
                    @emitRegister="activateLoginTab = !activateLoginTab"
          />
        </transition>
        <transition name="userTab">
          <UserTab class="usertab"
                   ref="UserTabHeight"
                   v-if="signedInCheck.state && userTabClicked.state"
                   @notifClicked="notifClicked"
                   v-click-away="closeProfileTab"
                   :isAdminCheck="isAdminCheck.state"
                   :notifCounter="notifCounter"
                   :notificationArray="notificationArray"
                   :closeTab="closeTab"
          />
        </transition>
        <transition name="userTab">
          <Messages :socketIO="socket" v-if="showMessagesTab" :isTyping="userIsTyping" @chatViewOpened="messageTabOpened" @seledctedUser="seledctedUser"
          />
        </transition>
      </nav>
    </div>
  </header>
</template>

<style scoped lang="scss">
.search {
  position: relative;
  bottom: 0;
  right: 0;
  display: flex;
  height: 100%;
  z-index: 1000;
  padding: 0 30px;
}
.fullNav {
  z-index: 100;
  position: fixed;
  width: 100%;
  height: 70px;

  .modal {
    z-index: -1;
    top: 73px;
    left: 0;
    right: 0;
    margin: auto;
    width: 210px;
    box-shadow: 4px 8px 5px 0px rgba(0, 0, 0, 0.24);
    border-radius: 20px;
    overflow: hidden;
  }

  .wrapper {
    height: 100%;
    width: 100%;

    nav {
      position: relative;
      background-color: var(--color-nav-bg);
      box-shadow: 4px 8px 5px 0px rgba(0, 0, 0, 0.24);
      gap: 20px;
      height: 100%;
      width: 100vw;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      transition: all 0.5s ease-out;
      overflow: hidden;

      .nav-links {
        position: relative;
        height: 100%;
        width: 90%;
        display: flex;
        margin-block-start: 0;
        padding-inline-start: 0;
        align-items: center;
        max-width: 85%;
        .search {
          height: 100%;
          position: relative;
          top: 0;
          display: flex;
          justify-content: center;
          .searchIcon {
            position: relative;
            width: 40px;
            height: auto;
            fill: var(--color-nav-txt-darker);
            cursor: pointer;

            &:hover {
              scale: 1.1;
            }
            &::after {
              content: "";
              height: 100%;
              width: 100%;
              position: absolute;
              box-shadow: #888;
              box-shadow: 0px 5px 15px 5px var(--color-nav-txt-lighter);
              left: 0;
            }
          }
        }

        a {
          color: var(--color-nav-txt);
          text-decoration: none;
          font-size: 1.3rem;
          text-transform: uppercase;
          font-family: Chango;
          height: 100%;
          padding: 0 2vw;
          position: relative;
          overflow: hidden;

          li {
            position: relative;
            list-style-type: none;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
          }
        }

        a::after {
          content: "";
          height: 100%;
          width: 100%;
          position: absolute;
          box-shadow: #888;
          box-shadow: 0px 5px 15px 5px var(--color-nav-txt-lighter);
          opacity: 0;
          left: 0;
          transition: all 0.2s ease-in-out;
        }

        a:hover::after {
          opacity: 1;
        }
        a:hover {
          background-color: var(--color-nav-bg);
          color: var(--vt-c-nav-text);
        }
        a:first-child::after {
          display: none;
        }
        a:first-child:hover::after {
          display: none;
        }
        a:first-child {
          background-color: transparent;
        }
        a:first-child {
          padding: 0;
          left: 0;
        }
        a:nth-child(2).router-link-exact-active::after {
          height: 0;
          width: 0;
        }
        a:nth-child(2)::after {
          display: none;
        }
        a:nth-child(2):hover::after {
          display: none;
        }
        a.router-link-exact-active:first-child {
          background-color: transparent;
        }
        a.router-link-exact-active {
          color: var(--color-nav-txt-darker);
        }
        a.router-link-exact-active:hover::after {
          opacity: 1;
        }
        a.router-link-exact-active::after {
          opacity: 1;
        }
        .user-wrapper {
          position: relative;
          .login {
            height: 100%;
            width: 100%;
            left: 0;
            cursor: pointer;
          }
          .user-outer {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            width: 100%;
            gap: 20px;

            .user {
              cursor: pointer;
              transform: translate(0, 0);
              align-self: center;
              border-radius: 50%;
              display: flex;
              width: 1px;
              height: 1px;
              padding: 32px;
              align-items: center;
              justify-content: center;
              color: var(--color-nav-user-txt);
              background: var(--color-nav-user);
              overflow: visible;
              .notif-counter {
                position: absolute;
                background-color: var(--color-nav-txt-lighter);
                box-shadow: 1px 1px 3px 1px rgba(32, 32, 32, 0.664);
                color: var(--color-nav-bg);
                font-family: Roboto Condensed;
                font-weight: 700;
                font-size: 1.3rem;
                z-index: 1;
                padding: 0 5px;
                top: 0px;
                right: 0;
                border-radius: 10%;
                display: flex;
                justify-content: center;
                align-items: center;
                animation: fading 2s ease-in-out infinite;
              }
              &:hover {
                background: var(--color-nav-user-hover);
              }

              a {
                position: absolute;
              }
            }
            @keyframes fading {
              0% {
                opacity: 0;
              }

              10% {
                opacity: 1;
              }

              90% {
                opacity: 1;
              }

              100% {
                opacity: 0;
              }
            }
            .messages {
              position: relative;
              height: 100%;
              display: flex;
              svg {
                width: 70%;
                min-width: 40px;
                cursor: pointer;
                fill: var(--color-nav-txt-lighter);
              }
              .message-request-notif {
                position: absolute;
                background-color: green;
                box-shadow: 1px 1px 3px 1px rgba(32, 32, 32, 0.664);
                color: var(--color-nav-bg);
                font-family: Roboto Condensed;
                font-weight: 700;
                font-size: 1.3rem;
                z-index: 1;
                padding: 0 5px;
                top: 2px;
                right: -10px;
                border-radius: 10%;
                display: flex;
                justify-content: center;
                align-items: center;
                animation: fading 2s ease-in-out infinite;
              }
            }
          }
        }

        .nav-logo {
          position: relative;
          left: 0;
          height: 100%;

          .logo {
            height: 70px;
            position: relative;
            padding: 2px;
          }
        }
      }
    }
  }

  .wt-wrapper {
    height: 100%;
    overflow: hidden;
    font-size: 1.2rem;
    display: flex;
    justify-content: center;
    .weather-time {
      top: -35px;
      height: 200%;
      display: flex;
      flex-direction: column;
      font-family: Chango;
      color: var(--color-nav-txt);
      transition: transform 0.1s ease-in-out;

      .weather {
        height: 50%;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        align-content: center;
      }

      .time {
        width: 100%;
        height: 50%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        align-content: center;
      }
    }

    .weather-time.up {
      transform: translateY(-50%);
    }

    .weather-time.down {
      transform: translateY(0%);
    }

    .weather-time.active {
      transform: translateY(-50%);
    }
  }

  .language-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    cursor: pointer;

    svg {
      border-radius: 10px;
      width: 50%;
      height: 50%;
    }
  }

  .theme-changer-wrapper {
    height: 100%;
    width: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 25px;

    .theme-changer {
      position: relative;
      width: 60px;
      height: 34px;
    }

    .button {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--color-nav-txt);
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: var(--color-nav-bg);
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }

    /* Rounded sliders */
    .slider.round {
      border-radius: 34px;
    }

    .slider.round:before {
      border-radius: 50%;
    }

    a.router-link-exact-active {
      span {
        transform: scale(1.1);
      }
    }
  }
}

.content-wrapper {
  position: relative;
  height: calc(100vh - 70px);
  bottom: -70px;
}

@keyframes weatherAnimHover {
  0% {
    transform: translateY(0%);
  }

  100% {
    transform: translateY(-50%);
  }
}

@keyframes weatherAnim {
  0% {
    transform: translateY(0%);
  }

  35% {
    transform: translateY(0%);
  }

  40% {
    transform: translateY(-50%);
  }

  50% {
    transform: translateY(-50%);
  }

  55% {
    transform: translateY(0%);
  }

  100% {
    transform: translateY(0%);
  }
}

.fullNav.medium {
  .wrapper {
    nav {
      .nav-links {
        a:first-child {
          padding: 0;
        }
        a {
          font-size: 1.8vw;
        }
      }
    }
  }
}
.user-enter-active,
.user-leave-active {
  transition: all 0.3s ease-in-out;
  opacity: 1;
}
.user-move {
  transition: none !important;
}
.user-enter-from,
.user-leave-to {
  transform: translateY(50px);
  opacity: 0;
}
.user-leave-to {
  position: absolute;
}

.fadeLogin-enter-active,
.fadeLogin-leave-active {
  transform: translateY(0px);
  transition: transform 0.3s;
}

.fadeLogin-enter-from,
.fadeLogin-leave-to {
  transform: translateY(-300px);
}

.userTab-enter-active,
.userTab-leave-active {
  transform: translateY(0px);
  opacity: 1;
  transition: transform 0.3s;
}

.userTab-enter-from,
.userTab-leave-to {
  transform: translateY(-120%);
}

.notif-enter-active,
.notif-leave-active {
  transform: translateY(0px);
  opacity: 1;
  overflow: hidden;
  transition: transform 0.3s;
}

.notif-enter-from,
.notif-leave-to {
  transform: translateY(-400px);
}

.modal-enter-active,
.modal-leave-active {
  opacity: 1;
  transition: transform 1s;
}

.modal-enter-from,
.modal-leave-to {
  transform: translateY(-200px);
}

.hey-move,
.hey-enter-active,
.hey-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.hey-enter-from,
.hey-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.hey-leave-active {
  position: absolute !important;
}
</style>
