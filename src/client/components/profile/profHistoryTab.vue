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
        $(el).css({ 'animation-delay': (i / 10 * Math.floor(Math.random() * -100)) + "s" });
    });

    axios.get("/api/content/blogposts").then((res) => {
        blogPostsArray.value = res.data
    }).then(() => {

        if (userData.value == undefined) {
            watch(userData, () => {
                readBlogArrayFinal.value = blogPostsArray.value.filter((x: any) => readHistoryArray.value.find((y: any) => y === x._id))
                setTimeout(() => {
                    skeletonLoad.value = false
                }, 500);
            })

        } else {

            readBlogArrayFinal.value = blogPostsArray.value.filter((x: any) => readHistoryArray.value.find((y: any) => y === x._id))

            //readArrayFinal
            setTimeout(() => {
                skeletonLoad.value = false
            }, 300);
        }
    })

})

</script>

<template>
    <div class="read-history-wrapper">
        <label> Read History</label>

        <div class="read-history">
            <div class="empty" key="2"
                v-if="(!skeletonLoad && readBlogArrayFinal === undefined) || (!skeletonLoad && readBlogArrayFinal.length === 0)">
                You have no history yet</div>
            <ul class="label-list list">
                <li>Title</li>
                <li>Date</li>
                <li></li>
            </ul>
            <div class="history-list-wrapper" key="3">

                <TransitionGroup tag="div" class="transition" name="fade">
                    <div class="skeleton-wrapper" key="1" ref="skeleton" v-if="skeletonLoad">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>


                    </div>
                    <ul class="history-list" v-for="historyValue in readBlogArrayFinal" key="2">
                        <div class="list" key="2">
                            <router-link :to="/blog/ + historyValue._id" key="post.id"
                                class="posts-permalink"></router-link>
                            <div class="post-title">{{ historyValue.postTitle }}</div>
                            <div class="post-date">{{ moment(new Date(historyValue.postDate)).format("YY/MM/DD, HH:mm") }}
                            </div>
                            <div class="delete-button">
                                <Delete @click="deleteHistoryPost(historyValue._id)" />
                            </div>
                        </div>

                    </ul>

                </TransitionGroup>
            </div>


        </div>
    </div>
</template>

<style lang="scss" scoped>
.read-history-wrapper {
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    height: 100%;
    width: 100%;
    color: var(--color-nav-txt);
    font-family: Roboto Condensed;
    position: relative;
    gap: 10px;
    overflow-y: hidden;

    label {
        position: relative;
        padding: 10px;
        font-family: Chango;
        color: var(--color-nav-txt);
        font-size: 2rem;
    }

    .read-history {
        position: relative;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .list {
            position: relative;
            display: grid;
            grid-template-columns: 3fr 1fr 1fr;
            grid-template-rows: 1fr;
            padding-inline-start: 0;
            padding-left: 5px;
            list-style: none;
            width: 100%;
        }

        .label-list {
            list-style: none;
            font-size: 1.4rem;
            font-weight: 700;
            padding-left: 10px;
            padding-right: 10px;
        }

        .history-list-wrapper {
            width: 100%;
            padding: 10px;
            position: relative;
            height: 100%;
            overflow-y: auto;

            .transition {
                position: relative;
                height: 100%;
                display: flex;
                flex-direction: column;
                gap: 5px;

                .skeleton-wrapper {
                    position: absolute;
                    width: 100%;
                    gap: 5px;
                    left: 0;
                    display: flex;
                    flex-direction: column;
                    z-index: 10;

                    li {
                        list-style: none;
                        border-radius: 10px;
                        height: 30px;
                        content: "";
                        background: linear-gradient(100deg,
                                rgba(255, 255, 255, 0) 10%,
                                rgba(255, 255, 255, 0.384) 50%,
                                rgba(255, 255, 255, 0) 70%) #c7c7c7;
                        background-size: 200% 100%;
                        background-position-x: 180%;
                        animation: 0.5s loading ease-in-out infinite;
                    }
                }


                @keyframes loading {
                    to {
                        background-position-x: -20%;
                    }
                }

                .history-list {
                    position: relative;
                    padding-inline-start: 0;
                    background-color: var(--color-nav-txt);
                    font-family: Roboto Condensed;
                    font-size: 1.2rem;
                    color: var(--color-nav-bg);
                    border-radius: 10px;
                    height: 30px;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    width: 100%;

                    .list {
                        div {
                            display: flex;
                            justify-content: flex-start;
                        }

                        .post-title {
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            height: 100%;

                        }

                        .post-date {
                            width: 100%;
                            height: 100%;
                            font-size: 0.9rem;
                        }

                        .delete-button {
                            position: relative;
                            display: flex;
                            height: 30px;
                            width: 30px;
                            margin-left: 30px;

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

                    a {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                    }

                    div {
                        align-items: center;
                        justify-content: center;
                    }
                }
            }







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
        }

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





}








.fade-move,

.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-leave-to {
    position: absolute;
}
</style>