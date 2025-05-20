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
const password = ref()
const newPassword = ref()
const userID = ref()

modalActivation.value = true

if (props.userData!.data != undefined) {
  email.value = props.userData!.data.email
  firstName.value = props.userData!.data.firstName
  lastName.value = props.userData!.data.lastName
  userName.value = props.userData!.data.userNameF
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
    userName.value = props.userData!.data.userNameF
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

  $(".skeleton").each(function (i: number, el) {
    $(el).css({ 'animation-delay': (i / 10 * Math.floor(Math.random() * -50)) + "s" });
  });

  watch(() => props.userData!.userPFP, (newPic) => {
    userPFP.value = newPic
    console.log(userPFP.value);
  })

})

</script>

<template>
  <div class="userprof-wrapper" :class="[pwOp ? 'active' : '']">
    <label class="profile-label">Profile</label>
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
      <transition name="fade">
        <div class="skeleton pic" ref="skeleton" v-if="skeletonLoad"></div>
      </transition>

      <div class="prof-content" :class="noPFP ? 'nopfp' : ''">
        <img v-bind:src="userPFP" />
        <div class="no-pfp" v-if="noPFP">no profile pic</div>
        <input type="button" value="Change" v-if="editingProfile" @click="profPicEnableFn" />
      </div>
    </div>

    <div class="inputs-wrapper">

      <div class="inputs">

        <div class="field">
          <transition name="fade">
            <div class="skeleton" ref="skeleton" v-if="skeletonLoad"></div>
          </transition>
          <div class="icon">
            <emailSVG class="icon" />
          </div>
          <div class="label-input">
            <label class="lastName">Email</label>
            <transition name="value" mode="out-in">
              <div class="value" v-if="!editingProfile">
                {{ email }}
              </div>
              <input v-else-if="editingProfile" type="text" v-model="email" key="2" />
            </transition>


          </div>
        </div>
        <div class="field">
          <transition name="fade">
            <div class="skeleton" ref="skeleton" v-if="skeletonLoad"></div>
          </transition>

          <div class="icon">
            <nameSVG class="icon" />
          </div>
          <div class="label-input">
            <label class="firstName">First Name</label>
            <transition name="value" mode="out-in">
              <div class="value" v-if="!editingProfile">
                {{ firstName }}
              </div>
              <input v-else-if="editingProfile" type="text" v-model="firstName" key="2" />
            </transition>

          </div>
        </div>

        <div class="field">
          <transition name="fade">
            <div class="skeleton" ref="skeleton" v-if="skeletonLoad"></div>
          </transition>
          <div class="icon">
            <userSVG class="icon" />
          </div>
          <div class="label-input">
            <label class="lastName">Last Name</label>
            <transition name="value" mode="out-in">
              <div class="value" v-if="!editingProfile">
                {{ lastName }}
              </div>
              <input v-else-if="editingProfile" type="text" v-model="lastName" key="2" />
            </transition>
          </div>
        </div>

        <div class="field">
          <transition name="fade">
            <div class="skeleton" ref="skeleton" v-if="skeletonLoad"></div>
          </transition>
          <div class="icon">
            <userSVG class="icon" />
          </div>
          <div class="label-input">
            <label class="lastName">Username</label>
            <transition name="value" mode="out-in">
              <div class="value" v-if="!editingProfile">
                {{ userName }}
              </div>
              <input v-else-if="editingProfile" type="text" v-model="userName" key="2" />
            </transition>
          </div>
        </div>
        <transition name="value">

          <div class="field" v-show="editingProfile">
            <div class="icon">
              <passwordSVG class="icon" />
            </div>
            <div class="label-input">
              <label class="lastName">New Password</label>
              <input type="password" v-model="newPassword" />
            </div>
          </div>
        </transition>


      </div>

      <transition name="edit">
        <div class="save" v-show="editingProfile">
          <div class="field">

            <div class="label-input">
              <div class="icon-pw">
                <div class="icon">
                  <passwordSVG class="icon" />
                </div>
                <label class="password">Password</label>
              </div>


              <div class="input"> <input type="password" v-model="password" @keyup.enter.native="saveProfile" />
              </div>
            </div>
          </div>
          <input type="button" value="Save" @click.prevent="saveProfile" />
        </div>
      </transition>
    </div>

    <div class="buttons">

      <input type="button" value="Edit" class="editButton" @click.prevent="editProPicPanel" />


    </div>
  </div>
</template>

<style lang="scss" scoped>
.skeleton {
  z-index: 10;
  width: 110%;
  left: -10px;
  height: 100%;
  position: absolute;
  border-radius: 10px;
  background: linear-gradient(100deg,
      rgba(255, 255, 255, 0) 40%,
      rgba(255, 255, 255, 0.384) 50%,
      rgba(255, 255, 255, 0) 60%) #c7c7c7;
  background-size: 200% 100%;
  background-position-x: 180%;
  margin-left:10px;
  animation: 0.8s loading ease-in-out infinite;
}

@keyframes loading {
  to {
    background-position-x: -20%;
  }
}

.skeleton.pic {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

input,
select,
textarea {
  color: var(--color-nav-txt);
}

input {
  padding: 5px;
  font-family: Verdana;
  font-weight: 700;
  width: 100%;
  background: transparent;
  border: solid var(--color-nav-txt);
  border-radius: 10px;
  outline: none;
}

.userprof-wrapper {
  position: relative;
  font-family: Chango;
  color: var(--color-nav-txt);
  width: 450px;
  height: 500px;
  border-radius: 10px;
  background-color: var(--color-nav-bg) !important;
  overflow: hidden;
  transition: all 0.3s ease-in-out;

  .profile-label {
    font-size: 2rem;
    padding: 10px;
  }


  input[type="button"] {
    box-shadow: rgba(0, 0, 0, 0.568) 2px 2px 2px 1px;
    font-family: Chango;
    cursor: pointer;
    padding: 10px;
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
    justify-content: center;
    align-items: center;
    height: 90px;
    width: 90px;
    top: 10px;
    margin: 20px;
    z-index: 2;
    transition: all 0.2s ease-in-out;

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
      right: 0;
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      input[type="button"] {
        left: 90px;
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
        padding: 10px;
      }

      img {
        height: 70px;
        width: 70px;
        transition: all 0.2s ease-in-out;
      }
    }
  }

  .inputs-wrapper {
    position: relative;
    width: 100%;
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .inputs {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      transition: all 0.2s ease-in-out;

      .field {
        position: relative;
        display: flex;

        .label-input {
          position: relative;
          display: flex;
          flex-direction: column;
          height: 60px;
          width: 80%;


          label {
            position: relative;
            width: 250px;
            padding: 0;
            font-size: 1.5rem;
          }

          .value {
            height: 40px;
            margin-top: 5px;
            font-family: Roboto;
            font-weight: 900;
          }

          input[type="text"] {
            position: relative;
            font-size: 0.8rem;
            font-family: Verdana;
            font-weight: 900;
          }
        }
      }


    }

    .save {
      align-self: flex-end;
      position: relative;
      transition: all 0.2s ease-in-out;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;

      .field {
        position: relative;

        .label-input {
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          font-size: 1.5rem;

          .icon-pw {
            display: flex;
          }

          .icon {
            position: relative;
          }

          .input {
            height: 100%;
            width: 100%;
            position: relative;
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

  .buttons {
    position: absolute;
    top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.2s ease-in-out;
    width: 200px;
    right: 0;

    input[type="button"] {
      width: 90%;
      font-size: 1.8rem;
      border-radius: 30px;
    }

    input[type="button"] {
      color: var(--color-nav-bg) !important;
      background-color: var(--color-nav-txt);
    }


  }

  .icon {
    position: relative;
    height: 40px;
    width: 40px;
    fill: var(--color-nav-txt);
    z-index: 0;
    pointer-events: none;
    stroke-width: 3%;
    stroke: var(--vt-c-nav-text-bg-hover);
  }
}

.userprof-wrapper.active {
  width: 650px;
  height: 530px;


  .profile-pic {
    margin-left: 150px;
    img{
      height:90px;
      width:90px;
    };
  }

  .inputs-field-wrapper {
    margin-top: 50px;
  }

  .buttons {
    right: 20px;

    .save {
      display: flex;
      margin-top: 30px;
    }

    .save.active {
      opacity: 1;
    }
  }
}

.edit-profile-picture {
  width: 70%;
  height: 70%
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



.value-enter-active,
.value-leave-active {
  transition: all 0.15s ease-in-out;
}

.value-enter-from,
.value-leave-to {
  opacity: 0;
}
</style>



