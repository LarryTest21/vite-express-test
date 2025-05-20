<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import moment from "moment";
import $ from "jquery";
import Delete from "../../components/icons/delete.vue"
import axios from "axios";

const props = defineProps({
    userData: Object
})
const userData = ref(props.userData!.data)

const skeletonLoad = ref(true)
const skeleton = ref()
const readHistoryArray = ref()
const blogPostsArray = ref()

const readBlogArrayFinal = ref()


const deleteHistoryPost = (t: any) => {
console.log(t);
}

onMounted(async () => {

    skeletonLoad.value = true

    readHistoryArray.value = userData.value.readBlog

    userData.value = props.userData

    $.each(skeleton.value.children, function (i: number, el) {
        $(el).css({ 'animation-delay': (i / 10 * Math.floor(Math.random() * -50)) + "s" });
    });


    axios.get("/api/content/blogposts").then((res) => {
        blogPostsArray.value = res.data
    }).then(() => {

        if (userData.value == undefined) {
            watch(userData, () => {

                readBlogArrayFinal.value = blogPostsArray.value.filter((x: any) => readHistoryArray.value.find((y: any) => y === x._id))

                setTimeout(() => {
                    skeletonLoad.value = false
                }, 1000);
            })

        } else {

            readBlogArrayFinal.value = blogPostsArray.value.filter((x: any) => readHistoryArray.value.find((y: any) => y === x._id))

            //readArrayFinal
            setTimeout(() => {
                skeletonLoad.value = false
            }, 1000);
        }
    })

})

</script>

<template>
    <div class="read-history-wrapper">
        <label> Read History</label>

        <div class="read-history">


            <TransitionGroup name="fade">
                <div class="skeleton-wrapper-wr" key="1" v-show="skeletonLoad">
                    <div class="skeleton-wrapper" ref="skeleton">
                        <li></li>
                        <li></li>
                        <li></li>
                    </div>
                </div>

                <div class="empty" key="2"
                    v-if="(!skeletonLoad && readBlogArrayFinal === undefined) || (!skeletonLoad && readBlogArrayFinal.length === 0)">
                    You
                    have no history yet</div>

                <div class="history-list-wrapper" v-if="!skeletonLoad" key="3">
                    <ul class="label-list list" v-if="readBlogArrayFinal != undefined">
                        <li>Title</li>
                        <li>ID</li>
                        <li>Date</li>
                        <li></li>
                    </ul>
                    <ul class="history-list list" v-for="historyValue in readBlogArrayFinal">
                        <router-link :to="/blog/ + historyValue._id" key="post.id" class="posts-permalink"></router-link>
                        <div class="post-title">{{ historyValue.postTitle }}</div>
                        <div class="post-id">{{ historyValue._id }}</div>
                        <div class="post-date">{{ moment(new Date(historyValue.postDate)).format(
                            "YY/MM/DD, HH:mm"
                        )
                        }}</div>
                        <div class="delete-button">
                            <Delete @click="deleteHistoryPost(historyValue._id)" />
                        </div>

                    </ul>
                </div>
            </TransitionGroup>


        </div>
    </div>
</template>

<style lang="scss" scoped>
.read-history-wrapper {
    position: relative;
    height: 500px;
    width: 600px;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    background-color: var(--color-nav-bg);
    color: var(--color-nav-txt);
    font-family: Roboto Condensed;
    overflow: hidden;

    label {
        position: relative;
        padding: 10px;
        font-family: Chango;
        color: var(--color-nav-txt);
        font-size: 2rem;
    }

    .read-history {
        position: relative;
        display: flex;
        flex-direction: column;
        position: relative;
        padding: 20px;
    }

    .list {
        position: relative;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        padding-inline-start: 0;
        padding-left: 5px;
        gap: 20px;
    }

    .label-list {
        margin-top: 30px;
        list-style: none;
        font-size: 1.4rem;
        font-weight: 700;
    }

    .history-list-wrapper {
        overflow-y: auto;
    }


    .history-list-wrapper::-webkit-scrollbar {
        width: 10px;
        border-radius: 5px;
    }

    .history-list-wrapper::-webkit-scrollbar-track {
        background: #c5c5c5;
        border-radius: 5px;
    }

    .history-list-wrapper::-webkit-scrollbar-thumb {
        background: var(--color-nav-txt);
        border-radius: 10px;
        height: 10%;
    }

    .empty {
        font-family: Chango;
        font-size: 2rem;
        text-align: center;
        vertical-align: middle;
        line-height: 50px;
        background-color: var(--color-nav-txt);
        color: var(--color-nav-bg);
        border-radius: 30px;
        top: 0;
        margin: auto;
    }

    .history-list {
        font-family: Roboto Condensed;
        font-size: 1.2rem;
        color: var(--color-nav-bg);
        border-radius: 10px;
        background-color: var(--color-nav-txt);
        margin-right: 10px;

        a {
            position: absolute;
            width:100%;
            height:100%;
        }

        div {
            display: flex;
            align-items: center;
            padding: 5px;
        }

        .post-title {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            max-width: 100%;
        }

        .post-id {
            font-size: 1rem;
        }

        .post-date {
            font-size: 0.9rem;
        }

        .delete-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;

            svg {
                position: absolute;
                fill-rule: evenodd;
                cursor: pointer;
                width: 30px;
                stroke: var(--color-nav-txt);
                fill: var(--color-nav-bg);

                &:hover {
                    scale: 1.2;
                }

                :deep(.delete-2) {
                    fill: var(--color-nav-txt);
                }

                @keyframes jiggle {
                    0% {
                        transform: rotate(0);
                    }

                    16% {
                        transform: rotate(12deg);
                    }

                    33% {
                        transform: rotate(-12deg);
                    }

                    49% {
                        transform: rotate(12deg);
                    }

                    66% {
                        transform: rotate(-25deg);
                    }

                    100% {
                        transform: rotate(0)
                    }
                }
            }
        }
    }

    .skeleton-wrapper {
        width: 100%;
        height: 100%;
        z-index: 100;

        li {
            list-style: none;
            height: 30px;
            margin: 10px 0;
            border-radius: 10px;
            background-color: black;
            content: "";
            background: linear-gradient(100deg,
                    rgba(255, 255, 255, 0) 40%,
                    rgba(255, 255, 255, 0.384) 50%,
                    rgba(255, 255, 255, 0) 60%) #c7c7c7;
            background-size: 200% 100%;
            background-position-x: 180%;
            animation: 0.8s loading ease-in-out infinite;

        }
    }

    .history-list-wrapper {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .history-list {
            .post-id {
                height: auto;
                overflow: hidden;
                font-size: 0.8rem;
            }
        }

    }

    @keyframes loading {
        to {
            background-position-x: -20%;
        }
    }

}


.fade-enter-active,
.fade-leave-active {
    transition: all 1s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-leave-to {
    position: absolute;
}
</style>