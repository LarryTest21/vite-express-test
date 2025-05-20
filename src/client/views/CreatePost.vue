<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import $ from "jquery";
import DownIcon from "../components/icons/down.vue";
import { QuillEditor } from "@vueup/vue-quill";
import "firebase/auth";
import Side from "../components/createpost/CreatePostSide.vue";
import Preview from "../components/createpost/CreatePostPreview.vue";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import db from "../firebase/firebaseInit";
import Dialogue from "../components/createpost/SavedPostDialogue.vue";
import { useRoute } from "vue-router";
import Multiselect from "vue-multiselect";
import "../assets/vueup.scss";
import "../assets/multiselect.scss";






const postContent = ref();

const postTitle = ref();

const savedDialogue = ref(false);

const postID = ref();
const postUploadTime = ref();

const downIcon = ref() as any;
const multiSelectSelected = ref([]);
const multiSelectOptions = ["Blog", "Tournament", "Cup", "General"];
const singleSelected = ref();
const singleSelectOptions = ["Blog", "News"];
const blogSelected = ref(false);

watch(singleSelected, (newValue) => {
  if (newValue == "Blog") {
    blogSelected.value = true;
  } else {
    blogSelected.value = false;
    multiSelectSelected.value = [];
  }
});

const side = ref();
const showPreview = ref(false);
const quillEditor = ref() as any;
const showDownIcon = ref() as any;

const doOnce = ref(false);

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  [{ align: [] }],
  ["blockquote", "code-block"],
  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, false] }],
  ["link", "image", "video"], // add's image support

  ["clean"],
];

const firebaseAuth = ref();
const dataBaseUser = ref();
const savedPost = ref();

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    firebaseAuth.value = firebase.auth().currentUser;
    dataBaseUser.value = db.collection("users").doc(firebaseAuth.value?.uid);

    dataBaseUser.value
      .get()
      .then((doc: any) => {
        userData.value = doc.data();
      })

      .then(() => {
        postAuthor.value =
          userData.value.firstName + " " + userData.value.lastName;
      });

    if (user) {
      if (route.params.createSlug == "newPost") {
        const dataBase = db
          .collection("users")
          .doc(firebase.auth().currentUser?.uid);
        dataBase
          .get()
          .then((doc) => {
            userData.value = doc.data();
          })

          .then(() => {
            savedPost.value = userData.value.savedPost;
            if (savedPost.value !== undefined) {
              if (Object.keys(savedPost.value).length !== 0) {
                savedDialogue.value = true;
              } else if (Object.keys(savedPost.value).length === 0) {
              }
            }
          });
      }
    }
  }
});
const quillBottom = () => {
  $('.ql-editor').scrollTop($('.ql-editor')[0].scrollHeight);
};

const userData = ref();
const postAuthor = ref();
const checkSavedPost = ref(false);

const onShowPostPreview = () => {
  showPreview.value = false;
};
const onShowPostPreviewTrue = () => {
  showPreview.value = true;
};
const postDate = ref();
const postDateFn = function (params: any) {
  postDate.value = params;
};
const postContentFn = function (params: any) {
  postContent.value = params;
};
const postTitleFn = function (params: any) {
  postTitle.value = params;
};

const dialogueYes = () => {
  checkSavedPost.value = true;
  savedDialogue.value = false;
};

const dialogueNo = () => {
  savedDialogue.value = false;
};
const dialogueDelete = async () => {
  savedDialogue.value = false;

  await dataBaseUser.value
    .update({
      savedPost: {},
    })
    .catch((error: any) => {
      error.value = true;
    });
};

const scrollToBottom = () => {
  $(".ql-editor").scrollTop($(".ql-editor")[0].scrollHeight);
};
//GETTING AUTHOR NAME
const postExcerpt = ref();
const blogPostData = ref() as any;
const route = useRoute();
const rawImg = ref(null) as any;

const savedPostData = ref();
const savedPostDate = ref()


onMounted(() => {
  quillEditor.value = document.querySelector(".ql-editor");
  window.addEventListener("keydown", (e) => {
    document.querySelector("blockquote")?.classList.add("blockquote");
    if (quillEditor.value.scrollHeight > quillEditor.value.clientHeight) {
      showDownIcon.value = true;

      if (showDownIcon.value && doOnce.value) {
        doOnce.value = false;
      }
    }
  });

  $(".ql-editor").scroll(function () {
    var el = document.querySelector(".ql-editor");
    if (Math.abs(el!.scrollHeight - el!.scrollTop - el!.clientHeight) < 5) {
      doOnce.value = false;
    } else {
      doOnce.value = true;
    }
  });

  $(".ql-editor").change(function () {
    scrollToBottom();
  });

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      if (route.params.createSlug !== "newPost") {
        const dataBase = db
          .collection("blogposts")
          .doc(route.params.createSlug.toString());
        dataBase
          .get()
          .then((doc) => {
            savedPostData.value = doc.data();
          })
          .then(() => {
            if (blogPostData.value !== undefined) {
              savedPostDate.value = blogPostData.value.postDate;
              postAuthor.value = blogPostData.value.postAuthor;
              postContent.value = blogPostData.value.postContent;
              postTitle.value = blogPostData.value.postTitle;
              rawImg.value = blogPostData.value.coverImage;
              postExcerpt.value = blogPostData.value.postExcerpt;
              postUploadTime.value = blogPostData.value.postUpload;
              postID.value = blogPostData.value.postID;
              singleSelected.value = blogPostData.value.postSection;
              multiSelectSelected.value = blogPostData.value.postCategory;
            }
          });
      }
    }
  });
});
</script>

<template>
  <div class="createpost-wrapper">
    <transition name="savedDialogue">
      <Dialogue v-if="savedDialogue" @button-yes="dialogueYes" @button-no="dialogueNo" @button-delete="dialogueDelete" />
    </transition>
    <transition name="preview">
      <Preview v-if="showPreview" @showPreview="onShowPostPreview" :postTitle="postTitle" :postContent="postContent"
        :postDate="postDate" :postUpload="postUploadTime" :postAuthor="postAuthor" />
    </transition>

    <div class="container">
      <div class="post-editor" id="editor">
        <div class="editor-top-wrapper">
          <div class="blog-title-wrapper">
            <label class="blog-title">Title</label>
            <input type="text" v-model="postTitle" />
          </div>
          <div class="selection-wrapper">
            <div class="blog-section-wrapper">
              <label class="blog-category">Section</label>
              <Multiselect class="multiselect" v-model="singleSelected" :options="singleSelectOptions" :searchable="false"
                placeholder="Select section">
              </Multiselect>
            </div>
            <div class="blog-category-wrapper" v-show="blogSelected">
              <label class="blog-category">Category</label>

              <Multiselect class="multiselect" v-model="multiSelectSelected" :options="multiSelectOptions"
                :multiple="true" :searchable="false" placeholder="Select category">
              </Multiselect>
            </div>
          </div>
        </div>
        <div class="editor-wrapper">
          <div class="editor">
            <transition name="downIcon">
              <DownIcon class="downIcon" ref="downIcon" v-show="doOnce" />
            </transition>
            <QuillEditor v-model:content="postContent" contentType="html" :toolbar="toolbarOptions"
              @text-change="quillBottom" />
          </div>
        </div>
      </div>
      <Side ref="side" :postTitle="postTitle" :postContent="postContent" :postAuthor="postAuthor"
        :postDate="savedPostDate" :checkSavedPost="checkSavedPost" :rawImg="rawImg" :postExcerpt="postExcerpt"
        :postID="postID" :postSection="singleSelected" :postCategory="multiSelectSelected"
        @showPreview="onShowPostPreviewTrue" @postDate="postDateFn" @post-content="postContentFn"
        @post-title="postTitleFn" />
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

.createpost-wrapper {
  position: relative;
  min-height: 100vh;

  .container {
    height: calc(100vh - 70px);
    padding: 20px;
    top: 70px;
    position: relative;
    display: flex;
    justify-content: center;
    gap: 10px;
    overflow: visible;

    .post-editor {
      position: relative;
      overflow: visible;
      height: 100%;
      width: 1024px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      label {
        width: 120px;
        font-family: Chango;
        padding: 7px;
        background-color: #d1d5db;
        color: var(--color-nav-txt);
        display: block;
        border-bottom: solid 2px rgba(0, 0, 0, 0.2);
        border-radius: 10px 10px 0 0;
      }

      .editor-top-wrapper {
        display: flex;
        justify-content: space-between;
        gap: 20px;

        .blog-title-wrapper {
          width: 50%;
          height: 90px;
          display: flex;
          flex-direction: column;
          border-radius: 10px;
          overflow: hidden;

          input {
            width: 100%;
            height: 100%;
            padding: 10px;
            outline: none;
            font-weight: 500;
            font-family: Roboto;
            font-size: 1rem;
            color: var(--color-nav-txt);
            background-color: var(--color-nav-bg);
            border-style: none;
            border-radius: 0 10px;
          }

          input:focus {
            color: var(--color-nav-txt);
          }
        }

        .selection-wrapper {
          width: 50%;
          height: 100px;
          display: flex;
          flex-direction: row;
          border-radius: 10px;
          gap: 20px;

          .multiselect {
            cursor: pointer;

            height: 55px;
            width: 100%;
            color: rgba(0, 0, 0, 0.5);
          }

          .blog-section-wrapper {
            display: flex;
            flex-direction: column;
            width: 50%;
          }

          .blog-category-wrapper {
            width: 100%;
          }
        }
      }

      .editor-wrapper {
        overflow-y: auto;
        height: 100%;
        width: 100%;

        .editor {
          position: relative;
          display: flex;
          justify-content: center;
          flex-direction: column;
          gap: 10px;
          height: 100%;
          left: 0;
          right: 0;

          .downIcon {
            width: 70px;
            height: 70px;
            fill: var(--color-nav-txt);
            position: absolute;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            z-index: 2;
            transform: rotate(90deg);
            right: 0;
            left: 0;
            bottom: 30px;
            margin: auto;
          }
        }
      }
    }
  }
}

.downIcon-enter-active,
.downIcon-leave-active {
  transition: all 0.2s ease-out;
  max-height: 100%;
  opacity: 1;
}

.downIcon-enter-from,
.downIcon-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-out;
  opacity: 1;
}

.fade-enter-from,
.fade-leave-to {
  transition: all 0.4s ease-out;
  opacity: 0;
  max-height: 0%;
}

.preview-enter-active,
.preview-leave-active {
  transition: all 0.2s ease-out;
  opacity: 1;
  max-height: 100%;
}

.preview-enter-from,
.preview-leave-to {
  transition: all 0.4s ease-out;
  opacity: 0;
  max-height: 0;
}

.savedDialogue-enter-active,
.savedDialogue-leave-active {
  max-height: 160px;
  transition: all 0.8s ease-in-out;
}

.savedDialogue-enter-from,
.savedDialogue-leave-to {
  overflow: hidden;
  max-height: 0px;
}
</style>
