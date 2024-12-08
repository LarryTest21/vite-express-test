<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { onClickOutside } from '@vueuse/core';
import moment from "moment";
import axios from "axios";
import { userData } from "../../store/userData";

const savedPosts = ref((JSON.parse(localStorage.getItem("savedPosts") as any).sort(function (a:any, b:any) {
    return a.savedpostid < b.savedpostid ? 1 : -1;
})));




const emit = defineEmits(["closeSavedPosts", "loadSaved"]);

const wrapper = ref();

const loadPost = (saveTime: any) => {
  const saveToLoad = savedPosts.value.find(
    (item: any) => item.savedpostid === saveTime
  );

  emit("loadSaved", saveToLoad);
  emit("closeSavedPosts");
};

onClickOutside(wrapper, close);
function close() {
  emit('closeSavedPosts');
}

const deleteSavedPost = (savedPostId: any) => {
  const deletedSavedPosts = savedPosts.value.filter(
    (deletePost: any) => deletePost.savedpostid !== savedPostId
  );
  savedPosts.value = deletedSavedPosts;

  localStorage.setItem("savedPosts", JSON.stringify(savedPosts.value));

  const userID = userData().data._id;

  const sendData = { userID: userID, savedPostID: savedPostId };

  axios.post("/api/user/refresh").then(() => {
    axios.post("/api/user/deleteSavedPost/", sendData).then((res) => {
userData().data.savedPosts = savedPosts.value
    });
  });
};
</script>

<template>
  <div class="outer-wrapper">
    <div class="bg"></div>

    <div ref="wrapper" class="saved-wrapper">
      <div class="labels">
        <div class="time">Saved Time</div>
        <div class="title">Post Title</div>
        <div class="title">Post Date</div>
        <div class="title">Post ID</div>
      </div>

      <div class="savedposts" v-if="savedPosts != null || undefined" v-for="savedpost in savedPosts" :key="savedpost.saveTime"
      >
        <div class="savedposts-outer">
          <div class="savetime">
            {{ moment(new Date(savedpost.lastsaved)).format("MMM DD, HH:mm") }}
          </div>
          <div class="title" :class="savedpost.postTitle == undefined ? 'missing' : ''"
          >
            {{ savedpost.postTitle || 'No Title' }}
          </div>
          <div class="postdate" :class="savedpost.postDate == undefined ? 'missing' : ''"
          >
            {{
              savedpost.postDate != undefined
                ? moment(new Date(savedpost.postDate)).format("MMM DD, HH:mm")
                : 'No Date'
            }}
          </div>
          <div class="postid">
            {{ savedpost.savedpostid }}
          </div>
          <div class="transparentclick" @click="loadPost(savedpost.savedpostid)"
          />

          <div class="delete" >
            <div class="confirmdelete"></div>
            <div class="trash-box" @click="deleteSavedPost(savedpost.savedpostid)">
              <div class="trash" ></div>
              <div class="trash-top"></div>
              <div class="trash-btm">
                <div class="trash-lines">
                  <div class="trash-line"></div>
                  <div class="trash-line"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="close-button1" @click="close">Close</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.outer-wrapper {
  z-index: 100;
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;

  .bg {
    background-color: black;
    opacity: 0.5;
    width: 100%;
    height: 100%;
  }
}
.saved-wrapper {
  margin-top: 10px;
  position: absolute;
  background-color: var(--color-nav-bg);
  width: 50%;
  border-radius: 10px;
  .labels {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    padding-inline-start: 0;
    padding-left: 5px;
    list-style: none;
    font-size: 1.5rem;
    font-family: Roboto Condensed;
    font-weight: 600;
    margin: 5px;
    padding: 5px 0 0 5px;
  }
  .savedposts {
    background-color: var(--color-nav-txt-darker);
    color: var(--color-nav-bg);
    margin: 5px;
    font-size: 1.5rem;
    font-family: Roboto Condensed;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 5px;
    .missing {
      color: rgb(255, 74, 74);
    }
    .savedposts-outer {
      position: relative;
      height: 100%;
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      padding-inline-start: 0;
      padding-left: 5px;
      list-style: none;
      padding: 5px;
    }

    &:hover {
      background-color: var(--color-nav-txt);
    }
  }

  .close-button1 {
    font-size: 2rem;
    display: flex;
    justify-content: center;

    margin: 10px;
    background-color: var(--color-nav-bg);
    font-family: Roboto Condensed;
    font-weight: 900;
    border-radius: 5px;
    cursor: pointer;
    color: var(--color-nav-txt);
    border: 1px solid transparent;
    box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.363);
    padding: 5px;
    transition: all 0.1s;

    &:hover {
      background-color: var(--color-nav-bg-darker);
    }
  }
  .transparentclick {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
  .delete {
    position: relative;
    right: 5px;
    z-index: 10;
    .modal {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .trash-box {
      position: absolute;
      right: 5px;
      top: 0;
      width: 25px;
      height: 25px;

      //Hover
      &:hover .trash-top {
        //open the lid
        transform: translate(-50%, -15%) rotate(-20deg);
      }

      &:hover .trash-btm {
        //rotate the bottom a little
        transform: translate(-50%, -100%) rotate(5deg);
      }

      &:hover .trash {
        top: 50%;
        transform: translate(-42%, -50%) rotate(35deg); //comes from bottom
      }
      $trashColor1: var(--color-nav-bg);
      $trashColor2: var(--color-nav-bg);
      $trashColor3: var(--color-nav-bg);
      $transition: all 0.2s ease-in-out;

      //trash-lid
      .trash-top {
        position: absolute;
        top: 15%;
        left: 50%;
        transform: translate(-50%, -15%);
        width: 80%;
        height: 15%;
        background: $trashColor1;
        border-radius: 5px;
        transform-origin: left bottom;
        transition: $transition;

        //the top of lid
        &::before {
          content: "";
          position: absolute;
          bottom: 95%;
          left: 50%;
          transform: translate(-50%);
          width: 30%;
          height: 80%;
          background: inherit;
          border-radius: 5px 5px 0 0;
        }
      }

      //trash-can-bottom
      .trash-btm {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translate(-50%, -100%);
        width: 70%;
        height: 65%;
        background: $trashColor1;
        border-radius: 5px;
        transform-origin: left 70%; //transform left-side and 70% from top
        transition: $transition;

        //lines in the middle
        .trash-lines {
          //centering
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          //
          width: 60%;
          height: 80%;
          display: flex;
          justify-content: space-around; //or space-between

          .trash-line {
            width: 20%;
            height: 100%;
            background: var(--color-nav-txt);
            border-radius: 3px;
          }
        }
      }
      //trash in(behind) the can

      .trash {
        position: absolute;
        top: 80%;
        left: 38%;
        transform: translate(-38%, -80%) rotate(35deg);
        width: 40%;
        height: 40%;
        background: $trashColor3;
        border-radius: 2px;
        transition: $transition;

        //second trash
        &::before {
          content: "";
          position: absolute;
          transform: translate(30%, -20%) rotate(25deg);
          width: 100%;
          height: 100%;
          background: black;
          border-radius: 2px;
        }
      }
    }
  }
}
</style>
