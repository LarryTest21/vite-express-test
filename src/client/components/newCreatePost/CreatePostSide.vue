<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import Calendar from "primevue/calendar";
import moment from "moment"
import axios from "axios"
import { userData } from "../../store/userData";
import _ from 'lodash';
import Modal from "../../components/Modal.vue"

const props = defineProps({
  postContent: String,
  postTitle: String,
  userID: String,
  savedPost: Object,
  showSavedPost: Boolean,
  emittedMainCategory: Object,
  emittedSubCategory: Object
});

const emit = defineEmits([
  "showPreview",
  "interPost",
  "postSaved",
]);

const mainCategory = computed(() => props.emittedMainCategory)
const subCategory = computed(() => props.emittedSubCategory)



const changedImage = ref(false);


const interPost = ref({ postContent: undefined, postTitle: undefined, postExcerpt: undefined, postDate: undefined, coverImage: undefined, mainCategory: undefined, subCategory: undefined }) as any


const postDate = ref();
const autoFill = ref();

const excerpt = ref();
const saveShow = ref(false);

const characterCounter = ref("70 characters left");
const characterCounterRef = ref() as any;
const excerptDialogue = ref();

const showCoverPreview = ref()

const showSavedButton = ref()
const fileUpload = ref() as any;
const coverFile = ref() as any;
const rawImg = ref();

const showModalImage = ref()

const btnClose = (e: any) => {
  fileUpload.value = "";
  showCoverPreview.value = false;
  saveShow.value = true;
  rawImg.value = null;
};


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
      showModalImage.value = true
    }
  } else {
    showModalImage.value = true


  }
};

const userID = ref(props.userID)
watch(userID, (newvalue) => {
  console.log(`output->newvalue`, newvalue)
})

const postTitle = computed(() => props.postTitle)

const postContent = computed(() => props.postContent)

const showPostDate = ref()


watch(postContent, (newvalue) => {
  if (newvalue === '<p></p>') {
    interPost.value['postContent'] = undefined
  } else {
    interPost.value['postContent'] = newvalue
  }
})

watch(postTitle, (newvalue) => {
  if (newvalue === '' || newvalue === undefined) {
    interPost.value['postTitle'] = undefined
  } else {
    interPost.value['postTitle'] = newvalue
  }
})

watch(() => excerpt.value, (newvalue) => {
  if (newvalue === '' || newvalue === undefined) {
    interPost.value['postExcerpt'] = undefined
  } else {
    interPost.value['postExcerpt'] = excerpt.value
  }
})

watch(showPostDate, (newvalue) => {
  if (newvalue === null) {
    interPost.value['postDate'] = undefined
  } else {
    interPost.value['postDate'] = newvalue
  }
})

watch(() => rawImg.value, (newvalue) => {
  if (newvalue === '' || newvalue === undefined || newvalue === null) {
    interPost.value['coverImage'] = undefined
  } else {
    interPost.value['coverImage'] = newvalue
  }
})

watch(mainCategory, (newvalue) => {
  if (newvalue === undefined || newvalue === null) {
    interPost.value['mainCategory'] = undefined
  } else {
    interPost.value['mainCategory'] = newvalue
  }
}, { deep: true })

watch(subCategory, (newvalue) => {
  if (newvalue === undefined || newvalue === null) {
    interPost.value['subCategory'] = undefined
  } else {
    interPost.value['subCategory'] = newvalue
  }
}, { deep: true })

const autoFillLeaveCheck = ref(false);


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
    (postTitle.value === "" && postContent.value === undefined && excerpt.value === "")
  ) {
    saveShow.value = false;
  }
};

const autoFillLeave = () => {
  autoFillLeaveCheck.value = true;
  setTimeout(() => {
    autoFillLeaveCheck.value = false;
  }, 900);
  autoFill.value = false;
};
const autoFillExcerpt = () => {
  autoFill.value = false;

  if (postContent.value != undefined) {
    var strippedHtml = postContent.value!.replace(/<[^>]+>/g, "");
    excerpt.value = strippedHtml.slice(0, 70);
  }
};
const autoFillHover = () => {
  setTimeout(() => {
    if (!autoFillLeaveCheck.value) {
      autoFill.value = true;
    }
  }, 800);
};
const savedPost = ref()


const savePost = () => {
  savedPost.value = interPost.value
  savedPost.value['author'] = userData().data.firstName
  localStorage.setItem("savedPost", JSON.stringify(savedPost.value))

  axios.post("/api/user/refresh").then(() => {
    axios.post("/api/user/updateSavedPost/" + userID.value, { savedPost: savedPost.value }).then((res) => {
      emit("postSaved", true)
    }).then(() => {
      setTimeout(() => {
        showSavedButton.value = false
      }, 1400);
    })
  }).catch((err) => {
    console.log(`output->err`, err)
  })

}

const excerptCount = (newvalue: any) => {

  var maxlength = 70;

  if (newvalue !== null) {
    var currentLength = newvalue.length;
  } else {
    currentLength = 0;
  }

  if (currentLength >= maxlength) {
    characterCounter.value = "0 characters left";
    characterCounterRef.value.style.color = "red";
  } else {
    characterCounter.value = maxlength - currentLength + " characters left";

    characterCounterRef.value.style.color = "var(--color-nav-txt)";
  }
  excerptDialogue.value = false;
}
watch(() => props.showSavedPost, () => {


  if (props.showSavedPost) {


    interPost.value = userData().data.savedPost

    if (userData().data.savedPost.postDate != undefined) {
      showPostDate.value = moment(new Date(interPost.value.postDate)).format("DD/MM/YYYY HH:MM")
      watch(() => showPostDate.value, (newvalue) => {
        if (newvalue === null) {
          postDate.value = undefined
        } else {
          postDate.value = newvalue.toISOString()
        }
      })

    }

    if (userData().data.savedPost.coverImage != undefined || userData().data.savedPost.coverImage != null) {
      rawImg.value = userData().data.savedPost.coverImage
      showCoverPreview.value = true

    }
    if (userData().data.savedPost.postExcerpt != undefined) {
      excerpt.value = userData().data.savedPost.postExcerpt

      var newvalue = excerpt.value
      setTimeout(() => {
        excerptCount(newvalue)
      }, 1);
    }


  }
}, { immediate: true })



watch(() => excerpt.value, (newvalue) => {
  excerptCount(newvalue)
});




watch(() => interPost.value, (newvalue) => {
  console.log(`output->interPost.value`, interPost.value)
  console.log(`output->props.savedPost`, props.savedPost)
  if (newvalue.postDate === undefined && newvalue.postContent === undefined && newvalue.postExcerpt === undefined && newvalue.coverImage === undefined && newvalue.postTitle === undefined && newvalue.mainCategory === undefined && newvalue.subCategory === undefined) {
    showSavedButton.value = false
  } else {
    console.log(`output->_.isEqual(interPost.value, props.savedPost`, _.isEqual(interPost.value, props.savedPost))
    if (_.isEqual(interPost.value, props.savedPost)) {
      showSavedButton.value = false
    } else {
      showSavedButton.value = true
    }

  }

}, { deep: true })


const test = () => {
  showModalImage.value = false
}

const previewPost = () => {
  emit("showPreview", true);
  emit("interPost", interPost.value)
}

onMounted(() => {





})
</script>

<template>
  <div class="post-side-wrapper">
    <transition name="autofill">
      <div class="modal-back" v-if="showModalImage" v-click-away="test"></div>
    </transition>


    <div class="calendar-wrapper wrapper">
      <label>Post Date</label>
      <Calendar id="calendar-24h" v-model="showPostDate" showTime hourFormat="24" showButtonBar hideOnDateTimeSelect />
    </div>

    <div class="cover-preview-wrapper" value="Preview Cover" key="1">
      <label>Cover Image</label>
      <div class="cover-image-wrapper">
        <transition name="autofill">
          <Modal v-if="showModalImage" v-click-away="test" class="modal" :modalLoadingMessageColor="'red'"
            :modalLoadingMessage="'Select an image file (png or jpeg)'" :fontSize="'1rem'" :position="'absolute'"
            :backgroundOpacity="1" />
        </transition>
        <TransitionGroup name="autofill">
          <img :src="rawImg" alt="" key="2" v-if="showCoverPreview" />
        </TransitionGroup>
        <div v-if="showCoverPreview" type="button" class="btn-close" @click.prevent="btnClose">
          <span class="icon-cross"></span>
          <span class="visually-hidden"></span>
        </div>
      </div>
      <input type="button" @click="fileUpload.click()" class="custom-file-upload" value="Select Image" />
      <input type="file" @change="onFileSelect" @click="onFileClick" name="" ref="fileUpload" id="file-upload"
        style="display: none" />
    </div>


    <div class="excerpt-wrapper wrapper">
      <label>Excerpt</label>
      <textarea type="text" class="excerpt-textarea" v-model="excerpt" maxlength="70" ref="excerptText"
        @input="handler" />
      <div class="excerpt-counter">
        <transition name="autofill">
          <div class="autofill-hover" v-if="autoFill">
            This will make the excerpt filled out with text from the editor to the left
          </div>
        </transition>
        <div ref="characterCounterRef" v-text="characterCounter" class="character-counter" />
        <input type="button" value="AutoFill" @click="autoFillExcerpt" @mouseover="autoFillHover"
          @mouseleave="autoFillLeave" />
      </div>
    </div>


    <div class="buttons wrapper">
      <TransitionGroup name="savedbutton">

        <div class="button" key="1">
          <input type="button" class="preview" value="Preview post" @click.prevent="previewPost" />
        </div>
        <div class="button" v-if="showSavedButton" key="2">
          <input type="button" class="save" value="Save" @click.prevent="savePost" />
        </div>
        <div class="button" key="1">
          <input type="button" class="upload" value="Upload" />
        </div>

      </TransitionGroup>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-back {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.288);
  z-index: 1;
}

.modal {
  position: absolute;
  width: 100%;
  height: 105%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.363);
  z-index: 2
}

input[type="button"] {
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-nav-bg);
  font-family: Roboto Condensed;
  font-weight: 900;
  border-radius: 5px;
  box-sizing: border-box;
  cursor: pointer;
  color: var(--color-nav-txt);
  border: 1px solid transparent;
  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.363);
  padding: 5px;
}

input[type="button"]:hover {
  background-color: var(--color-nav-bg-darker);
}

.post-side-wrapper {
  width: 15%;
  height: 100%;
  position: relative;
  border-radius: 5px;
  background-color: var(--color-nav-bg);
  padding: 10px;
  flex-direction: column;
  display: flex;
  overflow: hidden;
  gap: 20px;

  label {
    font-family: Chango;
    font-size: 1.5rem;
    width: 100%;
  }

  .wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    font-family: Roboto Condensed;
    font-weight: 700;
  }

  .calendar-wrapper {
    display: flex;
    justify-content: flex-start;
  }

  .cover-preview-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 10px;

    .btn-close {
      position: absolute;
      border: 0;
      padding: 0;
      right: 50px;
      top: 50px;
      background: var(--color-nav-bg);
      border-radius: 50%;
      box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.432);
      width: 40px;
      height: 40px;
      cursor: pointer;
      transition: all 150ms;

      &:hover {
        box-shadow: inset 0px 1px 1px 1px var(--color-nav-txt);
        background: var(--color-nav-txt-lighter);

        &:before,
        &:after {
          background-color: var(--color-nav-bg);

        }
      }

      &:active {
        box-shadow: inset 0px 1px 5px 2px var(--color-nav-txt);
      }
    }

    .btn-close:before,
    .btn-close:after {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 5px;
      height: 20px;
      background-color: var(--color-nav-txt);
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
      padding: 3px;
      width: 50%;
      border-radius: 5px;
      border: solid 2px var(--color-nav-txt);
      border-radius: 10px;
      overflow: hidden;
      height: 90px;
      overflow: hidden;

      img {
        border-radius: 5px;
        width: 100%;
        height: 100%;
      }
    }
  }


  .excerpt-wrapper {
    display: flex;
    gap: 10px;

    textarea {
      width: 100%;
      font-family: Roboto Condensed;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 10px;
      border: solid 2px var(--color-nav-txt);
      background-color: white;
      color: var(--color-nav-txt);
      text-align: top;
      resize: none;
      padding: 10px;
    }

    textarea::-webkit-scrollbar {
      width: 20px;
      border-radius: 10px;
    }

    textarea::-webkit-scrollbar-track {
      box-shadow: inset 0 0 10px 10px var(--color-nav-bg-darker);
      border: solid 5px transparent;
      border-radius: 10px;
    }

    textarea::-webkit-scrollbar-thumb {
      box-shadow: inset 0 0 10px 10px var(--color-nav-txt-darker);
      border: solid 5px transparent;
      border-radius: 10px;
    }

    textarea:focus-visible {
      outline: var(--color-nav-txt);
    }

    textarea>div>div:last-child {
      scroll-snap-align: end;
    }

    .excerpt-counter {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
      padding: 0 10px;
      font-size: 1rem;

      .autofill-hover {
        font-size: 1rem;
        position: absolute;
        z-index: 99;
        height: 100px;
        width: 200px;
        background-color: white;
        padding: 10px;
        right: -150px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        box-shadow: 2px 2px 5px 3px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
      }
    }
  }



  .buttons {
    position: relative;
    gap: 10px;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    .button {
      width: 100%;

      input {
        width: 100%;
        font-size: 2rem;
        transition: all 0.2s;
      }

      input:active {
        box-shadow: inset 1px 2px 2px 2px rgba(0, 0, 0, 0.322)
      }

      .save {
        background-color: rgb(110, 0, 0);
        color: var(--color-nav-bg)
      }

      .save:hover {
        background-color: rgb(139, 1, 1);
      }

      .save:focus {
        background-color: rgb(0, 116, 48);
      }

      .upload:hover {
        background-color: var(--color-nav-txt-darker);
        color: var(--color-nav-bg)
      }
    }
  }
}

.autofill-enter-active,
.autofill-leave-active {
  transform: translateY(0px);
  opacity: 1;
  transition: all 0.3s;
}

.autofill-enter-from,
.autofill-leave-to {
  transform: translateY(-4px);
  opacity: 0;
}

.savedbutton-move,
.savedbutton-enter-active,
.savedbutton-leave-active {
  transform: translateX(0px);
  opacity: 1;
  transition: all 0.7s;
}

.savedbutton-move,
.savedbutton-enter-active,
.savedbutton-leave-active {
  transition: all 0.5s cubic-bezier(.15, .66, .32, 1.25);
}

.savedbutton-enter-from,
.savedbutton-leave-to {
  opacity: 0;
  transform: translate(20%, 0%);
}

.savedbutton-leave-active {
  position: absolute;
}


@media (max-height: 824px) {
  .post-side-wrapper {
    label {
      font-size: 1rem;
    }

    .calendar-wrapper {
      flex-direction: column;
    }

    .cover-preview-wrapper {
      .cover-image-wrapper {
        width: 50%;

        input[type=button] {
          font-size: 0.5rem
        }
      }
    }

    .excerpt-wrapper {

      .excerpt-counter {
        font-size: 0.8rem;

        input {
          width: 50px;
          font-size: 0.8rem;

        }
      }
    }

    .buttons {
      .button {
        input {
          font-size: 1.5rem;
        }
      }
    }
  }
}

@media (max-height: 760px) {
  .post-side-wrapper {
    width: 20%;
    display: flex;
    gap: 5px;

    label {
      font-size: 1.1rem;
    }

    .calendar-wrapper {
      flex-direction: column;
      width: 100%;
      margin-bottom: 0;
    }

    .cover-preview-wrapper {
      width: 100%;

      .cover-image-wrapper {
        width: 100px;
        height: 70px;
      }
    }

    .excerpt-wrapper {
      position: relative;
      width: 100%;
      display: flex;
      margin-bottom: 0;

      .excerpt-textarea {
        font-size: 0.8rem;
        height: 70px;

        input {
          font-size: 0.9rem;
        }
      }
    }

    .buttons {

      .button {
        input {
          font-size: 1.5rem;
        }
      }
    }
  }
}


@media (max-height: 684px) {
  .post-side-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;

    .wrapper {
      width: 100%;

    }
  }

}
</style>
