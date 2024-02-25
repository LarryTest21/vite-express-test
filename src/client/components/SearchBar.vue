<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import moment from "moment";

const searchValue = ref();
const searchInput = ref();

const props = defineProps({
  storedPosts: Array,
});
const searchArray = ref(props.storedPosts!);

const showResults = ref(false);
const results = ref([]) as any;
const resulstCheck = ref(false);

const resultsTitle = ref();
const resultsContent = ref();
const resultsAuthor = ref();

const emit = defineEmits(["inputFocused"]);

const inputFocusedRef = ref(false);

const inputFocused = () => {
  inputFocusedRef.value = true;
  emit("inputFocused", inputFocusedRef);
  showResults.value = true;
};
const inputNotFocused = () => {
  inputFocusedRef.value = false;
  emit("inputFocused", inputFocusedRef);
  showResults.value = false;
};

watch(searchValue, (newValue) => {
  console.log(results.value)
  results.value.forEach((post: any) => {
    delete post.whereFound1;
    delete post.whereFound2;
    delete post.whereFound3;
  });
  if (results.value === "" || results.value === undefined) {
  } else {
  }

  if (newValue != "" || newValue != undefined) {
    results.value = [];
    resulstCheck.value = false;

    if (searchValue.value !== "") {
      resulstCheck.value = true;

      resultsTitle.value = searchArray.value.filter(
        (item: any) =>
          item.postTitle
            .toLowerCase()
            .indexOf(searchValue.value.toLowerCase()) !== -1
      );
      resultsContent.value = searchArray.value.filter(
        (item: any) =>
          item.postContent
            .toLowerCase()
            .indexOf(searchValue.value.toLowerCase()) !== -1
      );
      resultsAuthor.value = searchArray.value.filter(
        (item: any) =>
          item.postAuthor
            .toLowerCase()
            .indexOf(searchValue.value.toLowerCase()) !== -1
      );

      resultsTitle.value.forEach((post: any) => {
        const whereFound = { whereFound1: "Title" };
        Object.assign(post, whereFound);

        const Title = post;
        results.value.push(Title);
      });
      resultsContent.value.forEach((post: any) => {
        const whereFound = { whereFound2: "Content" };
        Object.assign(post, whereFound);
        const content = post;
        results.value.push(content);
      });
      resultsAuthor.value.forEach((post: any) => {
        const whereFound = { whereFound3: "Author" };
        Object.assign(post, whereFound);
        const Author = post;
        results.value.push(Author);
      });
    }
  }
});
onMounted(() => {
  setTimeout(() => {
    searchInput.value.focus();
  }, 100);
});
</script>

<template>
  <div class="search-bar-wrapper">
    <div class="input">
      <div class="search-results-outer-wrapper">
        <input ref="searchInput" type="text" class="search-input" v-model="searchValue" @focus="inputFocused"
               @blur="inputNotFocused"
        />
        <div class="results-tab-wrapper">
          <Transition name="resultsTab">
            <div class="results-tab" v-if="resulstCheck">
              <TransitionGroup name="results">
                <div class="results" v-for="result in results" :key="1">
                  <router-link :to="/blog/ + result._id" key="result.id" class="posts-permalink"
                  >
                  </router-link>

                  <div class="title">{{ result.postTitle }}</div>
                  <div class="where-found-wrapper">
                    <div class="label">Found in</div>
                    <div class="search-place" v-if="result.whereFound1 !== undefined"
                    >
                      "{{ result.whereFound1 }}"
                    </div>
                    <div class="search-place" v-if="result.whereFound2 !== undefined"
                    >
                      "{{ result.whereFound2 }}"
                    </div>
                    <div class="search-place" v-if="result.whereFound3 !== undefined"
                    >
                      "{{ result.whereFound3 }}"
                    </div>
                  </div>
                  <div class="post-date">
                    {{
                      moment(new Date(result.postDate)).format("MMM DD, HH:mm")
                    }}
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-bar-wrapper::before {
  content: "";
  position: absolute;
  background-color: rgba(0, 0, 0, 0.644);
  height: 100%;
  width: 100%;
  z-index: -1;
}

.search-bar-wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 12;
  display: flex;
  justify-content: center;
  align-items: center;

  .search-label {
    position: relative;
    font-family: Chango;
    font-size: 3rem;
    margin-bottom: 20px;
  }

  .input {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .search-results-outer-wrapper {
      margin-top: 100px;
      width: 900px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .search-input[type="text"] {
      display: inline-block;
      font-size: 1.5rem;
      width: 50%;
      padding: 10px;
      border-radius: 10px;
      background-color: var(--color-nav-bg);
      color: var(--color-nav-txt);
      border-style: none;
      transition: all 0.2s ease-in-out;

      &:focus-visible {
        outline: none;
        width: 100%;
      }
    }
  }

  .results-tab-wrapper {
    width: 100%;
    position: relative;
    height: 300px;
    transition: all 0.2s ease-in-out;

    .results-tab {
      font-family: Roboto Condensed;
      left: 0;
      margin: auto;
      margin-top: 10px;
      color: var(--color-nav-txt);
      display: flex;
      flex-direction: column;
      gap: 5px;
      max-height: 300px;

      &::-webkit-scrollbar {
        width: 12px;
      }

      /* Track */
      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 5px;
      }

      /* Handle */
      &::-webkit-scrollbar-thumb {
        background: var(--color-nav-txt);
        border-radius: 5px;
      }

      /* Handle on hover */
      &::-webkit-scrollbar-thumb:hover {
        background: rgba(1, 53, 95, 0.253);
      }

      .results {
        border-radius: 10px;
        background-color: var(--color-nav-bg);
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;

        .posts-permalink {
          position: absolute;
          height: 100%;
          width: 100%;
          z-index: 10;
          transition: all 0.1s ease-in-out;

          &:hover {
            background-color: rgba(1, 53, 95, 0.253);
          }
        }

        .title {
          position: relative;
          width: 400px;
          padding: 12px;
          font-size: 1.4rem;
          font-weight: 500;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          font-weight: 700;
        }

        .title::after {
          content: "";
          position: absolute;
          height: 70%;
          top: 50%;
          margin: auto;
          transform: translateY(-50%);
          right: 0;
          width: 2px;
          border-radius: 5px;
          background-color: var(--color-nav-txt);
          z-index: 0;
        }

        .where-found-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;

          div {
            margin-right: 7px;
          }

          .search-place {
            font-style: italic;
            font-weight: 700;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }

        .post-date {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px;
          font-size: 1rem;
          font-weight: 500;
        }
      }
    }
  }
}

.resultsTab-enter-active,
.resultsTab-leave-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.1s ease-in-out;
}

.resultsTab-enter-from,
.resultsTab-leave-to {
  opacity: 0;
  transform: translateY(200px);
}

.results-enter-active,
.results-leave-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.2s ease-in-out;
}

.results-enter-from,
.results-leave-to {
  opacity: 0;
  transform: translateY(50px);
}
</style>
