<script setup lang="ts">
import { ref, watch } from "vue";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import { profPicChanged } from "../store/profPicChanged";
import Modal from "../components/Modal.vue";

import "firebase/compat/auth";

const props = defineProps({
    propPFP: Boolean
})
const emit = defineEmits(['PFPChange', 'closePanel'])

watch(() => props.propPFP, () => {
    console.log(props.propPFP);
})

const propperPFP = ref(props.propPFP)
console.log(propperPFP.value);

const selectedFile = ref();
const dialog = ref(false);
const fileUpload = ref();
const cropper = ref() as any;
const showCropButton = ref(false);
const modalActivation = ref(false);
const modalLoadingMessage = ref();
const modalAnimation = ref(false);

const currentPFP = ref();


currentPFP.value = localStorage.getItem("avatar");
const destination = ref();

const onFileSelect = (e: any) => {
    showCropButton.value = true;

    dialog.value = true;
    const file = e.target.files[0];
    const mime_type = ref();
    mime_type.value = file.type;

    if (typeof FileReader === "function") {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (selectedFile.value) {
                cropper.value.replace(event.target?.result);
            }
            selectedFile.value = event.target?.result;
        };

        reader.readAsDataURL(file);
        destination.value = false;
    } else {
        alert("Sorry, FileReader API not supported");
    }
};


const handleCropped = () => {
    function getRoundedCanvas(sourceCanvas: any) {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        var width = sourceCanvas.width;
        var height = sourceCanvas.height;

        canvas.width = width;
        canvas.height = height;
        context!.imageSmoothingEnabled = true;
        context!.drawImage(sourceCanvas, 0, 0, width, height);
        context!.globalCompositeOperation = "destination-in";
        context!.beginPath();
        context!.arc(
            width / 2,
            height / 2,
            Math.min(width, height) / 2,
            0,
            2 * Math.PI,
            true
        );
        context!.fill();
        return canvas;
    }

    var roundedCanvas;

    const croppedCanvas = cropper.value.getCroppedCanvas({
        width: 128,
        height: 128,
    });

    roundedCanvas = getRoundedCanvas(croppedCanvas);
    destination.value = roundedCanvas.toDataURL();

};


const closePicPanel = () => {
    emit('closePanel', true)
}

const selectPFP = () => {
    emit('PFPChange', destination.value)
    emit('closePanel', true)

}
</script>

<template>
    <div class="editingPanel-wrapper">
        <transition name="modal">
            <Modal class="modal" v-if="modalActivation" :modalLoadingMessage="modalLoadingMessage"
                :modalAnimation="modalAnimation" :position="'absolute'" :spinnerColor="'var(--color-nav-txt)'" />
        </transition>

        <input class="backButton" type="button" @click="closePicPanel" value="Back" />

        <div class="current" v-if="propperPFP">
            <label for="current">Current</label>
            <img v-bind:src="currentPFP" />
        </div>

        <div class="editingPanel">
            <VueCropper ref="cropper" :src="selectedFile" :img-style="{ width: '128px', height: '128px' }"
                :zoomOnWheel="true" :aspect-ratio="1" :autoCropArea="1" :viewMode="3" :cropBoxMoveable="false"
                :cropBoxResizable="false" :toggleDragModeOnDblclick="false" :autoCrop="true"
                v-if="selectedFile && !destination"></VueCropper>
            <input v-if="showCropButton" type="button" value="Crop" @click="handleCropped" />
            <div class="preview" v-if="destination">
                <label for="">New</label>
                <img v-bind:src="destination" alt="" />
            </div>
        </div>
        <div class="btns">
            <input type="button" @click="fileUpload.click()" class="custom-file-upload" value="Select image" />

            <input type="file" name="" ref="fileUpload" id="file-upload" @change="onFileSelect" style="display: none" />
            <input type="button" value="Ok" v-if="destination" @click="selectPFP" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.editingPanel-wrapper {
    padding: 20px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    border-radius: 30px;
    background-color: var(--color-nav-bg);
    z-index: 10;
    display: flex;
    box-shadow: 4px 4px 5px 5px rgba(0, 0, 0, 0.3);
    justify-content: center;
    align-items: center;
    gap: 20px;
    overflow: hidden;

    .current {
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
            width: 128px;
        }

        label {
            position: absolute;
            top: -30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .backButton {
        position: absolute;
        top: 0;
        right: 0;
        margin: 30px;
    }

    input[type="button"] {
        font-family: Chango;
        font-size: 1.7rem;
        border-radius: 18px;
        cursor: pointer;
        padding: 10px;
        color: var(--color-nav-txt) !important;
        border-style: none;
        box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.3);
        background-color: var(--color-nav-bg);
    }

    input[type="button"]:hover {
        color: var(--color-nav-bg) !important;
        background-color: var(--color-nav-txt);
        transition: all 0.1s ease-in-out;
    }

    .editingPanel {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 150px;

        input[type="button"] {
            position: absolute;
            bottom: -60px;
            font-size: 2rem;
        }

        .preview {
            display: flex;
            flex-direction: column;
            align-items: center;

            label {
                position: absolute;
                top: -30px;
            }

            img {
                width: 128px;
            }
        }
    }

    .btns {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
}

.modal {
    position: absolute;
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

@media only screen and (max-width: 680px) {
    .editingPanel-wrapper {
        width: 100%;

        input[type="button"] {
            font-size: 1rem;
        }

        .editingPanel {
            input[type="button"] {
                font-size: 1.5rem;
            }
        }
    }

}
</style>
