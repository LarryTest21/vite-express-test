<script setup lang="ts">
import { ref } from 'vue'
import { userData } from '../../store/userData';

const props = defineProps({
    commentsLevel: Number,
    commentID: Number,
    rootCommentID: {
        type: Number,
        default: null
    },
    replyToCommentName: String
}); const emit = defineEmits(["uploadNewComment", "cancelCommenting"]);

const isFocusedNewComment = ref(false)
const commentText = ref('')
const commentBox = ref<HTMLTextAreaElement | null>(null)

const autoResize = () => {
    const el = commentBox.value
    if (el) {
        el.style.height = 'auto'
        el.style.height = `${el.scrollHeight}px`
    }
}

const cancelFn = () => {
    if (commentBox.value) {
        commentText.value = ''
        isFocusedNewComment.value = false
    }
    emit("cancelCommenting");
}


const submitComment = () => {
    const commentContent = commentText.value.trim()
    if (!commentContent) return

    if (props.commentsLevel === 1) {
        emit('uploadNewComment',
            { commentContent, commentsLevel: props.commentsLevel }
        )
    } else if (props.commentsLevel === 2) {

        emit('uploadNewComment',
            { commentContent, commentsLevel: props.commentsLevel, rootCommentID: props.rootCommentID }
        )
    } else if (props.commentsLevel === 3) {

        emit('uploadNewComment',
            { commentContent, commentsLevel: props.commentsLevel, rootCommentID: props.rootCommentID, commentID: props.commentID, replyToCommentName: props.replyToCommentName }
        )

    }

    commentText.value = ''
}


</script>



<template>

    <div class="comment-input-wrapper">
        <img :src="userData().data.profilePic" alt="">
        <div class="text-wr">
            <div class="input-wrapper">
                <textarea :placeholder="isFocusedNewComment ? '' : 'Add a comment...'" rows="1" ref="commentBox"
                    v-model="commentText" @focus="isFocusedNewComment = true" @input="autoResize"></textarea>
                <div class="input-underline"></div>
            </div>
            <div class="input-actions" v-if="isFocusedNewComment">
                <button class="btn cancel" @click="cancelFn">Cancel</button>
                <button class="btn reply" @click.prevent="submitComment">Comment</button>
            </div>
        </div>
    </div>



</template>

<style lang="scss" scoped>
.comment-input-wrapper {
    display: flex;

    img {
        height: 20px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 10px;
    }

    .text-wr {
        width: 100%;
        position: relative;
    }
}


.input-wrapper {
    textarea {
        width: 100%;
        border: none;
        outline: none;
        font-size: 1.6rem;
        font-weight: 500;
        background: transparent;
        resize: none;
        color: var(--color-nav-txt);
        font-family: inherit;
        overflow: hidden;
    }

    .input-underline {
        position: relative;
        bottom: 0;
        left: 0;
        height: 2px;
        width: 100%;
        background-color: #ccc;
        transition: background-color 0.2s ease;
    }

    &:focus-within .input-underline {
        background-color: var(--color-nav-txt);
    }
}

.btn {
    font-family: Roboto Condensed;
    background-color: var(--color-nav-bg);
    font-weight: 600;
    border-radius: 5px;
    cursor: pointer;
    color: var(--color-nav-txt);
    line-height: 15px;
    padding: 10px;
    border: 1px solid transparent;
    box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.363);
    transition: all 0.1s ease-in-out;
    font-size: 1.5rem;

    &:hover {
        background-color: var(--color-nav-txt);
        color: var(--color-nav-bg);
    }

    &.cancel:hover {
        background-color: rgb(92, 3, 3);
        color: var(--color-nav-bg);
    }

}


.input-actions {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
</style>