<script setup lang="ts">
import { ref } from 'vue';
import axios from "axios";
import { onMounted } from "vue";
import { userData } from "../../store/userData";
import readDotFunction from "./readDotFunction";

const allFriends = ref<
  { _id: string; firstName: string; profilePic: string }[]
>([]);
const latestMessages = ref({}) as any;

const fetchFriendsAndMessages = async () => {
  try {
    // Refresh user session
    const refreshResult = await axios.post("/api/user/refresh");
    if (refreshResult.data !== "success") return;

    // Get all users
    const friendsResponse = await axios.get("/api/user/getAllUsers");

    // Filter only accepted friends
    allFriends.value = friendsResponse.data.filter(
      (friend: any) =>
        friend.friendsActions?.acceptedUsers?.includes(userData().data._id)
    );

    // Fetch latest messages for each friend
    await Promise.all(
      allFriends.value.map(async (friend) => {
        if (!friend._id) return;
        const latestMessage = await getLastMessage(friend._id);
        if (latestMessage)
          latestMessages.value[friend._id] = latestMessage as unknown as {
            message: string;
            date: string;
            senderID: string;
            read: string;
          };
      })
    );
  } catch (error) {
    console.error("Error fetching friends or messages:", error);
  }
};

const getLastMessage = async (friendId: string): Promise<string> => {
  try {
    const getData = { senderID: userData().data._id, getFrom: friendId };
    const res = await axios.post("/api/user/getPrivateMessage", getData);

    console.log(res.data);
    if (res.data === null || res.data.messages.length === 0)
      return "No messages";
    // Get the latest message based on date
    const latest = res.data.messages.reduce((a: any, b: any) =>
      new Date(a.date) > new Date(b.date) ? a : b
    );
    console.log(latest);
    return latest;
  } catch (error) {
    console.error("Error fetching latest message:", error);
    return "Error loading message";
  }
};

// Fetch all friends and their latest messages when component mounts
onMounted(fetchFriendsAndMessages);
</script>

<template>
  <div class="wrapper">
    <div class="previous-chats">previous-chats</div>

    <div class="friendslist" v-for="(friend) in allFriends">
      <div class="friend-wrapper">
        <img :src="friend.profilePic" alt="" />
        <div class="friend-name">{{ friend.firstName }}</div>
      </div>
      <div class="last-message" v-if="latestMessages[friend._id] !== 'No messages'"
      >
        {{ latestMessages[friend._id]?.message }}

        <div class="read-not" v-if="latestMessages[friend._id]?.read === false"
        />
        <div class="profile-pic-read" v-if="latestMessages[friend._id]?.read === true"
        >
          <img :src="friend.profilePic" />
        </div>
      </div>
      <div class="last-message" v-if="latestMessages[friend._id] === 'No messages'"
      >
        No messages yet, write something!
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
  width: 100%;
  .previous-chats {
    padding: 2px;
    font-size: 1rem;
    margin-bottom: 10px;
    width: 100%;
    text-align: left;
    border-radius: 0 0 20px;
    box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.349);
  }
  .friendslist {
    position: relative;
    height: 70px;
    display: flex;
    transition: all 0.2s;
    .friend-wrapper {
      display: flex;
      align-items: center;
      margin: 5px;
      gap: 10px;
      width: 120px;
      .friend-name {
        font-size: 1rem;
        width: 40px;
      }
      img {
        margin-top: 5px;
        width: 50px;
      }
      &::after {
        content: "";
        position: relative;
        width: 10px;
        height: 100%;
        background-color: var(--color-nav-txt);
        border-radius: 10px;
        transition: all 0.2s;
      }
    }
    .last-message {
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;
      font-size: 0.8rem;
      text-align: left;
      margin: 5px;
      .read-not {
        position: absolute;
        right: 10px;

        height: 20px;
        width: 20px;
        background-color: #bbb;
        border-radius: 50%;
      }
      .profile-pic-read {
        position: absolute;
        right: 10px;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
        img {
          right: 10px;
          width: 20px;
        }
      }
    }
    .who-wrote {
      position: absolute;
      right: 10px;
    }
    &:hover {
      background-color: var(--color-nav-txt);
      color: var(--color-nav-bg);
      cursor: pointer;
      ::after {
        background-color: var(--color-nav-bg);
      }
    }
  }
}
</style>
