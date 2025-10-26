<script setup lang="ts">
import { ref, watch, onMounted, Ref, computed } from "vue"
import passwordSVG from "../../components/icons/password.vue";
import Yes from "../../components/icons/yes.vue";

const props = defineProps<{
    currentPassword?: string;
    newPassword1?: string;
    newPassword2?: string;
    doPasswordsMatch?: boolean;
}>();



const emit = defineEmits(['saveProfileCheckEmail', 'changingPasswordTrigger']);
const password = ref(props.currentPassword ?? '');
const hasFocusedOnce = ref(false);
const changingPasswordTrigger = ref(false)
const firstWriteIntoPassword1 = ref(false);


function handleInput() {
    if (props.currentPassword !== undefined) {
        emit('saveProfileCheckEmail', { currentPassword: password.value });
    } else if (props.newPassword1 !== undefined) {
        emit('saveProfileCheckEmail', { newPassword1: password.value });
    } else if (props.newPassword2 !== undefined) {
        emit('saveProfileCheckEmail', { newPassword2: password.value });
    }

    if (props.newPassword1 !== undefined && firstWriteIntoPassword1.value === false) {
        changingPasswordTrigger.value = true
        emit('changingPasswordTrigger', changingPasswordTrigger.value);
    }
}



onMounted(() => {

});


</script>

<template>
    <div class="wrapper" :class="props.currentPassword != undefined ? 'current-password' : ''">
        <div class="icon-pw">
            <label>{{ props.currentPassword != undefined ? 'Password' : 'New password' }}</label>
            <passwordSVG class="icon" />
        </div>
        <input type="password" v-model="password" @keyup.enter.native="emit('saveProfileCheckEmail', password)"
            @input="handleInput" />
        <div class="password-matching-wr" v-if="props.newPassword2 !== undefined">
            <div class="inner-wrapper" :class='(props.doPasswordsMatch ? "match" : "no-match")'
                v-if="props.newPassword2 !== undefined && props.doPasswordsMatch !== undefined">
                <Yes />
                <transition name="passwordChange" mode="out-in">

                    <div class="password-matching" :key="String(props.doPasswordsMatch)">
                        {{
                            props.doPasswordsMatch ? "Passwords match" : "Passwords don't match" }}</div>
                </transition>

            </div>


        </div>

        <input type="button" v-if="props.currentPassword != undefined" class="button" value="Save"
            @click.prevent="emit('saveProfileCheckEmail', password)" />
    </div>
</template>

<style lang="scss" scoped>
.button {
    font-weight: 500;
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




.wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .icon-pw {
        position: relative;
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;

        .icon {
            position: relative;
            fill: var(--color-nav-txt);
            width: 40px;
        }

        label {
            color: var(--color-nav-txt);
            font-size: 1rem;
        }
    }

    .password-matching-wr {
        height: 15px;

        .inner-wrapper {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 5px;
            gap: 3px;

            svg {
                height: 20px;
                transition: all 0.2s ease-in-out;
            }

            &.match {
                color: green;

                svg {
                    transform: rotate(180deg);
                    fill: green;
                }
            }

            &.no-match {
                color: red;

                svg {
                    transform: rotate(0deg);
                    fill: red;
                }
            }

            .password-matching {
                font-size: 0.7rem;
            }
        }
    }


    input[type="password"] {
        position: relative;
        font-family: 'Roboto Condensed', sans-serif;
        font-size: 1.2rem;
        border: none;
        outline: none;
        padding: 3px 0;
        padding: 5px 5px 5px 5px;
        border-radius: 5px;
        color: var(--color-nav-txt);
        background-color: var(--color-nav-bg);
        border: var(--color-nav-txt) 4px solid;
        width: 200px;
    }

    .button:hover {
        background-color: var(--color-nav-txt-darker);
    }

    .button:active {
        box-shadow: inset rgba(0, 0, 0, 0.568) 2px 2px 2px 1px;
    }

    .button {
        background-color: var(--color-nav-txt);

        &:hover {
            background-color: var(--color-nav-txt-darker);
            ;
        }
    }
}

.wrapper.current-password {

    label {
        color: rgb(167, 1, 1);
    }

    .icon {
        fill: rgb(167, 1, 1);
    }


    input[type="password"] {
        color: rgb(167, 1, 1);
        border: rgb(167, 1, 1) 4px solid;
    }

    .button {
        margin-top: 10px;
        background-color: rgb(167, 1, 1);

        &:hover {
            background-color: rgb(214, 3, 3);
        }
    }

}



</style>