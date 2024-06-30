<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import firebase from "firebase/compat/app";
import "cropperjs/dist/cropper.css";

import VueDatePicker from "@vuepic/vue-datepicker";
import "../../assets/vuepic.scss";
import Modal from "../../components/Modal.vue";
import AskExcerpt from "../../components/createpost/CreatePostAskExcerpt.vue";


const props = defineProps({
  postTitle: String,
  postContent: String,
  postAuthor: String,
  postExcerpt: String,
  postDate: String,
  checkSavedPost: Boolean,
  rawImg: String,
  postID: String,
  postSection: String,
  postCategory: Array as any,
});

const emit = defineEmits([
  "showPreview",
  "postDate",
  "postContent",
  "postTitle",
  "changedImage",
]);
const checkSavedPost = computed(() => props.checkSavedPost);
const saveShow = ref();

const date = ref() as any;



const postDate = ref();

const postID = ref() as any;
const savedPostID = ref(false);

watch(
  () => props.postID,
  () => {
    postID.value = props.postID;
    savedPostID.value = true;
  }
);

watch(
  () => props.postExcerpt,
  (newValue) => {
    excerpt.value = newValue;
  }
);


date.value = new Date();
postDate.value = date.value.toString()
emit("postDate", postDate.value)

watch(date, (newValue) => {
  postDate.value = newValue.toString()
  emit("postDate", postDate.value)

})
const showPreview = () => {
  emit("showPreview", true);
};

const postContent = ref(props.postContent);
const postTitle = ref(props.postTitle);
const propRawImg = computed(() => props.rawImg);

watch(propRawImg, (newValue) => {
  if (newValue !== undefined || newValue !== null || newValue !== "") {
    rawImg.value = newValue;
    showCoverPreview.value = true;
  } else {
    rawImg.value = null;
  }
});

const datePicker = ref();
const fileUpload = ref() as any;
const coverFile = ref() as any;
const rawImg = ref();

const excerpt = ref();
const characterCounter = ref("70 characters left");
const characterCounterRef = ref() as any;
const showCoverPreview = ref();

const error = ref(false);
const errorMsg = ref("");

const changedImage = ref(false);
watch(changedImage, () => {
  emit("changedImage", true);
});

const modalActive = ref(false);

const onFileClick = (e: any) => {
  e.target.value = null;
};

const onFileSelect = (file: any) => {
  coverFile.value = file.target.files[0];
  changedImage.value = true;
  saveShow.value = true;
  const mime_type = ref();
  mime_type.value = coverFile.value.type;
  const validImageTypes = ["image/jpeg", "image/png"];

  if (validImageTypes.includes(mime_type.value)) {
    if (typeof FileReader === "function") {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (coverFile.value) {
        }
        coverFile.value = event.target?.result;
      };

      reader.readAsDataURL(coverFile.value);
      interface IResizeImageOptions {
        maxSize: number;
        file: File;
      }
      const resizeImage = (settings: IResizeImageOptions) => {
        const file = settings.file;
        const maxSize = settings.maxSize;
        const reader = new FileReader();
        const image = new Image();
        const canvas = document.createElement("canvas");
        const dataURItoBlob = (dataURI: string) => {
          const bytes =
            dataURI.split(",")[0].indexOf("base64") >= 0
              ? atob(dataURI.split(",")[1])
              : unescape(dataURI.split(",")[1]);
          const mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
          const max = bytes.length;
          const ia = new Uint8Array(max);
          for (var i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
          return new Blob([ia], { type: mime });
        };
        const resize = () => {
          let width = image.width;
          let height = image.height;

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d")!.drawImage(image, 0, 0, width, height);
          let dataUrl = canvas.toDataURL("image/png");
          return dataURItoBlob(dataUrl);
        };

        return new Promise((ok, no) => {
          if (!file.type.match(/image.*/)) {
            no(new Error("Not an image"));
            return;
          }

          reader.onload = (readerEvent: any) => {
            image.onload = () => ok(resize());
            image.src = readerEvent.target.result;
          };
          reader.readAsDataURL(file);
        });
      };

      // START: preview resized
      resizeImage({ file: coverFile.value, maxSize: 300 })
        .then((resizedImage) => {
          var blob = resizedImage;

          var reader = new FileReader() as any;

          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            var base64data = reader.result;
            rawImg.value = base64data;
            showCoverPreview.value = true;
            return;
          };
        })
        .catch((err) => {
          console.error(err);
        });
      // END: preview resized
    } else {
      alert("Sorry, FileReader API not supported");
    }
  } else {
    alert("Select an image file (png or jpeg)");
  }
};
const btnClose = (e: any) => {
  fileUpload.value = "";
  showCoverPreview.value = false;
  saveShow.value = true;
  rawImg.value = null;
};
const savedObj = ref({});

const excerptDialogue = ref(false);

const excerptYes = () => {
  var strippedHtml = postContent.value!.replace(/<[^>]+>/g, "");
  excerpt.value = strippedHtml.slice(0, 70);
  excerptDialogue.value = false;
};
const excerptNo = () => {
  excerptDialogue.value = false;
};

const modalLoadingMessage = ref();
const modalAnimation = ref(false);

const modalClickAway = () => {
  modalActive.value = false;
};

const countExcerpt = () => {
  var maxlength = 70;

  if (excerpt.value !== null) {
    var currentLength = excerpt.value.length;
  } else {
    currentLength = 0;

  }

  if (currentLength >= maxlength) {
    characterCounter.value = "0 characters left";
    characterCounterRef.value.style.color = "red";
  } else {
    characterCounterRef.value.style.color = "var(--color-nav-txt)";
    characterCounter.value = maxlength - currentLength + " characters left";
  }
  excerptDialogue.value = false;
};

watch(excerpt, () => {
  countExcerpt();
});

const savePost = () => {
  function actualSaving() {
    modalActive.value = true;
    modalAnimation.value = true;
    modalLoadingMessage.value = "Saving";
    const firebaseAuth = firebase.auth().currentUser;
    const dataBase = db.collection("users").doc(firebaseAuth?.uid);

    savedObj.value = {
      postTitle: props.postTitle || null,
      postDate: date.value.toString(),
      postAuthor: props.postAuthor,
      postContent: props.postContent || null,
      postExcerpt: excerpt.value || null,
      coverImage: rawImg.value || null,
      postCategory: props.postCategory || null,
      postSection: props.postSection || null,
    };
    dataBase
      .update({
        savedPost: savedObj.value,
      })
      .catch((error:any) => {
        error.value = true;
        errorMsg.value = error.message;
      })
      .then(() => {
        setTimeout(() => {
          modalAnimation.value = false;

          modalLoadingMessage.value = "Save Successfull";
        }, 600);
      })
      .then(() => {
        setTimeout(() => {
          modalActive.value = false;
        }, 1500);
      });
  }

  if (excerpt.value == undefined || excerpt.value == "") {
    excerptDialogue.value = true;
    watch(excerptDialogue, () => {
      if (!excerptDialogue.value) {
        actualSaving();
      }
    });
  } else {
    actualSaving();
  }
};

const uploadPost = async () => {

  if (postTitle.value == undefined || postTitle.value == "") {
    error.value = true;
    errorMsg.value = "Give the post a title";
    modalActive.value = error.value;
    modalLoadingMessage.value = errorMsg.value;
  } else if (
    postContent.value == undefined ||
    postContent.value == "<p><br></p>"
  ) {
    error.value = true;
    errorMsg.value = "Post content can not be empty";
    modalActive.value = error.value;
    modalLoadingMessage.value = errorMsg.value;
  } else if (excerpt.value == undefined || excerpt.value == "") {
    error.value = true;
    errorMsg.value = "Excerpt can not be empty";
    modalActive.value = error.value;
    modalLoadingMessage.value = errorMsg.value;
  } else if (props.postSection == undefined || props.postSection == "") {
    error.value = true;
    errorMsg.value = "Section is needed";
    modalActive.value = error.value;
    modalLoadingMessage.value = errorMsg.value;
  } else if (props.postCategory == undefined || props.postCategory == "[]") {
    error.value = true;
    errorMsg.value = "At least 1 category is needed";
    modalActive.value = error.value;
    modalLoadingMessage.value = errorMsg.value;
  } else {
    modalActive.value = true;
    modalLoadingMessage.value = "Uploading";
    modalAnimation.value = true;
    if (postID.value === undefined) {
      postID.value = new Date().valueOf().toString();
    }

    if (props.postSection == "Blog") {
      const dataBase = db.collection("blogposts").doc(postID.value);
      const coverImage = ref();
      if (rawImg.value == undefined) {
        coverImage.value = null;
      } else {
        coverImage.value = rawImg.value;
      }
      await dataBase
        .set({
          postID: postID.value,
          postCategory: props.postCategory,
          postSection: props.postSection,
          coverImage: rawImg.value || null,
          postDate: date.value,
          postAuthor: props.postAuthor,
          postTitle: postTitle.value,
          postContent: postContent.value,
          postExcerpt: excerpt.value,
          lastUpload: new Date(),
        })
        .then(() => {
          modalLoadingMessage.value = "Successfull Upload";
          modalAnimation.value = false;
        })
        .catch((error:any) => {
          modalLoadingMessage.value = error.msg;
        })
        .then(() => {
          setTimeout(() => {
            modalActive.value = false;
          }, 1000);
        });
    }
    if (props.postSection == "News") {
      const dataBase = db.collection("news").doc(postID.value);
      const coverImage = ref();
      if (rawImg.value == undefined) {
        coverImage.value = null;
      } else {
        coverImage.value = rawImg.value;
      }
      await dataBase
        .set({
          postID: postID.value,
          postCategory: props.postCategory,
          postSection: props.postSection,
          coverImage: rawImg.value || null,
          postDate: date.value,
          postAuthor: props.postAuthor,
          postTitle: postTitle.value,
          postContent: postContent.value,
          postExcerpt: excerpt.value,
          lastUpload: new Date(),
        })
        .then(() => {
          modalLoadingMessage.value = "Successfull Upload";
          modalAnimation.value = false;
        })
        .catch((error:any) => {
          modalLoadingMessage.value = error.msg;
        })
        .then(() => {
          setTimeout(() => {
            modalActive.value = false;
          }, 1000);
        });
    }
  }
};

const userData = ref();
const savedPost = ref();

watch(checkSavedPost, () => {
  if (checkSavedPost.value) {
    firebase.auth().onAuthStateChanged((user) => {
      const dataBase = db
        .collection("users")
        .doc(firebase.auth().currentUser?.uid);
      dataBase
        .get()
        .then((doc:any) => {
          userData.value = doc.data();
        })

        .then(() => {
          savedPost.value = userData.value.savedPost;
          if (
            Object.keys(savedPost.value).length !== 0 ||
            Object.keys(savedPost.value) !== null
          ) {
            emit("postContent", savedPost.value.postContent);
            emit("postTitle", savedPost.value.postTitle);
            excerpt.value = savedPost.value.postExcerpt;
            postDate.value = savedPost.value.postDate;
            date.value = postDate.value;
            if (savedPost.value.coverImage === null) {
            } else {
              rawImg.value = savedPost.value.coverImage;
              showCoverPreview.value = true;
            }
          }
        });
    });
  }
});

watch(
  () => [props.postContent, props.postTitle],
  ([postC, postT]) => {
    postContent.value = props.postContent;
    postTitle.value = props.postTitle;

    if (postC !== undefined || postC !== "<p><br></p>") {
      saveShow.value = true;
    }
    if (postT !== "") {
      saveShow.value = true;
    }

    if (
      (postC === undefined && postT === "") ||
      (postC === "<p><br></p>" && postT === "") ||
      (postC === undefined && postT === undefined) ||
      (postC === "<p><br></p>" && postT === "") ||
      (postC === "<p><br></p>" && postT === undefined)
    ) {
      saveShow.value = false;
    }
  }
);

const autoFill = ref(false);
const autoFillLeaveCheck = ref(false);
const autoFillHover = () => {
  setTimeout(() => {
    if (!autoFillLeaveCheck.value) {
      autoFill.value = true;
    }
  }, 900);
};

const autoFillLeave = () => {
  autoFillLeaveCheck.value = true;
  setTimeout(() => {
    autoFillLeaveCheck.value = false;
  }, 500);
  autoFill.value = false;
};
const saveDateButton = () => {
  saveShow.value = true;
};
const handler = () => {
  if (excerpt.value !== "") {
    saveShow.value = true;
  } else if (
    (postTitle.value === "" &&
      postContent.value === "<p><br></p>" &&
      excerpt.value === "") ||
    (postTitle.value === undefined &&
      postContent.value === "<p><br></p>" &&
      excerpt.value === "") ||
    (postTitle.value === undefined &&
      postContent.value === undefined &&
      excerpt.value === "") ||
    (postTitle.value === "" &&
      postContent.value === undefined &&
      excerpt.value === "")
  ) {
    saveShow.value = false;
  }
};

const autoFillExcerpt = () => {
  if (postContent.value != undefined) {
    var strippedHtml = postContent.value!.replace(/<[^>]+>/g, "");
    excerpt.value = strippedHtml.slice(0, 70);
  }
};
onMounted(() => { });
</script>

<template>
  <transition name="modal">
    <AskExcerpt v-if="excerptDialogue" class="askexcerpt" @button-no="excerptNo" @button-yes="excerptYes" />
  </transition>
  <transition name="modal">
    <Modal class="modal" v-if="modalActive" :modalAnimation="modalAnimation" :modalLoadingMessage="modalLoadingMessage"
      :position="'absolute'" :spinnerColor="'var(--color-nav-txt)'" v-click-away="modalClickAway" />
  </transition>

  <div class="side-container">

    <div class="cover-photo wrapper">
      <label>Cover Photo</label>
      <div class="cover-preview-wrapper" value="Preview Cover" key="1">
        <div class="cover-image-wrapper">
          <img :src="rawImg" alt="" key="2" v-if="showCoverPreview" />
        </div>
        <div v-if="showCoverPreview" type="button" class="btn-close" @click.prevent="btnClose" />
        <span class="icon-cross"></span>
        <span class="visually-hidden"></span>
      </div>
      <input type="button" @click="fileUpload.click()" class="custom-file-upload" value="Select Image" />

      <input type="file" @change="onFileSelect" @click="onFileClick" name="" ref="fileUpload" id="file-upload"
        style="display: none" />
    </div>
    <div class="date-picker wrapper">
      <div class="author-wrapper">
        <label class="label">Writing as:</label>
        <label class="author"> {{ props.postAuthor }}</label>
      </div>
      <label class="date">Post Date</label>
      <VueDatePicker @update:model-value="saveDateButton" ref="datePicker" v-model="date" auto-apply hide-input-icon
        show-now-button :month-change-on-scroll="true" :close-on-auto-apply="true" :close-on-clear-value="false"
        :min-date="new Date()">
      </VueDatePicker>
    </div>
    <div class="excerpt-wrapper wrapper">
      <label>Excerpt</label>
      <textarea type="text" class="excerpt-textarea" v-model="excerpt" maxlength="70" ref="excerptText"
        @input="handler" />

      <div class="excerpt-counter">
        <div class="autofill-hover" v-if="autoFill">
          This will make the excerpt filled out with text from the editor to the
          left
        </div>
        <div ref="characterCounterRef" v-text="characterCounter" class="character-counter" />

        <input type="button" value="AutoFill" @click="autoFillExcerpt" @mouseover="autoFillHover"
          @mouseleave="autoFillLeave" />
      </div>
    </div>


    <div class="btns wrapper">
      <transition name="save">
        <div class="button-save" v-if="saveShow">
          <input type="button" value="Save" @click="savePost" />
        </div>
      </transition>
      <div class="button-preview">
        <input type="button" value="Preview" @click="showPreview" />
      </div>
      <div class="button-upload">
        <input type="button" value="Upload" @click="uploadPost" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
*::-webkit-scrollbar {
  width: 12px;
}

*::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: var(--color-nav-bg);
  cursor: pointer;
}

.askexcerpt {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 400px;
  width: 600px;
  border-radius: 30px;
  box-shadow: 2px 2px 5px 10px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.side-container input[type="button"] {
  font-family: Chango;
  font-size: 16px;
  border-radius: 18px;
  width: 100%;
  cursor: pointer;
  padding: 10px;
  color: var(--color-nav-txt) !important;
  border-style: none;
  box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.3);
  background-color: var(--color-nav-bg);
  transition: all 0.15s ease-in-out;
}

.side-container input[type="button"]:hover {
  color: var(--color-nav-bg) !important;
  background-color: var(--color-nav-txt);
}

.side-container input[type="button"]:active {
  box-shadow: -1px -1px 1px 0.5px rgba(0, 0, 0, 0.3);
}

label {
  width: 100%;
  left: 0;
  margin-bottom: 10px;
}

.side-container {
  position: relative;
  height: 100%;
  width: 230px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  gap: 10px;
  background-color: var(--color-nav-bg);
  border-radius: 15px;
  box-shadow: 2px 2px 5px 3px rgba(0, 0, 0, 0.3);
  font-family: Chango;
  transition: transform 0.3s ease-in-out;
  color: var(--color-nav-txt);

  .date-picker {
    width: 100%;
    display: flex;
    flex-direction: column;
    color: var(--color-nav-txt);
    gap: 3px;

    .date {
      width: 100%;
      margin: 0;
      left: 0;
    }

    .author-wrapper {
      font-family: Roboto Condensed;
      font-weight: 700;
      margin-bottom: 10px;
      display: flex;



      .author {
        width: 100%;
        text-align: right;
      }
    }
  }

  .excerpt-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;



    textarea {
      width: 100%;
      font-family: Roboto Condensed;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 10px;
      border: solid 2px var(--color-nav-txt);
      background-color: white;
      height: 100px;
      color: var(--color-nav-txt);
      text-align: top;
      resize: none;
      padding: 10px;
    }

    textarea:focus-visible {
      outline: var(--color-nav-txt);
    }

    textarea>div>div:last-child {
      scroll-snap-align: end;
    }

    .excerpt-counter {
      margin-top: 10px;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: center;
      gap: 10px;
      font-size: 0.8rem;

      .autofill-hover {
        font-size: 0.8rem;
        position: absolute;
        z-index: 99;
        height: 100px;
        width: 200px;
        background-color: white;
        padding: 10px;
        margin: auto;
        right: -190px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        box-shadow: 2px 2px 5px 3px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
      }

      input[type="button"] {
        height: 20px;
        font-size: 0.7rem;
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }
    }
  }

  .cover-photo {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    height: 100%;

    .cover-preview-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      margin-bottom: 5px;

      .btn-close {
        position: absolute;
        border: 0;
        padding: 0;
        right: 10px;
        top: 10px;
        background: var(--color-nav-txt);
        border-radius: 50%;
        box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.3);
        width: 40px;
        height: 40px;
        border: solid 1px rgba(0, 0, 0, 0.219);
        cursor: pointer;
        transition: all 150ms;

        &:hover {
          box-shadow: 0px 0px 0px 8px rgba(0, 0, 0, 0.5);
        }

        &:focus {
          box-shadow: -0px -0px 0px 0.5px rgba(0, 0, 0, 0.3);
        }
      }

      .btn-close:before,
      .btn-close:after {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 5px;
        height: 20px;
        background-color: var(--color-nav-bg);
        transform: rotate(45deg) translate(-50%, -50%);
        transform-origin: top left;
        content: "";
      }

      .btn-close:after {
        transform: rotate(-45deg) translate(-50%, -50%);
      }

      .btn-close:after:hover {
        transform: rotate(-90deg) translate(-50%, -50%);
      }

      .cover-image-wrapper {
        height: 120px;
        width: 100%;
        border-radius: 5px;
        border: solid 5px var(--color-nav-txt);
        border-radius: 10px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .btns {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 10px;

    .button-upload {
      input {
        font-size: 2rem;
        background-color: var(--color-nav-txt) !important;
        color: var(--color-nav-bg) !important;
      }

      input:hover {
        background-color: var(--color-nav-bg) !important;
        color: var(--color-nav-txt) !important;
      }
    }

    .button-save {
      transition: opacity 0.4s ease-in-out;

      input {
        background-color: red;
        color: var(--color-nav-bg) !important;
      }

      input:hover {
        background: rgba(114, 2, 2, 0.8) !important;
      }
    }
  }
}

.save-enter-active,
.save-leave-active {
  transition: all 0.2s ease-out;
  opacity: 1;
}

.save-enter-from,
.save-leave-to {
  transition: all 0.4s ease-out;
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

@media (max-height: 768px) {
  .side-container .btns .button-upload input {
    height: 30px;
    font-size: 1rem;
  }

  .side-container input[type=button] {
    height: 30px;
    padding: 3px;
  }

  .side-container .cover-photo .cover-preview-wrapper .cover-image-wrapper {
    height: 40px;
    padding: 3px;
  }

  .side-container .excerpt-wrapper textarea {
    height: 50px;
  }

  label {
    font-size: 0.8rem;
    margin-bottom: 3px;
  }
}

@media (max-height: 550px) {
  .side-container {
    width: 400px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0px;

    .wrapper {
      padding: 10px;
      position: relative;
      display: flex;
      height: 100%;
      width: 100%;
    }

    .wrapper:nth-child(2) {
      bottom: 0;
      margin: auto;
    }
  }

  .side-container .cover-photo .cover-preview-wrapper .cover-image-wrapper {
    height: 100px;
    padding: 3px;
  }

  .side-container .excerpt-wrapper textarea {
    height: 100px;
  }

  .side-container input[type=button] {
    height: 50px;
    padding: 3px;
  }

  .side-container .btns .button-upload input {
    height: 50px;
    font-size: 1rem;
  }
}</style>
