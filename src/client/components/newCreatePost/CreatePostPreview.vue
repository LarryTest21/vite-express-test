<script setup lang="ts">
import { ref, computed } from 'vue'
import moment from "moment"


const props = defineProps({
    interPost: Object,
    showPreview: Boolean
})



const showPostPreview = ref(props.showPreview)

const showPreview = (e: boolean) => {
    showPostPreview.value = e
}

const previewPost = ref()

const previewPostTitle = ref()
const previewPostContent = ref()
const previewPostDate = ref()
const previewPostAuthor = ref()



const interPost = (value: any) => {
    previewPost.value = value
    console.log(`output->previewPost.value`, previewPost.value)

    previewPostTitle.value = previewPost.value.postTitle || 'No Title'
    previewPostContent.value = previewPost.value.postContent || 'No Content'
    previewPostDate.value = moment(new Date(previewPost.value.postDate)).format("YYYY, MMM DD        HH:MM") || 'No set date'
    previewPostAuthor.value = previewPost.value.author
}


</script>

<template>
    <transition name="preview">
        <div class="preview-wrapper">
            <div class="post">
                <div class="postTitle">{{ previewPostTitle }}</div>
                <div class="metadata">
                    <div class="postDate">{{ previewPostDate }}</div>

                    <div class="postAuthor">{{ previewPostAuthor }}</div>
                </div>
                <div class="postContent" v-html="previewPostContent"></div>
            </div>
            <button @click.prevent="showPostPreview = !showPostPreview">Close</button>
        </div>
    </transition>
</template>

<style lang="scss" scoped>
.preview-wrapper {
    position: absolute;
    top: 70px;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 80%;
    max-height: 70%;
    border-radius: 10px;
    padding: 20px 40px;
    background: linear-gradient(150deg,
            rgba(1, 90, 174, 1) 0%,
            rgba(0, 54, 107, 1) 70%, );
    z-index: 1;
    font-family: Roboto Condensed;
    color: var(--color-nav-bg);

    button {
        height: 70px;
        width: 150px;
        font-family: Chango;
        font-size: 2rem;
        color: var(--color-nav-txt);
        background-color: var(--color-nav-bg);
        position: absolute;
        bottom: 0;
        right: 0;
        margin: 20px;
        border-radius: 5px;
        border: 0;
        cursor: pointer;
        color: var(--color-nav-txt);
        box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.363);
        transition: all 0.2s ease-in-out;

        &:hover {
            background-color: var(--color-nav-txt-lighter);
            color: var(--color-nav-bg);
        }

        &:focus {
            box-shadow: inset 2px 2px 2px 1px rgba(0, 0, 0, 0.363);
        }
    }

    .post {
        position: relative;
        display: inline-block;

        .postTitle {
            font-size: 3rem;
            font-weight: 600;
        }

        .metadata {
            position: relative;
            margin-bottom: 30px;
            margin-top: 10px;

            .postDate {
                font-style: italic;
                font-size: 1rem;
            }

            .postAuthor {
                color: var(--color-nav-txt);
                background: var(--color-nav-bg);
                display: inline-block;
                padding: 5px;
                font-weight: 600;
                border-radius: 5px;
                margin-top: 10px;
                cursor: pointer;
                transition: all 0.2s ease-in-out;

                &:hover {
                    background-color: var(--color-nav-bg-darker);
                }
            }
        }

    }
}
</style>