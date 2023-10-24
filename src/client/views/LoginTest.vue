<script setup lang="ts">
import { ref, watch } from "vue";
import emailSVG from "../components/icons/user.vue";
import passwordSVG from "../components/icons/password.vue";
import axios from "axios"
const email = ref();
const password = ref();
const loggedIn = ref(false);

const writtenEmail = ref(true);
const writtenPw = ref(true);

const emailRef = ref();
const passwordRef = ref();

const errorB = ref(false);
const errorMessage = ref();

const errorBFalse = () => {
    if (errorB.value) {
        errorB.value = false;
    }

    if (email.value !== undefined) {
        if (email.value.length !== 0) {
            writtenEmail.value = false;
        }
        if (email.value.length === 0) {
            writtenEmail.value = true;
        }
    }

    if (password.value !== undefined) {
        if (password.value.length !== 0) {
            writtenPw.value = false;
        }
        if (password.value.length === 0) {
            writtenPw.value = true;
        }
    }
};

const signIn = () => {
    const POST_URL = 'api/user/login'

    const loginData = {
        email: email.value,
        password: password.value
    }
    axios.post(POST_URL, loginData).then((response) => {
        console.log(response.data.token);
        sessionStorage.setItem("token", response.data.token)
    }).catch((error) => {
        errorB.value = true
        errorMessage.value = error.response.data.error
    })

};
</script>

<template>
    <div class="form-wrap">
        <img src="../assets/logos/logo.svg" alt="" />
        <div class="inputs">
            <div class="input-lines">
                <div class="input">
                    <input ref="emailRef" type="text" placeholder="" v-model="email" @focus="errorBFalse"
                        @keyup.enter.native="signIn" />
                    <emailSVG class="icon" v-if="writtenEmail" />
                </div>
                <div class="input">
                    <input ref="passwordRef" type="password" v-model="password" @keyup.enter.native="signIn"
                        @focus="errorBFalse" />
                    <passwordSVG class="icon" v-if="writtenPw" />
                </div>
            </div>
            <div class="buttons" v-click-away="errorBFalse">
                <RouterLink to="">
                    <input @click.prevent="signIn" type="button" value="LogIn" />
                </RouterLink>

                <RouterLink to="/register">
                    <input type="button" value="Register" />
                </RouterLink>
                <div class="error" v-if="errorB">{{ errorMessage }}</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@media (min-width: 1024px) {
    .form-wrap {
        position: relative;
        top: 70px;
        margin: auto;
        height: calc(100vh - 70px);
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 50px;
        overflow: hidden;
        padding: 50px;

        img {
            width: 200px;
        }

        .inputs {
            background-color: var(--color-nav-bg);
            border-radius: 10px;
            box-shadow: 2px 2px 5px 5px rgba(255, 255, 255, 0.1);
            width: 65%;
            display: flex;
            flex-direction: column;
            gap: 25px;
            padding: 30px;

            .input-lines {
                position: relative;
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 30px;

                .input {
                    position: relative;
                    border-color: var(--vt-c-nav-text-bg-hover);
                    transition: width 0.1s ease-in-out;

                    input[type="text"],
                    input[type="password"] {
                        font-size: 2rem;
                        padding: 5px 5px 5px 15px;
                        width: 100%;
                        height: 90px;
                        outline-style: solid;
                        font-family: Chango;
                        background: transparent;
                        border: var(--color-nav-txt) solid 3px;
                        border-radius: 10px;
                        outline: none;
                        transition: border 0.1s ease-in-out, width 0.1s ease-in;
                        caret-color: var(--color-nav-txt);
                    }

                    .icon {
                        position: absolute;
                        bottom: 0;
                        top: 0;
                        margin: auto;
                        height: 65%;
                        width: auto;
                        fill: var(--color-nav-txt);
                        z-index: 0;
                        left: 15px;
                        pointer-events: none;
                        transition: all 0.05s ease-in-out;
                        bottom: 3px;
                        border-radius: 5px;
                        background-color: var(--color-nav-bg);
                    }

                    input:focus+.icon {
                        top: -90px;
                        height: 30px;
                    }
                }

                input[type="text"] {
                    font-size: 2rem;
                }

                input,
                select,
                textarea {
                    color: var(--color-nav-txt);
                }

                input::placeholder {
                    color: var(--color-nav-txt);
                    font-weight: Light;
                }

                input:focus::placeholder {
                    outline: none;
                    color: transparent;
                }
            }

            .buttons {
                display: flex;
                align-items: center;
                flex-direction: column;
                height: 100%;
                width: 100%;
                position: relative;
                list-style-type: none;
                gap: 10px;

                a {
                    width: 100%;
                    display: flex;
                    list-style: none;
                    text-decoration: none;

                    input[type="button"] {
                        text-decoration: none;
                        display: flex;
                        justify-content: center;
                        list-style-type: none;
                        display: flex;
                        overflow: visible;
                        width: 100%;
                        height: 100%;
                        font-family: Chango;
                        font-size: 2rem;
                        border-radius: 18px;
                        cursor: pointer;
                        color: var(--color-nav-txt) !important;
                        border-style: none;
                        box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.3);
                        background-color: var(--color-nav-bg);
                        transition: all 0.1s ease-in-out;
                    }
                }

                input[type="button"]:hover {
                    color: var(--color-nav-bg) !important;
                    background-color: var(--color-nav-txt);
                }

                input[type="button"]:active {
                    box-shadow: -1px -1px 1px 0.5px rgba(0, 0, 0, 0.3);
                }
            }
        }
    }
}
</style>
