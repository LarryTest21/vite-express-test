<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import axios from "axios";
import { userData } from "../store/userData";
import YesIcon from "../components/icons/yes.vue";

const props = defineProps({
  postAuthorWidth: Number,
  postAuthorData: Object,
});

const formattedLength = ref();
watch(
  () => props.postAuthorWidth,
  (newv) => {
    formattedLength.value = newv! + 5 + "px";
  }
);

watch(
  () => userData().data,
  (newv) => {
    const hasMatch = newv.subscribes.some(
      (obj: any) => obj["subscribeTo"] === props.postAuthorData!._id
    );
    if (hasMatch) {
      alreadySubscribed.value = true;
    }
  },
  { deep: true }
);

const alreadySubscribed = ref(false);

const subscriber = userData().data;

const subscribe = (authorID: any) => {
  const data = {
    subscribeTo: authorID,
    subscriber: subscriber._id,
  };
  const subscribes = ref(userData().data.subscribes);

  if (alreadySubscribed.value) {
    axios.post("/api/user/refresh").then((res) => {
      axios.post("/api/unsubscribe", data).then((result) => {
        const newSubscribes = userData().data.subscribes.filter(
          (obj: any) => obj.subscribeTo !== authorID
        );
        userData().data.subscribes = newSubscribes;
        alreadySubscribed.value = false;
      });
    });
  } else {
    axios.post("/api/user/refresh").then((res) => {
      axios.post("/api/subscribe", data).then((result) => {
        subscribes.value.push(data);
        alreadySubscribed.value = true;
        console.log(result);
      });
    });
  }
};
onMounted(() => {
  const hasMatch = subscriber.subscribes.some(
    (obj: any) => obj["subscribeTo"] === props.postAuthorData!._id
  );

  if (hasMatch) {
    alreadySubscribed.value = true;
  }
});
</script>

<template>
  <div class="post-author-panel-wr">
    <img :src="props.postAuthorData!.profilePic" class="profilepic" />
    <div class="name-subscribe">
      <div class="author-name">
        {{
          props.postAuthorData!.firstName + " " + props.postAuthorData!.lastName
        }}
      </div>
      <div
        :class="alreadySubscribed ? 'subscribe' : 'subscribe not'"
        @click="subscribe(props.postAuthorData!._id)"
      >
        <TransitionGroup name="slide" mode="out-in">
          <span :key="alreadySubscribed ? 'yes' : 'no'" class="text-slide">
            {{ alreadySubscribed ? "Subscribed" : "Subscribe" }}
          </span>
          <YesIcon />
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.post-author-panel-wr {
  position: absolute;
  background-color: #f0f0f0;
  border-radius: 10px;
  border: 1px solid transparent;
  left: v-bind(formattedLength);
  top: 0;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px;
  box-shadow: 4px 4px 5px 0px rgba(0, 0, 0, 0.3);
  .profilepic {
    position: relative;
    width: 100px;
  }
  .name-subscribe {
    color: var(--color-nav-txt);
    .subscribe {
      font-size: 1.5rem;
      border: 1px solid transparent;
      width: 130px;
      background-color: var(--color-nav-txt);
      font-family: Roboto Condensed;
      font-weight: 900;
      border-radius: 5px;
      box-sizing: border-box;
      cursor: pointer;
      color: var(--color-nav-bg);
      box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.363);
      padding: 5px;
      transition: all 200ms;
      overflow: hidden;
      height: 40px;
      text-align: center;

      &:hover {
        cursor: pointer;
        background-color: rgb(128, 9, 0);
        color: var(--color-nav-bg);
      }
      &.not {
        color: var(--color-nav-txt);
        background-color: var(--color-nav-bg);
      }
      &.not:hover {
        background-color: green;
        color: var(--color-nav-bg);
      }
    }
    .author-name {
      position: relative;
      font-family: Roboto Condensed;
      font-size: 1.5rem;
    }
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
  display: inline-block;
  overflow: hidden;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
