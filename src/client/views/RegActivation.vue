<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router";
import Modal from "../components/Modal.vue"
import router from "../router";
import axios from "axios";

const route = useRoute();
const modalActive = ref(false)
const modalAnimation = ref(false)

const userID = route.params.userID.toString();
const modalLoadingMessage = ref('Checking activation')
const API_URL = "/api/user/regUserActivation/" + userID

console.log(API_URL);
onMounted(
    async () => {

        modalActive.value = true
        modalAnimation.value = true
        
        axios.get(API_URL).then((response) => {

            setTimeout(() => {
                modalAnimation.value = false
                modalLoadingMessage.value = 'Account successfully activated'
                setTimeout(() => {
                    router.push({ name: "landing" });

                }, 2000);

            }, 1000)
        }).catch((err) => {
            console.log(err);
            if (err.message = "User already activated") {

                setTimeout(() => {
                    modalAnimation.value = false
                    modalLoadingMessage.value = 'Account already activated'
                }, 1000);
            } else {
                modalLoadingMessage.value = err.message
            }

        })


    })

</script>

<template>
    <div class="wrapper">
        <div class="inner">
            <transition name="modal">
                <Modal v-if="modalActive" :modalAnimation="modalAnimation" :modalLoadingMessage="modalLoadingMessage"
                    :spinnerColor="'var(--color-nav-txt)'" :fontSize="'3rem'" :position="'relative'" class="modal"
                    :loadingScale="2" />
            </transition>

        </div>
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    position: relative;
    height: 100vh;
    width: 100vw;

    .inner {
        position: relative;
        height: calc(100% - 70px);
        top: 70px;
        display: flex;
        justify-content: center;
        align-items: center;

        .modal {
            position: relative;
            height: 400px;
            width: 600px;
            border-radius: 30px;
            box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }
    }
}

.modal-enter-active,
.modal-leave-active {
    transition: all 0.8s ease-in-out;
}

.modal-enter-from,
.modal-leave-to {
    transform: translateX(400px)
}
</style>