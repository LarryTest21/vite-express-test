<script setup lang="ts">
import { ref, watch, onMounted, Ref, computed, h } from "vue"
import EditProfilePicture from "../../components/profile/EditProfilePicture.vue";
import Modal from "../../components/Modal.vue";
import Field from "./Field.vue";
import Password from "./Password.vue";
import isEqual from 'lodash/isEqual';
import { profPicEnable } from "../../store/profPicEnable";
import { base64NoPFP } from "../../components/icons/nopfpbase64";
import nameSVG from "../../components/icons/user.vue";
import userSVG from "../../components/icons/user.vue";
import emailSVG from "../../components/icons/email.vue";
import axios from "axios";
import $ from "jquery";
import { useSwipe } from "@vueuse/core";
import { userData } from "../../store/userData";
import { storedTokens } from "../../store/accesToken"
import { signedIn } from "../../store/signedIn"
import { isAdmin } from "../../store/isAdmin"


const admin = isAdmin()

const loggedIn = signedIn()

const grabber = ref(null);
const parent = ref(null);
const { isSwiping, direction } = useSwipe(parent);
const accToken = storedTokens()

const device = ref(document.getElementById("app")!.classList.contains("mobile"));
const grabberBoolean = ref(false);

const props = defineProps({
  userData: Object,
});

// Skeleton
const skeletonLoad = ref(true);

// Modal
const modalActivation = ref(false);
const modalAnimation = ref();
const modalLoadingMessage = ref();
const modalButtonMessage = ref();
const modalQuestion = ref()
const modalBackgroundColor = ref()
const modalFontColorLoadingMessage = ref()
const modalFontSize = ref()
// Profile picture
const noPFP = ref(false);
const userPFP = ref();
const editProfPic = profPicEnable();
const profPicEnableFn = () => (editProfPic.state = true);

const editProPicPanel = () => {
  editingProfile.value = !editingProfile.value;
  pwOp.value = editingProfile.value;
};

// User data
const email = ref("");
const firstName = ref("");
const lastName = ref("");
const userName = ref("");
const userID = ref("");
const currentPassword = ref('');
const newPassword1 = ref('');
const newPassword2 = ref('');
const doPasswordsMatch = ref();
const changingPasswordTrigger = ref(false)



function checkPasswordLengthMatch(newPassword1: String, newPassword2: String) {

  if (newPassword2.length === 0 || newPassword1.length === 0) {
    doPasswordsMatch.value = undefined
    return false;
  }

  if (newPassword1 === newPassword2) {

    doPasswordsMatch.value = true
  } else {
    doPasswordsMatch.value = false
  }

  return true;
}

watch(() => newPassword2.value, () => {
  if (newPassword2.value.length < 3) {
    doPasswordsMatch.value = undefined
    return;
  } else {
    checkPasswordLengthMatch(newPassword1.value, newPassword2.value);
  }
});



if (props.userData?.data) {
  const d = props.userData.data;
  email.value = d.email;
  firstName.value = d.firstName;
  lastName.value = d.lastName;
  userName.value = d.userName;
  userID.value = d._id;
  userPFP.value = props.userData.profilePic;

  setTimeout(() => (skeletonLoad.value = false), 1000);
} else {
  watch(() => props.userData, () => {
    const d = props.userData?.data;
    if (!d) return;
    email.value = d.email;
    firstName.value = d.firstName;
    lastName.value = d.lastName;
    userName.value = d.userName;
    userID.value = d._id;
    userPFP.value = props.userData.profilePic;

    setTimeout(() => (skeletonLoad.value = false), 1000);
  });
}

const pwOp = ref(false);
const editingProfile = ref(false);

const closeProf = () => (editProfPic.state = false);

const emailAnswer = (answer: number) => {
  modalFontSize.value = '2rem'
  modalQuestion.value = undefined
  modalLoadingMessage.value = "Updating";
  modalAnimation.value = true;

  if (answer === 1) {


    axios.post("/api/user/updateProfileData", { user: userData().data._id, data: currentValues.value }).then((res) => {
      localStorage.setItem("email", currentValues.value.email);

      originalValues.value.email = currentValues.value.email;
      originalValues.value.firstName = currentValues.value.firstName;
      originalValues.value.lastName = currentValues.value.lastName;
      originalValues.value.userName = currentValues.value.userName;

      originalValues.value.profilePic = currentValues.value.profilePic;
      userData().data.email = currentValues.value.email;
      userData().data.firstName = currentValues.value.firstName;
      userData().data.lastName = currentValues.value.lastName;
      userData().data.userName = currentValues.value.userName;
      userData().data.profilePic = currentValues.value.profilePic;
      currentPassword.value = ""


      setTimeout(() => {
        modalAnimation.value = false;
        modalLoadingMessage.value = "Succesfully updated";
        setTimeout(() => {
          modalActivation.value = false;
        }, 2000);
      }, 500);

    }).catch((err) => {
      console.log(err)
    })


  } else if (answer === 2) {
    modalActivation.value = false
  }
}

// Save profile
const saveProfileCheckEmail = async (originalPassword: any) => {

  console.log(originalPassword)

  modalBackgroundColor.value = undefined
  modalFontColorLoadingMessage.value = undefined
  modalQuestion.value = undefined
  modalActivation.value = false;
  modalLoadingMessage.value = undefined;
  modalAnimation.value = false;

  const loginData = {
    email: userData().data.email,
    password: originalPassword
  }




  if (changedFields.value.includes("email")) {
    try {
      await axios.post("api/user/login", loginData);

      // Base modal setup
      modalFontColorLoadingMessage.value = "var(--color-nav-txt)";
      modalBackgroundColor.value = "var(--color-nav-bg)";
      modalAnimation.value = false;
      modalActivation.value = true;

      // Check if both email + password changed
      if (changedFields.value.includes("newPassword")) {
        modalLoadingMessage.value =
          "You are changing your email and password, are you sure you want to save?";
      } else {
        modalFontSize.value = "1.5rem";
        modalLoadingMessage.value = undefined;
        modalQuestion.value =
          "You are changing your email, are you sure you want to save?";
      }
    } catch (err) {
      setTimeout(() => {
        modalFontSize.value = '2rem'

        modalFontColorLoadingMessage.value = "var(--color-nav-bg)";
        modalBackgroundColor.value = "red";
        modalAnimation.value = false;
        modalLoadingMessage.value = "Wrong password";
        modalActivation.value = true;

        setTimeout(() => {
          modalActivation.value = false;
        }, 1500);
      }, 500);
    }
  }
  else if (!changedFields.value.includes("email")) {


    axios.post('api/user/login', loginData).then(async (res) => {

      axios.post("/api/user/updateProfileData", {
        user: userData().data._id, data: currentValues.value
      }).then((res) => {
        modalFontSize.value = '2rem'

        modalQuestion.value = undefined
        modalLoadingMessage.value = "Updating";
        modalAnimation.value = true;
        modalActivation.value = true;



        setTimeout(() => {

          originalValues.value.firstName = currentValues.value.firstName;
          originalValues.value.lastName = currentValues.value.lastName;
          originalValues.value.userName = currentValues.value.userName;
          originalValues.value.profilePic = currentValues.value.profilePic;
          userData().data.firstName = currentValues.value.firstName;
          userData().data.lastName = currentValues.value.lastName;
          userData().data.userName = currentValues.value.userName;
          userData().data.profilePic = currentValues.value.profilePic;

          modalAnimation.value = false;
          modalLoadingMessage.value = "Succesfully updated";
          currentPassword.value = ""
          setTimeout(() => {
            modalActivation.value = false;
          }, 2000);
        }, 500)

      }).catch((err) => {

        modalFontSize.value = '2rem'
        modalFontColorLoadingMessage.value = 'var(--color-nav-bg)'
        modalBackgroundColor.value = 'red'
        modalAnimation.value = false;
        modalLoadingMessage.value = "An error occurred";

        modalActivation.value = true


        setTimeout(() => {
          modalActivation.value = false;
        }, 1500);
      })




    }).catch((err) => {
      console.log(err.status)
      modalFontSize.value = '2rem'
      modalFontColorLoadingMessage.value = 'var(--color-nav-bg)'
      modalBackgroundColor.value = 'red'
      modalAnimation.value = false;
      modalLoadingMessage.value = "Wrong password";
      modalActivation.value = true

      setTimeout(() => {
        modalActivation.value = false;
      }, 1500);

    })


  }







  // axios.post("/api/user/updateProfileData", {
  //   user: userData().data._id,
  //   data: currentValues.value
  // }).then((res) => {
  //   console.log(res)
  // })



};
const isValidEmail = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentValues.value.email || '')
);
const invalidFields = computed(() => {
  const invalid: string[] = [];

  if (!isValidEmail.value) invalid.push('Email'); // 👈 match label text
  if (!firstName.value) invalid.push('First Name');
  if (!lastName.value) invalid.push('Last Name');
  if (!userName.value) invalid.push('Username');
  // newPassword can be empty → skip

  return invalid;
});

const isFormValid = computed(() => invalidFields.value.length === 0);


const changedFields = computed(() => {
  const changes: string[] = [];

  for (const key in currentValues.value) {
    if (!isEqual(currentValues.value[key], originalValues.value[key])) {
      changes.push(key);
    }
  }

  return changes;
});


const originalValues = ref({
  email: undefined,
  firstName: undefined,
  lastName: undefined,
  userName: undefined,
  newPassword: undefined,
  profilePic: undefined
}) as any;


const currentValues = computed(() => ({
  email: email.value,
  firstName: firstName.value,
  lastName: lastName.value,
  userName: userName.value,
  profilePic: userPFP.value
})) as any

const hasChanges = computed(() => !isEqual(originalValues.value, currentValues.value));


// Mounted
onMounted(() => {
  $(".skeleton").each(function (i, el) {
    $(el).css({
      "animation-delay": (i / 10 * Math.floor(Math.random() * -100)) + "s",
    });
  });

  userPFP.value = localStorage.getItem("avatar");

  watch(
    () => props.userData,
    () => {
      if (userPFP.value === base64NoPFP) {
        noPFP.value = true;
      }
      if (!userPFP.value) {
        userPFP.value = props.userData?.profilePic || base64NoPFP;
        noPFP.value = userPFP.value === base64NoPFP;
      }
    }
  );

  watch(() => props.userData?.userPFP, (newPic) => {
    userPFP.value = newPic;
  });
  originalValues.value.email = email.value;
  originalValues.value.firstName = firstName.value;
  originalValues.value.lastName = lastName.value;
  originalValues.value.userName = userName.value;
  originalValues.value.profilePic = userPFP.value;
});





const emittedData = (value: string, label: string) => {

  switch (label) {
    case 'Email':
      email.value = value;
      break;
    case 'First Name':
      firstName.value = value;
      break;
    case 'Last Name':
      lastName.value = value;
      break;
    case 'Username':
      userName.value = value;
      break;
    case 'New Password':
      newPassword1.value = value;
      break;
  }
}


const newProfilePictureEmit = (newPic: string) => {

  userPFP.value = newPic
  originalValues.value.profilePic = newPic
  currentValues.value.profilePic = newPic;
  localStorage.setItem("avatar", currentValues.value.profilePic)

  setTimeout(() => {
    editProfPic.state = false
  }, 2000);
};

</script>

<template>
  <div class="userprof-wrapper" ref="parent" :class="[editingProfile ? 'editing' : '', direction]">

    <!-- Modal -->
    <transition name="modal">

      <div class="modal-opacity" v-show="modalActivation">
        <Modal class="modal" position="absolute" :modalAnimation="modalAnimation" :loadingScale="1.5"
          :fontSize="modalFontSize" :modalQuestion="modalQuestion" :modalQuestion1="'Yes'" :modalQuestion2="'No'"
          @emitAnswer="emailAnswer" :fontColorLoadingMessage="modalFontColorLoadingMessage"
          :backgroundColor="modalBackgroundColor" :modalLoadingMessage="modalLoadingMessage"
          :modalButtonMessage="modalButtonMessage" :backgroundOpacity="1" spinnerColor="var(--color-nav-txt)"
          v-click-away="() => (modalActivation = false)" />
      </div>
    </transition>


    <div class="input-wrapper">
      <div class="inner-wrapper">
      </div>
      <input type="button" value="Edit" class="edit button" @click.prevent="editProPicPanel" />


      <!-- Edit profile picture -->
      <transition name="edit">
        <EditProfilePicture v-if="editingProfile && editProfPic.state" :userID="userID" class="edit-profile-picture"
          @newProfilePicture="newProfilePictureEmit" v-click-away="closeProf" />
      </transition>


      <!-- Actual profile image with fade transition -->

      <div class="prof-pic-wr">
        <TransitionGroup name="fade">
          <div v-if="skeletonLoad" class="skeleton pic" key="1"></div>
          <div class="profile-pic" v-if="!skeletonLoad" key="2">
            <div class="prof-content" :class="{ nopfp: noPFP }">
              <img v-if="!noPFP" :src="userPFP" alt="Profile picture" />
              <div v-else class="no-pfp">no profile pic</div>
              <input v-if="editingProfile" type="button" value="Change" @click="profPicEnableFn"
                class="change button" />
            </div>
          </div>
        </TransitionGroup>

      </div>

      <!-- Fields -->
      <div class="inputs-wrapper" key="1">
        <div class="fields-wrapper">
          <Field :icon="emailSVG" label="Email" v-model="email" :editing="editingProfile" :skeleton="skeletonLoad"
            :invalidFields="invalidFields" @update:modelValue="emittedData" />
          <Field :icon="nameSVG" label="First Name" v-model="firstName" :editing="editingProfile"
            :invalidFields="invalidFields" :skeleton="skeletonLoad" />
          <Field :icon="userSVG" label="Last Name" v-model="lastName" :editing="editingProfile" :skeleton="skeletonLoad"
            :invalidFields="invalidFields" />
          <Field :icon="userSVG" label="Username" v-model="userName" :editing="editingProfile" :skeleton="skeletonLoad"
            :invalidFields="invalidFields" />
        </div>

        <!-- Save section -->
        <div class="password-wrapper">
          <TransitionGroup name="password">

            <Password v-if="editingProfile" :newPassword1="'newPassword1'" key="0"
              @saveProfileCheckEmail="(data) => { newPassword1 = data.newPassword1 }"  @changingPasswordTrigger="(data)=>{changingPasswordTrigger = data}" />
            <Password v-if="editingProfile && changingPasswordTrigger" :newPassword2="'newPassword2'" key="1"
              @saveProfileCheckEmail="(data) => { newPassword2 = data.newPassword2 }"
              :doPasswordsMatch="doPasswordsMatch" />
            <div class="save" v-if="hasChanges && editingProfile" key="3">
              <Password :passwordToSave="true" :currentPassword="currentPassword"
                @saveProfileCheckEmail="(data) => { currentPassword = data.currentPassword }" />
            </div>
          </TransitionGroup>

        </div>
      </div>

    </div>
  </div>

</template>


<style lang="scss" scoped>
.modal-opacity {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  z-index: 3;
  background-color: rgba(0, 0, 0, 0.274);

  .modal {
    width: 70%;
    height: 70%;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.267) 2px 2px 2px 1px;
  }
}

.skeleton {
  position: absolute;
  z-index: 10;
  height: 100%;
  width: 100%;
  border-radius: 10px;
  background: linear-gradient(100deg,
      rgba(255, 255, 255, 0) 40%,
      rgba(255, 255, 255, 0.384) 50%,
      rgba(255, 255, 255, 0) 60%) #c7c7c7;
  background-size: 200% 100%;
  background-position-x: 180%;
  animation: 0.5s loading ease-in-out infinite;
}

@keyframes loading {
  to {
    background-position-x: -20%;
  }
}

@keyframes pulse {

  0%,
  100% {
    opacity: 0.6;
  }

  50% {
    opacity: 1;
  }
}



.button {
  font-weight: 700;
  font-size: 1.2rem;
  border: solid var(--color-nav-txt);
  background-color: var(--color-nav-txt);
  box-shadow: rgba(0, 0, 0, 0.568) 2px 2px 2px 1px;
  color: var(--color-nav-bg);
  border-radius: 10px;
  outline: none;
  font-family: Chango;
  padding: 10px;
  border-style: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}


.button:hover {
  background-color: var(--color-nav-txt-darker);
}

.button:active {
  box-shadow: inset rgba(0, 0, 0, 0.568) 2px 2px 2px 1px;
}



.userprof-wrapper {
  font-family: Chango;
  min-width: 350px;
  color: var(--color-nav-txt);
  display: flex;
  height: 100%;
  flex-direction: row;
  gap: 20px;
  padding: 10px;
  overflow-y: auto;


  .input-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 20px;

    .edit {
      width: 100px;
      font-size: 1.8rem;
      position: relative;
      display: flex;
      right: 0;
      transition: all 0.2s ease-in-out;
    }


    .prof-pic-wr {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 70px;
      height: 70px;
      margin-left: 50px;
      min-width: 70px;
      min-height: 70px;

      .skeleton.pic {
        width: 100%;
        height: 70px;
        border-radius: 50%;
        background: var(--skeleton-bg, #ccc);
        animation: pulse 1.5s infinite ease-in-out;
      }

      &::before {
        content: "";
        position: absolute;
        width: 127%;
        height: 127%;
        background-color: var(--color-nav-txt);
        border-radius: 50%;
        z-index: 0;
      }

      // Inner ring (nav background color)
      &::after {
        content: "";
        position: absolute;
        width: 110%;
        height: 110%;
        background-color: var(--color-nav-bg);
        border-radius: 50%;
        z-index: 1;
      }

      .profile-pic {
        display: flex;
        z-index: 2;
        transition: all 0.2s ease-in-out;

        .prof-content {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;

          .no-pfp {
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .button {
            position: absolute;
            margin-right: -120px;
            margin-top: 30px;
            padding: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          img {
            width: 100%;
            height: auto;
            transition: all 0.2s ease-in-out;
          }
        }
      }
    }

    .inputs-wrapper {
      width: 100%;
      display: flex;
      gap: 10px;

      .fields-wrapper {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
      }
    }
  }



  .icon {
    position: relative;
    fill: var(--color-nav-txt);
    z-index: 0;
    height: 40px;
    width: 40px;
    pointer-events: none;
    stroke: var(--vt-c-nav-text-bg-hover);
  }
}


.password-wrapper {
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .save {
    border-radius: 0 10px 10px 0;
    align-self: center;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    align-items: center;
  }

}



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

.modal-move,
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease-out;
  opacity: 1;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.edit-enter-active,
.edit-leave-active {
  transition: all 0.3s ease-in-out;
}

.edit-enter-from,
.edit-leave-to {
  opacity: 0;
  transform: translateX(200px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.password-move,
.password-enter-active,
.password-leave-active {
  transition: 0.2s ease-in-out all;
}

.password-enter-from,
.password-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.password-enter-to,
.password-leave-from {
  opacity: 1;
}

.password-leave-active {
  position: absolute;
}


@media only screen and (max-device-width: 414px) {
  .profile-wrapper-inner {
    width: 100%;
    height: 100%;


  }

}
</style>
