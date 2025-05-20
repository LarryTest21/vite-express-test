
<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import axios from "axios"
import Modal from "../../components/Modal.vue"
import { userData } from '../../store/userData';
import { useTheme } from "../../store/theme";

const theme = useTheme()

const props = defineProps({
    userData: Object
})

const autoLogin = ref(false)
const themeCheck = ref(false)
const themeName = ref("theme-dark")
const themeNameCheck = ref()
const readPosts = ref(false)

const showSaveButton = ref(false)


const modalActivation = ref(false)
const modalMessage = ref()


if (props.userData!.data.userSettings != undefined) {
    autoLogin.value = props.userData!.data.userSettings.autoLogin
    themeCheck.value = props.userData!.data.userSettings.themeCheck
    readPosts.value = props.userData!.data.userSettings.readPosts
    themeName.value = props.userData!.data.userSettings.themeName
    if (props.userData!.data.userSettings.themeName === "theme-light") {
        themeNameCheck.value = false
    } else {
        themeNameCheck.value = true
    }
} else {
    watch(() => props.userData, () => {
        autoLogin.value = props.userData!.data.userSettings.autoLogin
        themeCheck.value = props.userData!.data.userSettings.themeCheck
        readPosts.value = props.userData!.data.userSettings.readPosts
        themeName.value = props.userData!.data.userSettings.themeName

        if (props.userData!.data.userSettings.themeName === "theme-light") {
            themeNameCheck.value = false
        } else {
            themeNameCheck.value = true
        }
    })
}




watch(() => autoLogin.value, (newValue) => {

    if (newValue != props.userData!.data.userSettings.autoLogin) {
        showSaveButton.value = true
    } else {
        showSaveButton.value = false
    }
})
watch(() => themeNameCheck.value, (newValue) => {
    if (themeName.value === props.userData!.data.userSettings.themeName) {
        showSaveButton.value = true
    } else {
        showSaveButton.value = false
    }
    if (newValue) {
        themeName.value = "theme-dark"
        theme.state = "theme-dark"
    } else {
        themeName.value = "theme-light"
        theme.state = "theme-light"
    }

})

watch(() => themeCheck.value, (newValue) => {
    if (newValue != props.userData!.data.userSettings.themeCheck) {
        showSaveButton.value = true
    } else {
        showSaveButton.value = false
    }
})

watch(() => readPosts.value, (newValue) => {
    if (newValue != props.userData!.data.userSettings.readPosts) {
        showSaveButton.value = true
    } else {
        showSaveButton.value = false
    }
    if (!newValue) {
        const userD = userData().data
        userD.readPosts = newValue
    }
})

const saveSettings = () => {
    modalActivation.value = true
    modalMessage.value = "Saving..."

    if (!autoLogin.value) {
        localStorage.removeItem("autoLogin")
    } else {
        localStorage.setItem("autoLogin", "true")
    }
    const userID = props.userData!.data._id
    const userSettings = {
        autoLogin: autoLogin.value,
        themeCheck: themeCheck.value,
        themeName: themeName.value,
        readPosts: readPosts.value
    }

    localStorage.setItem("theme-color", themeName.value)

    axios.post("/api/user/updateSettings", { userID, userSettings }).then((res) => {
        setTimeout(() => {
            modalMessage.value = "Settings saved"
        }, 1000);

        return userSettings
    }).then((userSettings) => {

        const userD = userData()

        userD.data.userSettings = userSettings

        setTimeout(() => {
            modalActivation.value = false
        }, 4000);
    }).catch((err) => {
        modalMessage.value = err

        console.log(err);
    })
}

onMounted(() => {



})

onBeforeUnmount(() => {
    if (themeName.value != props.userData!.data.userSettings.themeName) {
        theme.state = localStorage.getItem("theme-color")!
    }
})

</script>

<template>
    <div class="settings-wrapper">
        <transition name="modal">
            <Modal v-if="modalActivation" :position="'absolute'" :modalLoadingMessage="modalMessage"
                :spinnerColor="'var(--color-nav-txt)'" :fontSize="'3rem'" />
        </transition>
        <label>Settings</label>

        <div class="outer">
            <div class="settings-wrapper">
                <div class="theme-wrapper">
                    <div class="autologin wrapper">
                        <label>Show theme button</label>
                        <label>
                            <input class="toggle-checkbox 1" type="checkbox" v-model="themeCheck">
                            <div class="toggle-slot">
                                <div class="toggle-button"></div>
                            </div>
                        </label>
                    </div>

                    <div class="choose-theme">
                        <label>Theme</label>
                        <div class="toggleWrapper">


                            <input type="checkbox" class="dn" id="dn" v-model="themeNameCheck">
                            <label for="dn" class="toggle">
                                <span class="toggle__handler">
                                    <span class="crater crater--1"></span>
                                    <span class="crater crater--2"></span>
                                    <span class="crater crater--3"></span>
                                </span>
                                <span class="star star--1"></span>
                                <span class="star star--2"></span>
                                <span class="star star--3"></span>
                                <span class="star star--4"></span>
                                <span class="star star--5"></span>
                                <span class="star star--6"></span>
                            </label>

                        </div>
                    </div>
                </div>

                <div class="autologin wrapper">
                    <label>Auto login</label>
                    <label>
                        <input class="toggle-checkbox 1" type="checkbox" v-model="autoLogin">
                        <div class="toggle-slot">
                            <div class="toggle-button"></div>
                        </div>
                    </label>
                </div>

                <div class="theme wrapper">
                    <label>Store read posts</label>
                    <label>
                        <input class="toggle-checkbox 2" type="checkbox" v-model="readPosts">
                        <div class="toggle-slot">
                            <div class="toggle-button"></div>
                        </div>
                    </label>
                </div>
            </div>
            <div class="save">
                <transition name="savediv" mode="out-in">
                    <input type="button" value="Save" class="save-settings" @click.prevent="saveSettings"
                        v-show="showSaveButton" />
                </transition>

            </div>
        </div>



    </div>
</template>

<style lang="scss" scoped>
.settings-wrapper {
    position: relative;
    width: 700px;
    height: 500px;
    font-family: Chango;
    color: var(--color-nav-txt);
    font-size: 1.1rem;
    border-radius: 10px;
    background-color: var(--color-nav-bg) !important;
    overflow: hidden;
    transition: all 0.2s ease-in-out;
    display: flex;
    flex-direction: column;

    label {
        font-size: 2rem;
        padding: 10px;
    }


    .outer {
        position: relative;
        height: 100%;
        width: 100%;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: all 0.2s ease-in-out;

        .settings-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-around;
            transition: all 0.2s ease-in-out;

            .theme-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;

                label {
                    font-size: 1.3rem;
                }

                .choose-theme {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .toggleWrapper {
                    position: relative;
                    right: 10px;
                    color: white;
                    display: flex;
                }

                .toggleWrapper input {
                    position: relative;
                    opacity: 0;
                }

                .toggle {
                    cursor: pointer;
                    display: inline-block;
                    position: relative;
                    height: 30px;
                    width: 60px;
                    background-color: #83d8ff;
                    border-radius: 30px;
                    box-shadow: inset 1px 3px 5px rgb(1, 21, 44);
                    transition: all 0.3s ease-in-out;
                }
                .toggle__handler {
                    position: absolute;
                    z-index: 1;
                    width: 22px;
                    height: 22px;
                    top: 4px;
                    left: 4px;
                    background-color: #ffcf96;
                    border-radius: 50px;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, .3);
                    transition: all 400ms cubic-bezier(0.68, -0.1, 0.265, 1.3);
                }
                .toggle__handler .crater {
                    position: absolute;
                    background-color: #e8cda5;
                    opacity: 0;
                    transition: opacity 200ms ease-in-out;
                    border-radius: 100%;
                }
                .toggle__handler .crater--1 {
                    top: 2px;
                    left: 6px;
                    width: 4px;
                    height: 4px;
                }
                .toggle__handler .crater--2 {
                    top: 7px;
                    left: 12px;
                    width: 6px;
                    height: 6px;
                }
                .toggle__handler .crater--3 {
                    top: 12px;
                    left: 5px;
                    width: 8px;
                    height: 8px;
                }
                .star {
                    position: absolute;
                    background-color: #fff;
                    transition: all 300ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
                    border-radius: 50%;
                }
                .star--1 {
                    top: 5px;
                    left: 25px;
                    z-index: 0;
                    width: 30px;
                    height: 3px;
                }
                .star--2 {
                    top: 10px;
                    left: 20px;
                    z-index: 1;
                    width: 20px;
                    height: 3px;
                }
                .star--3 {
                    top: 15px;
                    left: 30px;
                    z-index: 0;
                    width: 20px;
                    height: 3px;
                }
                .star--4,
                .star--5,
                .star--6 {
                    opacity: 0;
                    transition: all 300ms 0 cubic-bezier(0.445, 0.05, 0.55, 0.95);
                }
                .star--4 {
                    top: 8px;
                    left: 11px;
                    z-index: 0;
                    width: 2px;
                    height: 2px;
                    transform: translate3d(3px, 0, 0);
                }
                .star--5 {
                    top: 20px;
                    left: 17px;
                    z-index: 0;
                    width: 3px;
                    height: 3px;
                    transform: translate3d(3px, 0, 0);
                }
                .star--6 {
                    top: 22px;
                    left: 28px;
                    z-index: 0;
                    width: 2px;
                    height: 2px;
                    transform: translate3d(3px, 0, 0);
                }
                input:checked+.toggle {
                    background-color: var(--color-nav-txt);
                }
                input:checked+.toggle:before {
                    color: #749ed7;
                }
                input:checked+.toggle:after {
                    color: #fff;
                }
                input:checked+.toggle .toggle__handler {
                    background-color: #ffe5b5;
                    transform: translate3d(30px, 0, 0) rotate(0);
                }
                input:checked+.toggle .toggle__handler .crater {
                    opacity: 1;
                }
                input:checked+.toggle .star--1 {
                    width: 2px;
                    height: 2px;
                }
                input:checked+.toggle .star--2 {
                    width: 4px;
                    height: 4px;
                    transform: translate3d(-5px, 0, 0);
                }
                input:checked+.toggle .star--3 {
                    width: 2px;
                    height: 2px;
                    transform: translate3d(-7px, 0, 0);
                }
                input:checked+.toggle .star--4,
                input:checked+.toggle .star--5,
                input:checked+.toggle .star--6 {
                    opacity: 1;
                    transform: translate3d(0, 0, 0);
                }
                input:checked+.toggle .star--4 {
                    transition: all 300ms 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
                }
                input:checked+.toggle .star--5 {
                    transition: all 300ms 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
                }
                input:checked+.toggle .star--6 {
                    transition: all 300ms 300ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
                }
            }

            .wrapper {
                position: relative;
                display: flex;
                height: 100%;
                justify-content: space-between;

                label {
                    font-size: 1.5rem;
                    display: flex;
                    align-items: center;
                    color: var(--color-nav-txt);
                }
                .toggle-checkbox {
                    position: absolute;
                    opacity: 0;
                    cursor: pointer;
                    height: 0;
                    width: 0;
                }

                .toggle-slot {
                    font-size: 10px;
                    position: relative;
                    height: 40px;
                    width: 100px;
                    border: 0px solid var(--color-nav-txt);
                    border-radius: 30px;
                    background-color: var(--color-nav-bg-lighter);
                    transition: background-color 250ms;
                    display: flex;
                    align-items: center;
                    box-shadow: inset 1px 2px 2px rgb(0, 0, 0);
                }

                .toggle-checkbox:checked~.toggle-slot {
                    background-color: var(--color-nav-txt);
                }

                .toggle-button {
                    transform: translate(4px);
                    position: absolute;
                    height: 34px;
                    top: 3px;
                    width: 34px;
                    border-radius: 50%;
                    background-color: var(--color-nav-txt);
                    box-shadow: 1px 2px 1px -1px rgba(173, 173, 173, 0.637), inset 1px 1px 1px 1px rgba(245, 245, 245, 0.267), inset 2px 2px 0px 1px rgba(239, 240, 240, 0.123);
                    transition: background-color 0.2s, border-color 0.2s, transform 0.3s cubic-bezier(.50, 2, .1, .01);
                }

                .toggle-checkbox:checked~.toggle-slot .toggle-button {
                    background-color: var(--color-nav-bg);
                    box-shadow: 1px 2px 1px -1px rgba(173, 173, 173, 0.5), inset 1px 1px 1px 1px rgba(150, 150, 150, 0.089), inset 2px 2px 0px 1px rgba(239, 240, 240, 0.123);
                    transform: translate(63px);
                }
            }
        }
    }

    .save {
        position: relative;
        display: flex;
        height: 120px;
        width: 100%;

        input[type="button"] {
            height: 70px;
            width: 50%;
            margin: auto;
            box-shadow: rgba(0, 0, 0, 0.568) 2px 2px 2px 1px;
            font-family: Chango;
            font-size: 2rem;
            cursor: pointer;
            padding: 10px;
            color: var(--color-nav-bg) !important;
            border-style: none;
            background-color: var(--color-nav-txt);
            border-radius: 20px;
            ;
        }

        input[type="button"]:hover {
            color: var(--color-nav-bg) !important;
            background-color: green;
            transition: all 0.1s ease-in-out;
        }

        input[type="button"]:active {
            box-shadow: inset rgba(0, 0, 0, 0.568) 2px 2px 2px 1px;
        }
    }

}


.savediv-enter-active,
.savediv-leave-active {
    transition: all 0.3s ease-out;
    opacity: 1;
}

.savediv-enter-from,
.savediv-leave-to {
    opacity: 0;
    transform: translateY(100px);
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
</style>