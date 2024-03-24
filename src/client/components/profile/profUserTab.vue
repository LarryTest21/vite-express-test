<script setup lang="ts">
import { ref, watch, onMounted } from "vue"
import EditProfilePicture from "../../components/EditProfilePicture.vue";
import Modal from "../../components/Modal.vue";
import { profPicEnable } from "../../store/profPicEnable";
import { base64NoPFP } from "../../components/icons/nopfpbase64"
import nameSVG from "../../components/icons/user.vue";
import userSVG from "../../components/icons/user.vue";
import emailSVG from "../../components/icons/email.vue";
import passwordSVG from "../../components/icons/password.vue";
import $ from "jquery";
import { useSwipe } from '@vueuse/core'

const grabber = ref(null)
const parent = ref(null) as any
const { isSwiping, direction } = useSwipe(parent)


const device = ref(document.getElementById("app")!.classList.contains("mobile"))

const grabberBoolean = ref(false)

const props = defineProps({
  userData: Object
})

//SKELETON
const skeletonLoad = ref(true)
const skeleton = ref()
const historyLoad = ref()
const profileLoad = ref

//MODAL
const modalActivation = ref(false)
const modalAnimation = ref()
const modalLoadingMessage = ref()
const modalButtonMessage = ref()

//PROF PIC
const noPFP = ref()
const userPFP = ref()
const profPicEnableFn = () => {
  editProfPic.state = true
};

const editProPicPanel = () => {
  if (editingProfile.value && pwOp.value) {
    editingProfile.value = false;
    pwOp.value = false;
  } else if (!editingProfile.value && !pwOp.value) {
    editingProfile.value = true;
    pwOp.value = true;
  }
};

//USERDATA
const email = ref()
const firstName = ref()
const lastName = ref()
const userName = ref()
const userID = ref()

const password = ref()
const newPassword = ref()


if (props.userData!.data != undefined) {
  email.value = props.userData!.data.email
  firstName.value = props.userData!.data.firstName
  lastName.value = props.userData!.data.lastName
  userName.value = props.userData!.data.userName
  userID.value = props.userData!.data._id
  userPFP.value = props.userData!.profilePic
  setTimeout(() => {
    skeletonLoad.value = false
  }, 1000);
} else {
  watch(() => props.userData, () => {
    email.value = props.userData!.data.email
    firstName.value = props.userData!.data.firstName
    lastName.value = props.userData!.data.lastName
    userName.value = props.userData!.data.userName
    userID.value = props.userData!.data._id
    userPFP.value = props.userData!.profilePic

    setTimeout(() => {
      skeletonLoad.value = false
    }, 1000)
  })

}

const editProfPic = profPicEnable();


const pwOp = ref()


//EDITING PROFILE
const editingProfile = ref()
const closeProf = () => {
  editProfPic.state = false
};






//SAVEPROFILE
const saveProfile = async () => {
  modalActivation.value = true;
  modalLoadingMessage.value = "Updating";
  modalAnimation.value = true
}



onMounted(() => {



  $(".skeleton").each(function (i: number, el) {
    $(el).css({ 'animation-delay': (i / 10 * Math.floor(Math.random() * -100)) + "s" });
  });



  userPFP.value = localStorage.getItem("avatar")

  watch(() => props.userData, () => {
    if (userPFP.value = base64NoPFP) {
      noPFP.value = true
    }
    if (userPFP.value === undefined || userPFP.value === null || userPFP.value === "") {
      userPFP.value = props.userData!.profilePic

      if (userPFP.value === undefined || userPFP.value === null || userPFP.value === "") {
        noPFP.value = true
        userPFP.value = base64NoPFP
      }
    }
  })


  watch(() => props.userData!.userPFP, (newPic) => {
    userPFP.value = newPic
    console.log(userPFP.value);
  })

})

</script>

<template>
  <div class="userprof-wrapper" ref="parent" :class="[editingProfile ? 'editing' : '', direction]">
    <div class="grabber" ref="grabber" v-if="grabberBoolean">U</div>
    <div class="buttons">

      <label class="profile-label">Profile</label>
      <input type="button" value="Edit" class="editButton" @click.prevent="editProPicPanel" />
    </div>
    <transition name="modal">
      <Modal v-if="modalActivation" class="modal" :position="'absolute'" :modalAnimation="modalAnimation"
        :loadingScale="3" :modalLoadingMessage="modalLoadingMessage" :modalButtonMessage="modalButtonMessage"
        :fontSize="'4rem'" :spinnerColor="'var(--color-nav-txt)'" v-click-away="modalActivation = !modalActivation" />
    </transition>
    <transition name="edit">
      <EditProfilePicture :userID="userID" class="edit-profile-picture" v-if="editingProfile && editProfPic.state"
        v-click-away="closeProf" />
    </transition>

    <div class="profile-pic">

      <div class="prof-content" :class="noPFP ? 'nopfp' : ''">
        <transition-group name="value">

          <div class="skeleton pic" ref="skeleton" v-if="skeletonLoad" key="1" />
          <img v-bind:src="userPFP" key="2" />
          <div class="no-pfp" v-if="noPFP" key="3">no profile pic</div>
          <input type="button" value="Change" v-if="editingProfile" @click="profPicEnableFn" key="4" />
        </transition-group>

      </div>
    </div>

    <div class="inputs-wrapper">


      <div class="field">
        <div class="icon">
          <emailSVG class="icon" />
        </div>
        <div class="label-input">
          <label class="lastName" key="1">Email</label>
          <TransitionGroup tag="ul" name="value" class="container">
            <div class="skeleton" ref="skeleton" v-if="skeletonLoad"></div>
            <div class="value" v-if="!editingProfile" key="3">{{ email }}</div>
            <input v-else-if="editingProfile" type="text" v-model="email" key="4" />
          </TransitionGroup>
        </div>
      </div>



      <div class="field">
        <div class="icon">
          <nameSVG class="icon" />
        </div>

        <div class="label-input">
          <label class="firstName">First Name</label>
          <TransitionGroup tag="ul" name="value" class="container">
            <div class="skeleton" ref="skeleton" v-if="skeletonLoad" />
            <div class="value" v-if="!editingProfile" key="3">{{ firstName }}</div>
            <input v-else-if="editingProfile" type="text" v-model="firstName" key="4" />
          </TransitionGroup>
        </div>
      </div>


      <div class="field">
        <div class="icon">
          <userSVG class="icon" />
        </div>

        <div class="label-input">
          <label class="lastName">Last Name</label>
          <TransitionGroup tag="ul" name="value" class="container">
            <div class="skeleton" ref="skeleton" v-if="skeletonLoad" />
            <div class="value" v-if="!editingProfile" key="3">{{ lastName }}</div>
            <input v-else-if="editingProfile" type="text" v-model="lastName" key="4" />
          </TransitionGroup>

        </div>
      </div>

      <div class="field">
        <div class="icon">
          <userSVG class="icon" />
        </div>
        <div class="label-input">
          <label class="lastName">Username</label>

          <TransitionGroup tag="ul" name="value" class="container">
            <div class="skeleton" ref="skeleton" v-if="skeletonLoad" />
            <div class="value" v-if="!editingProfile" key="3">{{ userName }}</div>
            <input v-else-if="editingProfile" type="text" v-model="userName" key="4" />
          </TransitionGroup>

        </div>
      </div>

      <div class="field" v-show="editingProfile">
        <div class="icon">
          <userSVG class="icon" />
        </div>
        <div class="label-input">
          <label class="newPassword">New Password</label>

          <TransitionGroup tag="ul" name="value" class="container">
            <div class="skeleton" ref="skeleton" v-if="skeletonLoad" />
            <div class="value" v-if="!editingProfile" key="3">{{ newPassword }}</div>
            <input v-else-if="editingProfile" type="text" v-model="newPassword" key="4" />
          </TransitionGroup>

        </div>
      </div>


      <transition name="value">
        <div class="save">
          <div class="field">

            <div class="label-input">
              <div class="icon-pw">
                <div class="icon">
                  <passwordSVG class="icon" />
                </div>
                <label class="password">Password</label>
              </div>
              <input type="password" v-model="password" @keyup.enter.native="saveProfile" />
            </div>
          </div>
          <input type="button" value="Save" @click.prevent="saveProfile" />
        </div>
      </transition>
    </div>

  </div>
</template>

<style lang="scss" scoped>
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

.skeleton.pic {
  position: absolute;
  width: 105%;
  height: 105%;
  border-radius: 50%;
}

input,
select,
textarea {
  color: var(--color-nav-txt);
}

input {
  font-family: Verdana;
  font-weight: 700;
  width: 100%;
  background: transparent;
  border: solid var(--color-nav-txt);
  border-radius: 10px;
  outline: none;
}

.userprof-wrapper {
  font-family: Chango;
  width: 100%;
  color: var(--color-nav-txt);
  display: flex;
  height: 100%;
  flex-direction: column;
  gap: 20px;

  .grabber {
    position: absolute;
    width: 60px;
    top: 0;
    bottom: 0;
    margin: auto;
    border-radius: 10px 0 0 10px;
    height: 100px;
    background-color: var(--color-nav-bg) !important;
    z-index: 100;
    left: -60px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
  }


  .buttons {
    position: relative;
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    transition: all 0.2s ease-in-out;

    .profile-label {
      font-size: 2rem;

    }

    input[type="button"] {
      width: 100px;
      font-size: 1.8rem;
      border-radius: 30px;
      padding: 10px;
    }

    input[type="button"] {
      color: var(--color-nav-bg) !important;
      background-color: var(--color-nav-txt);
    }
  }


  input[type="button"] {
    box-shadow: rgba(0, 0, 0, 0.568) 2px 2px 2px 1px;
    font-family: Chango;
    cursor: pointer;
    color: var(--color-nav-txt) !important;
    border-style: none;
    background-color: var(--color-nav-bg);
  }

  input[type="button"]:hover {
    color: var(--color-nav-bg) !important;
    background-color: var(--color-nav-txt);
    transition: all 0.1s ease-in-out;
  }

  input[type="button"]:active {
    box-shadow: inset rgba(0, 0, 0, 0.568) 2px 2px 2px 1px;
  }

  .profile-pic {
    position: relative;
    display: flex;
    z-index: 2;
    transition: all 0.2s ease-in-out;
    margin-left: 50px;

    .prof-content.nopfp {
      img {
        opacity: 0.3;
      }

      &::before {
        opacity: 0.3
      }

      .no-pfp {
        position: absolute;
        text-align: center;
      }
    }

    .prof-content {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      input[type="button"] {
        width: 100px;
      }

      &::after {
        position: absolute;
        content: "";
        width: 110%;
        height: 110%;
        background-color: var(--color-nav-bg);
        z-index: -1;
        border-radius: 50%;
      }

      &::before {
        position: absolute;
        content: "";
        width: 127%;
        height: 127%;
        background-color: var(--color-nav-txt);
        z-index: -1;
        border-radius: 50%;

      }

      input[type="button"] {
        position: absolute;
        margin-right: -100px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
      }

      img {
        height: 70px;
        width: 70px;
        transition: all 0.2s ease-in-out;
      }
    }
  }

  .inputs-wrapper {
    transition: all 0.2s ease-in-out;
    width: 100%;
    height: 100%;
    overflow-y: auto;

    .field {
      width: 100%;
      height: 50px;
      display: flex;

      .label-input {
        position: relative;
        width: 210px;

        .container {
          position: relative;
          padding-left: 0;
        }

        label {
          position: relative;
          width: 100%;
          font-size: 1.3rem;
        }

        .value {
          font-family: Roboto;
          font-weight: 900;
          padding: 0 5px;
        }

        input[type="text"] {
          height: 20px;
          font-family: Verdana;
          font-weight: 900;
          padding: 10px 5px;
        }
      }
    }


    .save {
      position: absolute;
      border-radius: 0 10px 10px 0;
      transition: all 0.2s ease-in-out;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      right: -20px;
      margin: 0 10px;
      padding: 20px;
      z-index: 10;
      display: none;

      .field {
        position: relative;
        color: red;

        .label-input {
          position: relative;
          display: flex;
          flex-direction: column;
          font-size: 1.5rem;
          gap: 5px;

          .icon-pw {
            display: flex;
            align-items: center;

            .icon {
              position: absolute;
              left: -15px;
              fill: red;
              width: 30px;
            }
          }

          input {
            width: 100%;
            position: relative;
            padding: 10px;
          }
        }
      }

      input[type="button"] {
        font-size: 2rem;
        background-color: var(--color-nav-txt);
        color: var(--color-nav-bg) !important;

        &:hover {
          background-color: green;
          color: var(--color-nav-bg) !important;
        }
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


.modal {
  width: 100%;
  height: 100%;
}

.picPanel-enter-active,
.picPanel-leave-active {
  transition: all 0.1s ease-out;
  opacity: 1;
}

.picPanel-enter-from,
.picPanel-leave-to {
  opacity: 0;
}

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

.value-move,
.value-enter-active,
.value-leave-active {
  opacity: 1;
  transition: all 0.2s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.value-enter-from,
.value-leave-to {
  opacity: 0;
  transform: translateY(10px)
}

.value-leave-active {
  position: absolute;
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



@media only screen and (max-width: 680px) {
  .userprof-wrapper.left {
    transform: translate(0%);
  }

  .userprof-wrapper {
    transform: translate(100%);
    width: 100%;
    height: 100px;
    border-radius: 0px;



    .profile-label {
      margin-left: 10px;
      width: 100%;
      text-align: center;

    }

    .profile-pic {
      margin: 0;
      position: relative;
      margin-left: 10px;
    }

    .buttons {
      position: absolute;
      right: 0;
      top: 5px;

      input {
        margin: 0;
      }
    }
  }

  .userprof-wrapper.editing {
    width: 600px;
    transition: all 0.3s ease-in-out;

    .inputs-wrapper {
      display: flex;
      flex-direction: column;

      .save {
        width: 100%;

        .field {
          width: 100%;

          .label-input {

            .icon-pw {
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 2.4rem;

              .icon {
                top: 3px;
                height: 60px;
                width: 60px;
              }
            }

          }
        }
      }
    }

    .profile-pic {
      margin: 0;
      position: relative;
      margin-left: 10px;
      scale: 1;

      img {
        height: 70px;
        width: 70px;
      }
    }
  }

  .edit-profile-picture {
    width: 90%;
  }
}
</style>



