<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { userData as userD } from "../store/userData";
import profUserTab from "../components/profile/profUserTab.vue";
import profHistoryTab from "../components/profile/profHistoryTab.vue";
import profSettings from "../components/profile/profSettings.vue";
import { isMobile } from "../store/isMobile";
import Modal from "../components/Modal.vue";

const mobile = isMobile();
const readPosts = ref();
const userData = userD();

const userName = userData.data.userName;

const profile = ref();
const settings = ref();
const historyEnabled = ref();
const history = ref();

const overflow = ref('hidden');

if (userData == undefined) {
} else {
  if (userData.data.userSettings.readPosts === undefined) {
    historyEnabled.value = false;
  } else {
    historyEnabled.value = userData.data.userSettings.readPosts;
  }
}

watch(
  userData,
  () => {
    historyEnabled.value = userData.data.userSettings.readPosts;
  },
  { deep: true }
);

const userPFP = ref();
userPFP.value = localStorage.getItem("avatar");

const modalActivation = ref(false);
const modalMessage = ref();

const saved = (e: any) => {
  console.log(`output->e`, e);
  modalMessage.value = "Settings Saved";
  modalActivation.value = true;

  setTimeout(() => {
    modalActivation.value = false;

  }, 1000);
};

const enableTab = (event: any) => {
  profile.value = false;
  settings.value = false;
  history.value = false;
  overflow.value = "hidden";
  if (event.target.value === 1) {
    profile.value = true;
  } else if (event.target.value === 2) {
    settings.value = true;
  } else if (event.target.value === 3) {
    history.value = true;
  }
  setTimeout(() => {
    overflow.value = "auto";
  }, 300);
};

const tabs = ref();
onMounted(() => {
  profile.value = true;
  setTimeout(() => {
    tabs.value = 'tabs';
  }, 10);
});
</script>

<template>
  <div class="profile-wrapper">
    <div class="profile-wrapper-inner">
      <div class="show">
        <transition name="modal">
          <Modal v-if="modalActivation" class="modal-div" :position="'absolute'" :modalLoadingMessage="modalMessage" 
             :fontSize="'3rem'" @click="modalActivation = false"
          />
        </transition>
        <div class="username">{{ userName }}</div>

        <div class="cat-tab">
          <TransitionGroup class="categories" tag="ul" name="tabs">
            <li value="1" :class="profile ? 'active' : ''" @click="enableTab" key="1"
            >
              Profile
            </li>
            <li value="2" :class="settings ? 'active' : ''" @click="enableTab" key="2"
            >
              Settings
            </li>
            <li value="3" :class="history ? 'active' : ''" v-if="historyEnabled" @click="enableTab" key="3"
            >
              History
            </li>
          </TransitionGroup>
          <TransitionGroup class="tabcontainer" tag="div" :name="tabs">
            <profUserTab v-if="profile" :userData="userData" key="1" />
            <profSettings v-if="settings" :userData="userData" key="2" @settingsSaved="saved"
            />
            <profHistoryTab v-if="history" :userData="userData" key="3" />
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
*::-webkit-scrollbar {
  width: 10px;
  border-radius: 5px;
}

*::-webkit-scrollbar-track {
  background: #c5c5c5;
  border-radius: 5px;
}

*::-webkit-scrollbar-thumb {
  background: var(--color-nav-txt);
  border-radius: 10px;
}

.profile-wrapper {
  height: calc(100vh - 70px);
  width: 100%;
  padding-top: 70px;

  .profile-wrapper-inner {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px;
    overflow: hidden;

    .show {
      position: relative;
      height: 100%;
      width: 700px;
      background-color: var(--color-nav-bg);
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 1px 3px 5px 4px rgb(2, 60, 114);
      .modal {
        position:absolute;
        height: 100%;
        width: 100%;
      }
      .username {
        position: relative;
        width: 100%;
        font-family: Chango;
        font-size: 2rem;
        padding: 10px;
        padding-left: 30px;
        background-color: var(--color-nav-txt);
        color: var(--color-nav-bg);
      }

      .cat-tab {
        display: flex;
        width: 100%;
        font-family: Chango;
        font-weight: 900;
        color: var(--color-nav-txt);
        height: 100%;
        overflow: hidden;

        .categories {
          position: relative;
          font-size: 1.5rem;
          padding-inline-start: 0;
          list-style-type: none;
          display: flex;
          flex-direction: column;

          &::after {
            content: "";
            position: absolute;
            right: 0px;
            width: 2px;
            z-index: 0;
            height: 100%;
            background-color: var(--color-nav-bg-darker);
          }

          li {
            margin-top: 40px;
            position: relative;
            margin: 5px;
            width: 100%;
            z-index: 1;
            list-style-type: none;
            margin: 0;
            transition: all 0.2s ease-in-out;
            border-radius: 0 10px 10px 0;
            cursor: pointer;
            padding: 10px;
          }

          li:hover {
            background-color: var(--color-nav-txt);
            color: var(--color-nav-bg);
          }

          li:first-child:hover {
            border-radius: 0 0 10px 0;
          }

          li.active {
            background-color: var(--color-nav-txt);
            color: var(--color-nav-bg);
          }

          li:first-child.active {
            border-radius: 0 0 10px 0;
          }
        }

        .tabcontainer {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
      }
    }
  }
}

.tabs-move,
.tabs-enter-active,
.tabs-leave-active {
  transition: all 0.2s ease-in-out;
}

.tabs-enter-from,
.tabs-leave-to {
  transform: translateY(200px);
  opacity: 0;
}

.tabs-leave-active {
  position: absolute;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease-in-out;
}

.modal-enter-from,
.modal-leave-to {
  transform: translateY(-200px);
  opacity: 0;
}
</style>
