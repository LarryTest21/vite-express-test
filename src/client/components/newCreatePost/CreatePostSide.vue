<script setup lang="ts">
import { ref, watch, computed, onBeforeUpdate } from "vue";
import Calendar from "primevue/calendar";
import moment from "moment";
import axios from "axios";
import { userData } from "../../store/userData";
import _ from "lodash";
import Modal from "../../components/Modal.vue";
import SpinnerChekMark from "../../components/icons/LoadingSpinnerCheckMark.vue";
import { useRoute } from "vue-router";
import { resizeImage } from "../../components/newCreatePost/imageHandler";

const route = useRoute();
const currentRouteName = ref(route.name) as any;

const props = defineProps({
  postContent: String,
  postTitle: String,
  postDate: String,
  postExcerpt: String,
  savedpostid: Number,
  userID: String,
  emittedMainCategory: Object,
  emittedSubCategory: Object,
  postOrEvent: String,
  savedPost: Object,
  showSavedPosts: Boolean,
  editEvent: Object,
  coverImage: String,
  emittedEventCategory: Array,
  postID: Number,
});
const emit = defineEmits([
  "showPreview",
  "interPost",
  "postSaved",
  "postNotFullfilled",
  "eventNotFullfilled",
  "showSavedPosts",
  "closeSavedPosts",
]);

const interPost = ref({
  interTitle: undefined,
  interEventCategory: undefined,
  interContent: undefined,
  interDate: undefined,
  interImage: undefined,
  postAuthorID: userData().data._id,
}) as any;

//InterPost for Post

//InterPost for Event

interPost.value["postAuthorID"] = userData().data._id;
interPost.value["_id"] = props.postID;
watch(
  () => props.emittedEventCategory,
  (newv) => {
    interPost.value["interEventCategory"] = newv;
    console.log(interPost.value);
  }
);

watch(
  () => props.emittedMainCategory,
  (newv) => {
    console.log(newv);
    interPost.value["interMainCategory"] = newv;
  }
);

watch(
  () => props.coverImage,
  (newv) => {
    if (newv != undefined || "") {
      showCoverPreview.value = true;
      rawImg.value = newv;
    } else {
      rawImg.value = undefined;
      showCoverPreview.value = false;
    }
  },
  { deep: true }
);

//Variables to show and save

//Post Title
const postTitle = computed(() => props.postTitle);
watch(
  postTitle,
  (newv) => {
    if (newv == "") {
      interPost.value.interTitle = undefined;
    } else {
      interPost.value.interTitle = newv;
    }
  },
  { deep: true }
);

//Post Author
const postAuthor = computed(() => {
  if (props.userID) {
    return userData().data.firstName + " " + userData().data.lastName;
  } else {
    return "Anonymous";
  }
});

//Post Content
const postContent = computed(() => props.postContent);
watch(
  postContent,
  (newv) => {
    if (newv == "<p></p>") {
      interPost.value.interContent = undefined;
    } else {
      interPost.value.interContent = newv;
    }
  },
  { deep: true }
);

//Post Date
const showPostDate = ref();
watch(
  showPostDate,
  (newv) => {
    if (newv === undefined) {
      showPostDateFormatted.value = undefined;
    }
  },
  { deep: true }
);
const showPostDateFormatted = ref();

//Saved Post ID
const savedpostid = computed(() => props.savedpostid);

const saveShow = ref(false);
const isEventEdit = computed(() => props.editEvent);
const isPostEdit = computed(() => props.savedPost);
//Main Category
const mainCategory = computed(() => props.emittedMainCategory);
watch(
  mainCategory,
  (newv) => {
    interPost.value.mainCategory = newv;
  },
  { deep: true }
);

//Sub Category
const subCategory = computed(() => props.emittedSubCategory);
watch(
  subCategory,
  (newv) => {
    interPost.value.subCategory = subCategory.value;
  },
  { deep: true }
);

const postDate = computed(() => props.postDate);
watch(
  postDate,
  (newv) => {
    if (newv === undefined) {
      showPostDateFormatted.value = "";
    } else {
      interPost.value.interDate = newv;
      showPostDateFormatted.value = moment(new Date(newv!)).format(
        "MM/DD/YYYY HH:mm"
      );
    }
  },
  { deep: true }
);

//Post Excerpt
const postExcerpt = computed(() => props.postExcerpt);
watch(
  postExcerpt,
  (newv) => {
    interPost.value.interExcerpt = newv;
    excerpt.value = newv;
  },
  { deep: true }
);

watch(
  showPostDateFormatted,
  (newv) => {
    if (newv == null) {
      interPost.value.interDate = undefined;
    } else {
      interPost.value.interDate = newv;
    }
  },
  { deep: true }
);
watch(
  savedpostid,
  (newv) => {
    interPost.value.savedpostid = newv;
  },
  { deep: true }
);

//Image
const fileUpload = ref() as any;
const coverFile = ref() as any;
const rawImg = ref();
const changedImage = ref(false);
const showCoverPreview = ref();

const onFileClick = (e: any) => {
  e.target.value = null;
};
const onFileSelect = (file: any) => {
  const selectedFile = file.target.files[0];
  const validImageTypes = ["image/jpeg", "image/png"];
  const mimeType = selectedFile?.type;

  if (validImageTypes.includes(mimeType)) {
    changedImage.value = true;
    saveShow.value = true;

    resizeImage({ file: selectedFile, maxSize: 300 })
      .then((resizedBlob) => {
        const reader = new FileReader();
        reader.readAsDataURL(resizedBlob);
        reader.onloadend = () => {
          rawImg.value = reader.result;
          showCoverPreview.value = true;
        };
      })
      .catch((err) => {
        console.error(err);
        showModalImage.value = true;
      });
  } else {
    showModalImage.value = true;
  }
};

const btnClose = (e: any) => {
  fileUpload.value = "";
  showCoverPreview.value = false;
  saveShow.value = true;
  rawImg.value = null;
};

watch(
  rawImg,
  (newv) => {
    if (newv == null) {
      interPost.value["interImage"] = undefined;
    } else {
      interPost.value["interImage"] = newv;
    }
  },
  { deep: true }
);
//Excerpt
const excerpt = ref();

const autoFill = ref();
const autoFillLeaveCheck = ref(false);
const autoFillHover = () => {
  setTimeout(() => {
    if (!autoFillLeaveCheck.value) {
      autoFill.value = true;
    }
  }, 800);
};

const characterCounter = ref("70 characters left");
const characterCounterRef = ref() as any;
const excerptDialogue = ref();

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
//Modal
const showModalImage = ref();

//Save Button
const showSavedButton = ref();

if (props.postOrEvent === "createevent") {
  showSavedButton.value = false;
} else {
  watch(
    interPost,
    (newvalue) => {
      if (
        newvalue.postDate === undefined &&
        newvalue.postContent === undefined &&
        newvalue.postExcerpt === undefined &&
        newvalue.coverImage === undefined &&
        newvalue.postTitle === undefined &&
        newvalue.mainCategory === undefined &&
        newvalue.subCategory === undefined
      ) {
        showSavedButton.value = false;
      } else {
        if (_.isEqual(interPost.value, props.savedPost)) {
          showSavedButton.value = false;
        } else {
          showSavedButton.value = true;
        }
      }
    },
    { deep: true }
  );
}

//Watch post edit

watch(isPostEdit, (newvalue) => {
  watch(
    () => interPost.value,

    (newvalue) => {
      console.log(newvalue);

      if (
        newvalue.postDate === undefined &&
        newvalue.postContent === undefined &&
        newvalue.postExcerpt === undefined &&
        newvalue.coverImage === undefined &&
        newvalue.postTitle === undefined &&
        newvalue.mainCategory === undefined &&
        newvalue.subCategory === undefined
      ) {
        showSavedButton.value = false;
      } else {
        if (props.savedPost != null) {
          if (_.isEqual(interPost.value, props.savedPost)) {
            showSavedButton.value = false;
          } else {
            showSavedButton.value = true;
          }
        } else {
          showSavedButton.value = false;
        }
      }
    },
    { deep: true }
  );
});

//Watch event edit

const eventEditDate = ref(false);
watch(
  isEventEdit,
  (newvalue) => {
    if (newvalue != undefined) {
      interPost.value = {
        interContent: newvalue!.eventText,
        interTitle: newvalue!.eventTitle,
        interDate: newvalue!.eventDate,
        interImage: newvalue!.eventImage,
        interEventCategory: newvalue!.eventCategory,
      };
      eventEditDate.value = true;
      showPostDateFormatted.value = moment(
        new Date(interPost.value["interDate"])
      ).format("MM/DD/YYYY HH:mm");

      rawImg.value = interPost.value.interImage;
      showCoverPreview.value = true;
    }
    watch(
      () => interPost.value,
      (newvalue) => {
        if (_.isEqual(interPost.value, isEventEdit.value)) {
          showSavedButton.value = false;
        } else {
          if (_.isEqual(interPost.value, props.savedPost)) {
            showSavedButton.value = false;
          } else {
            showSavedButton.value = true;
          }
        }
      },
      { deep: true }
    );
  },
  { deep: true }
);

watch(
  showPostDateFormatted,
  (newvalue) => {
    if (isEventEdit.value != undefined && eventEditDate.value) {
      if (newvalue === null) {
        interPost.value["interDate"] = undefined;
      } else {
        interPost.value["interDate"] = newvalue;
      }
    }
  },
  { deep: true }
);

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

const saveingAnim = ref(false);
const savingCompleted = ref(false) as any;

const animationCompleted = (newvalue: any) => {
  console.log(newvalue);
  if (newvalue) {
    setTimeout(() => {
      saveingAnim.value = false;
      savingCompleted.value = false;
    }, 700);
  }
};

const savePost = () => {
  saveingAnim.value = true;

  var originalArray = "" as any;
  const currentDate = new Date();
  const timestamp = currentDate.getTime();

  interPost.value["postAuthorID"] = userData().data._id;
  interPost.value["lastsaved"] = timestamp;

  originalArray = JSON.parse(localStorage.getItem("savedPosts") || "") as any;
  if (interPost.value["savedpostid"] === undefined) {
    //IF POST NOT SAVED YET
    interPost.value["savedpostid"] = timestamp;

    //UPLOAD TO CLOUD
    axios.post("/api/user/refresh").then(() => {
      const originalSavedPosts = ref(userData().data.savedPosts);

      const userID = userData().data._id;

      originalSavedPosts.value.push(interPost.value);
      const sendData = { userID: userID, savedPosts: originalSavedPosts.value };

      axios.post("/api/user/savePost/", sendData).then(() => {
        const userD = userData();
        userD.data.savedPosts = originalSavedPosts.value;
        localStorage.setItem(
          "savedPosts",
          JSON.stringify(originalSavedPosts.value)
        );
        setTimeout(() => {
          savingCompleted.value = true;
        }, 1000);
      });
    });
  } else {
    //IF POST ALREADY EXISTS

    var newPostID = interPost.value["savedpostid"];

    const filteredArray = originalArray.filter(
      (item: any) => item["savedpostid"] !== newPostID
    );
    console.log(originalArray);
    filteredArray.push(interPost.value);
    localStorage.setItem("savedPosts", JSON.stringify(filteredArray));

    const userID = userData().data._id;

    const sendData = { userID: userID, savedPosts: filteredArray };

    //UPLOAD TO CLOUD
    axios.post("/api/user/refresh").then(() => {
      axios.post("/api/user/savePost/", sendData).then((res) => {
        userData().data.savedPosts = filteredArray;
        setTimeout(() => {
          savingCompleted.value = true;
        }, 1000);
      });
    });
  }
};

watch(
  () => excerpt.value,
  (newvalue) => {
    excerptCount(newvalue);
    interPost.value.interExcerpt = newvalue;
  }
);

const previewPost = () => {
  emit("showPreview");
  emit("interPost", interPost.value);
};

const uploadPost = () => {
  console.log(interPost.value);
  if (props.editEvent != undefined) {
    const eventData = {
      event: true,
      eventID: interPost.value["_id"],
      eventTitle: interPost.value["interTitle"],
      eventDate: interPost.value["interDate"],
      eventCategory: interPost.value["interEventCategory"],
      eventImage: interPost.value["interImage"],
      eventContent: interPost.value.postContent,
      postAuthorID: userData().data._id,
    };

    if (
      eventData["eventTitle"] === undefined ||
      eventData["eventDate"] === undefined ||
      eventData["eventCategory"] === undefined ||
      eventData["eventImage"] === undefined
    ) {
      emit("postNotFullfilled", false);
    } else {
      emit("postNotFullfilled", "Updating");

      axios.post("/api/user/refresh").then((res) => {
        if (res.data === "success") {
          axios
            .post("/api/editPost/" + props.editEvent!._id, eventData)
            .then((result) => {
              if (result.status === 200) {
                emit("postNotFullfilled", "updateComplete");
              }
            });
        }
      });
    }

    return;
  }

  if (props.postOrEvent === "createpost") {
    if (interPost.value["interMainCategory"][0] === "Blog") {
      if (
        interPost.value["interTitle"] === undefined ||
        interPost.value["interContent"] === undefined ||
        interPost.value["interExcerpt"] === undefined ||
        interPost.value["interImage"] === undefined ||
        interPost.value["interDate"] === undefined ||
        interPost.value["subCategory"] === undefined ||
        interPost.value["interMainCategory"] === undefined
      ) {
        emit("postNotFullfilled", false);
      } else {
        emit("postNotFullfilled", "uploading");
        axios.post("/api/user/refresh").then((res) => {
          const postData = {
            post: true,
            postID: interPost.value["_id"],
            postTitle: interPost.value["interTitle"],
            postContent: interPost.value["interContent"],
            postDate: interPost.value["interDate"],
            postExcerpt: interPost.value["interExcerpt"],
            postImage: interPost.value["interImage"],
            mainCategory: interPost.value["mainCategory"],
            subCategory: interPost.value["subCategory"],
            postAuthorID: userData().data._id,
          };
          axios.post("/api/uploadPost", postData).then((res) => {
            if (res.status === 200) {
              axios
                .post("/api/content/updateAuthor/" + userData().data._id, {
                  postAuthorID: userData().data._id,
                  postID: interPost.value["_id"],
                })
                .then(() => {
                  axios.post("/api/content/updateSubscribers", {
                    postAuthorID: userData().data._id,
                    postID: interPost.value["_id"],
                  });
                });
              emit("postNotFullfilled", "complete");
            } else {
              console.log(res);
              emit("postNotFullfilled", "exists");
            }
          });
        });
      }
    } else if (interPost.value["interMainCategory"][0] === "News") {
      if (
        interPost.value["interTitle"] === undefined ||
        interPost.value["interContent"] === undefined ||
        interPost.value["interExcerpt"] === undefined ||
        interPost.value["interImage"] === undefined ||
        interPost.value["interDate"] === undefined ||
        interPost.value["interMainCategory"] === undefined
      ) {
        emit("postNotFullfilled", false);
      } else {
        emit("postNotFullfilled", "uploading");
        axios.post("/api/user/refresh").then((res) => {
          const postData = {
            post: true,
            postID: interPost.value["_id"],
            postTitle: interPost.value["interTitle"],
            postContent: interPost.value["interContent"],
            postDate: interPost.value["interDate"],
            postExcerpt: interPost.value["interExcerpt"],
            postImage: interPost.value["interImage"],
            mainCategory: interPost.value["mainCategory"],
            postAuthorID: userData().data._id,
          };
          axios.post("/api/uploadPost", postData).then((res) => {
            if (res.status === 200) {
              axios.post("/api/updateAuthor/" + userData().data._id, {
                postID: interPost.value["_id"],
              });
              emit("postNotFullfilled", "complete");
            } else {
              console.log(res);
              emit("postNotFullfilled", "exists");
            }
          });
        });
      }
    }
  }
  if (props.postOrEvent === "createevent") {
    const eventData = {
      event: true,
      eventTitle: interPost.value["interTitle"],
      eventDate: interPost.value["interDate"],
      eventCategory: interPost.value["interEventCategory"],
      eventImage: interPost.value["interImage"],
      postAuthorID: userData().data._id,
    };
    console.log(eventData);
    if (
      eventData["eventTitle"] === undefined ||
      eventData["eventDate"] === undefined ||
      eventData["eventCategory"] === undefined ||
      eventData["eventImage"] === undefined
    ) {
      console.log(eventData);

      emit("eventNotFullfilled", false);
    } else {
      emit("eventNotFullfilled", "uploading");
      axios.post("/api/user/refresh").then((res) => {
        axios.post("/api/uploadPost", eventData).then((res) => {
          if (res.status === 200) {
            emit("postNotFullfilled", "complete");
          }
        });
      });
    }
  }
};

const tester = () => {



};
</script>

<template>
  <div
    class="post-side-wrapper"
    :class="props.postOrEvent === 'createpost' ? 'post' : 'event'"
  >
    <div class="author">{{ postAuthor }}</div>
    <transition name="autofill">
      <div class="modal-back" v-if="showModalImage"></div>
    </transition>

    <div class="calendar-wrapper wrapper">
      <label>{{
        route.name == "createpost" ? "Post Date" : "Event Date"
      }}</label>
      <Calendar
        id="calendar-24h"
        v-model="showPostDateFormatted"
        showTime
        hourFormat="24"
        showButtonBar
        hideOnDateTimeSelect
      />
    </div>

    <div class="cover-preview-wrapper wrapper" value="Preview Cover" key="1">
      <label>{{
        route.name == "createpost" ? "Cover Image" : "Event Image"
      }}</label>
      <div class="cover-image-wrapper">
        <transition name="autofill">
          <Modal
            v-if="showModalImage"
            class="modal"
            :modalLoadingMessageColor="'red'"
            :modalLoadingMessage="'Select an image file (png or jpeg)'"
            :fontSize="'1rem'"
            :position="'absolute'"
            :backgroundOpacity="1"
            @closeModal="showModalImage = false"
          />
        </transition>
        <TransitionGroup name="autofill">
          <img :src="rawImg" alt="" key="2" v-if="showCoverPreview" />
        </TransitionGroup>
        <div
          v-if="showCoverPreview"
          type="button"
          class="btn-close"
          @click.prevent="btnClose"
        >
          <span class="icon-cross"></span>
          <span class="visually-hidden"></span>
        </div>
      </div>
      <input
        type="button"
        @click="fileUpload.click()"
        class="custom-file-upload"
        value="Select Image"
      />
      <input
        type="file"
        @change="onFileSelect"
        @click="onFileClick"
        name=""
        ref="fileUpload"
        id="file-upload"
        style="display: none"
      />
    </div>

    <div class="excerpt-wrapper wrapper" v-if="route.name === 'createpost'">
      <label>Excerpt</label>
      <textarea
        type="text"
        class="excerpt-textarea"
        v-model="excerpt"
        maxlength="70"
        ref="excerptText"
        @input="handler"
      />
      <div class="excerpt-counter">
        <transition name="autofill">
          <div class="autofill-hover" v-if="autoFill">
            This will make the excerpt filled out with text from the editor to
            the left
          </div>
        </transition>
        <div
          ref="characterCounterRef"
          v-text="characterCounter"
          class="character-counter"
        />
        <input
          type="button"
          value="AutoFill"
          @click="autoFillExcerpt"
          @mouseover="autoFillHover"
          @mouseleave="autoFillLeave"
        />
      </div>
    </div>

    <div class="buttons wrapper">
      <div class="button" @click="tester">test update</div>
      <transition-group name="savedbutton">
        <div class="button" key="1">
          <input
            type="button"
            class="preview"
            :value="
              props.postOrEvent === 'createpost'
                ? 'Preview Post'
                : 'Preview Event'
            "
            @click.prevent="previewPost"
          />
        </div>
        <div class="button" v-if="showSavedButton" key="2">
          <transition name="spinner">
            <div class="spinner-wrapper" v-if="saveingAnim">
              <SpinnerChekMark
                class="spinner"
                :saveingCompleted="savingCompleted"
                @animationCompleted="animationCompleted"
              />
            </div>
          </transition>

          <input
            type="button"
            class="save"
            :value="
              props.postOrEvent === 'createpost' ? 'Save Post' : 'Save Event'
            "
            @click.prevent="savePost"
          />
        </div>
        <div class="button" key="3">
          <input
            type="button"
            class="upload"
            :value="
              props.postOrEvent === 'createpost' ? 'Upload Post' : 'Post Event'
            "
            @click="uploadPost"
          />
        </div>
        <div class="button" key="3" v-if="route.name === 'createpost'">
          <input
            type="button"
            class="saved"
            :value="
              props.postOrEvent === 'createpost'
                ? 'Saved Posts'
                : 'Saved Events'
            "
            @click="emit('showSavedPosts')"
            @closeSavedPosts="emit('closeSavedPosts')"
          />
        </div>
      </transition-group>
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
  z-index: 2;
}
.button {
  position: relative;
  height: 50px;
  width: 50px;
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-nav-bg);
  font-family: Roboto Condensed;
  font-weight: 900;
  border-radius: 5px;
  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.363);
  .spinner-wrapper {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.815);
    width: 100%;
    height: 100%;
    z-index: 10;
    .spinner {
      position: absolute;
      z-index: 10;
      height: 45px;
      width: 45px;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
    }
  }
}
input[type="button"] {
  font-size: 1.5rem;
  height: 100%;
  border: 1px solid transparent;
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
  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.363);
  padding: 5px;
  transition: all 200ms;
}
input[type="button"]:hover {
  background-color: var(--color-nav-bg-darker);
}
input[type="button"].saved:hover {
  background-color: green;
  color: var(--color-nav-bg);
}
.post-side-wrapper {
  height: 100%;
  position: relative;
  border-radius: 5px;
  background-color: var(--color-nav-bg);
  padding: 20px;
  padding-top: 40px;
  flex-direction: column;
  overflow: hidden;
  gap: 20px;
  display: grid;
  &.event {
    display: grid;
    grid-template-rows: 1fr 3fr 1fr;
    gap: 30px;
    height: 100%;
    align-items: flex-start;
    .cover-preview-wrapper {
      display: grid;
      grid-template-rows: 1fr 2fr 1fr;
      grid-template-columns: 1fr;
      height: 260px;
      .cover-image-wrapper {
        position: relative;
        place-self: center;
      }
    }
  }
  .author {
    font-family: Roboto;
    font-weight: 700;
    font-size: 2rem;
    position: absolute;
    right: 0;
    top: 0;
    padding: 2px;
    color: var(--color-nav-bg);
    border-radius: 0% 10%;
    background-color: var(--color-nav-txt-darker);
  }
  label {
    font-family: Chango;
    font-size: 1.3rem;
    width: 100%;
  }
  .wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    gap: 5px;
    font-family: Roboto Condensed;
    font-weight: 700;
  }
  .cover-preview-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    .btn-close {
      position: absolute;
      background: var(--color-nav-bg);
      width: 30px;
      height: 30px;
      top: 80px;
      right: 40px;
      border-radius: 50%;
      box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.432);
      cursor: pointer;
      transition: all 50ms;
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
      border: solid 2px var(--color-nav-txt);
      border-radius: 20px;
      overflow: hidden;
      max-width: 90%;
      height: 200px;
      max-height: 200px;
      img {
        width: 120%;
        height: 120%;
      }
    }
  }
  .excerpt-wrapper {
    display: flex;
    gap: 10px;
    textarea {
      height: 100%;
      width: 100%;
      font-family: Roboto Condensed;
      font-size: 2rem;
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
    textarea > div > div:last-child {
      scroll-snap-align: end;
    }
    .excerpt-counter {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
      padding: 0 10px;
      font-size: 1.2rem;
      .autofill-hover {
        font-size: 1rem;
        position: absolute;
        z-index: 99;
        height: 100px;
        width: 200px;
        background-color: white;
        padding: 10px;
        right: 150px;
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
    .button {
      width: 100%;

      input {
        width: 100%;
        &:focus-visible {
          outline: 10px solid var(--color-nav-txt);
        }
      }
      input:active {
        box-shadow: inset 1px 2px 2px 2px rgba(0, 0, 0, 0.322);
      }
      .save {
        background-color: rgb(110, 0, 0);
        color: var(--color-nav-bg);
        top: 0;
        left: 0;
        position: relative;
        align-self: center;
      }
      .save:hover {
        background-color: rgb(139, 1, 1);
      }
      .save:focus-visible {
        background-color: rgb(0, 116, 48);
      }
      .upload:hover {
        background-color: var(--color-nav-txt-darker);
        color: var(--color-nav-bg);
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
.spinner-enter-active,
.spinner-leave-active {
  opacity: 1;
  transition: all 0.3s;
}
.spinner-enter-from,
.spinner-leave-to {
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
  transition: all 0.5s cubic-bezier(0.15, 0.66, 0.32, 1.25);
}
.savedbutton-enter-from,
.savedbutton-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
.savedbutton-leave-active {
  position: absolute;
}
@media (max-height: 794px) {
  .post-side-wrapper {
    display: grid;
    .cover-preview-wrapper {
      height: 150px;
      .cover-image-wrapper {
        width: 40%;
      }
    }
    .calendar-wrapper {
      flex-direction: column;
      margin-bottom: 0;
    }
    .cover-preview-wrapper {
      .cover-image-wrapper {
        width: 70%;
      }
    }
    .excerpt-wrapper {
      position: relative;
      width: 100%;
      display: flex;
      margin-bottom: 0;
      .excerpt-textarea {
        font-size: 0.5rem;
        height: 70px;
        input {
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
.post-side-wrapper {
  display: grid;
  gap: 5px;
  .cover-preview-wrapper {
    .cover-image-wrapper {
      height: 100px;
    }
  }
  &.event {
    .cover-preview-wrapper {
      .cover-image-wrapper {
        height: 100%;
      }
    }
  }
  .calendar-wrapper {
    flex-direction: column;
    width: 300px;
    margin-bottom: 0;
  }
  .cover-preview-wrapper {
    .cover-image-wrapper {
      width: 70%;
    }
  }
  .excerpt-wrapper {
    position: relative;
    width: 100%;
    display: flex;
    margin-bottom: 0;
    .excerpt-counter {
      input {
        font-size: 1rem;
      }
    }
    .excerpt-textarea {
      font-size: 1rem;
      height: 70px;
      input {
        font-size: 9rem;
      }
    }
  }
  .buttons {
    .button {
      height: 50px;
      input {
        font-size: 1.2rem;
      }
    }
  }
}

@media (max-width: 1980px) {
  .post-side-wrapper .excerpt-wrapper .excerpt-counter .autofill-hover {
    left: 10px;
    font-size: 1rem;
  }
}
@media (min-width: 600px) and (max-width: 1356px) {
  .post-side-wrapper {
    display: fle;
    width: 100%;
    label {
      font-size: 2rem;
      left: 0;
      right: 0;
    }
  }
}
</style>
