<script setup lang="ts">
import { ref, computed, watch, PropType } from "vue";
import moment from "moment";
import { userData } from "../../store/userData";
import CommentsInput from "./Comments Input.vue";
import Thumbsup from "../icons/thumbsup.vue";
import downIcon from "../icons/down.vue";
import type { CommentNode } from "./types";
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollToPlugin);
// Recursive import
import Comment from "./Comment.vue";

const props = defineProps({
    commentsLevel: { type: Number, default: 1 },
    testComment: { type: Array as PropType<CommentNode[]>, required: true },
    rootCommentID: {
        type: Number,
        default: null
    },
    commentID: Number,
});


const emit = defineEmits(["showReplyToCommentTrigger", "uploadNewComment", "toggleThumbsup", "deleteComment"]);

const showReplyComment = ref<number | null>(null);

const replyToFunction = () => {

}

const showRepliesTrigger = ref<number | null>(null);
const replyToCommentID = ref<number | null>(null);
const replyToUsername = ref<string | null>(null);

const toggleReplies = (commentID: number) => {
    showRepliesTrigger.value =
        showRepliesTrigger.value === commentID ? null : commentID;
};

const showReplyToComment = (
    commentID: number,
    username?: string | null
) => {
    replyToCommentID.value = commentID;
    replyToUsername.value = username ?? null;
    emit("showReplyToCommentTrigger", replyToCommentID.value);
    showReplyComment.value =
        showReplyComment.value === commentID ? null : commentID;
    replyToUsername.value = username ?? null;
};


const deleteComment = (data: any) => {

    emit("deleteComment",
        data
    );
}
const triggerDeleteID = ref(null) as any
const askToDeleteCancel = () => {
    triggerDeleteID.value = null
}

const askToDelete = (data: any) => {
    if (triggerDeleteID.value === null) {
        triggerDeleteID.value = data
    } else {
        triggerDeleteID.value = null
    }
}

const deleteClickAway = () => {
    triggerDeleteID.value = null
}


const highlightedReplyID = ref<number | null>(null);

const highlightReply = (replyID: number | null) => {

    const el = document.getElementById(`comment-${replyID}`);
    if (el) {
        const yOffset = 0; // adjust for fixed headers if needed
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

        gsap.to(window, {
            duration: 1,
            scrollTo: { y },
            ease: 'back.inOut'
        });
    }

    setTimeout(() => {
        highlightedReplyID.value = replyID;
        setTimeout(() => {
            highlightedReplyID.value = null;

        }, 1000);
    }, 700);
};</script>

<template>
    <TransitionGroup name="fade">
        <div class="comment" v-for="comment in testComment" :key="comment.commentID || 10">
            <div class="comment-outer" :class="{ 'highlighted-reply': comment.commentID === highlightedReplyID }"
                :id="`comment-${comment.commentID}`">
                <img class="profilepic" :src="comment.profilePic" />
                <div class="text-wrapper">
                    <div class="name-time">
                        <div class="commenterName">{{ comment.displayName }}</div>
                        <div class="commentDate">
                            {{ moment(new Date(comment.commentDate)).format("MMM DD, HH:mm") }}
                        </div>
                    </div>
                    <div class="comment-text">
                        <div class="username" v-if="comment.replyToCommentName"
                            @click="highlightReply(comment.replyToCommentID ?? null)">@{{ comment.replyToCommentName }}
                        </div>
                        <div class="comment-content" v-html="comment.commentContent"></div>
                    </div>
                    <div class="thumbsup-reply" :class="{
                        'thumbedd-up': comment.thumbsupIDs?.includes(userData().data._id),
                    }">
                        <Thumbsup @click="emit('toggleThumbsup', comment.commentID)" />
                        <div class="count">{{ comment.thumbsupIDs?.length || 0 }}</div>

                        <button class="btn reply" @click="showReplyToComment(comment.commentID)">
                            Reply
                        </button>
                        <div class="delete-ask" v-if="comment.commentWriterID === userData().data._id">
                            <TransitionGroup name="question">
                                <button class="btn delete"
                                    v-if="triggerDeleteID == null || triggerDeleteID !== comment.commentID"
                                    @click="askToDelete(comment.commentID)" key="1">
                                    Delete
                                </button>
                                <div class="question" key="2" v-if="triggerDeleteID === comment.commentID"> Do you want
                                    to
                                    delete?
                                    <div class="delete-wr">
                                        <input type="button" class="btn delete"
                                            @click="deleteComment({ commentID: comment.commentID, rootCommentID: props.rootCommentID })"
                                            v-click-away="deleteClickAway" value="Yes" />
                                    </div>
                                    <input type="button" value="Cancel" class="btn cancel" @click="askToDeleteCancel">
                                </div>
                            </TransitionGroup>
                        </div>

                        <div class="replies-btn-wr" v-if="comment.replies?.length"
                            @click="toggleReplies(comment.commentID)">
                            <span class="replies-title">Replies</span>
                            <downIcon :class="showRepliesTrigger === comment.commentID ? 'active' : ''" />
                        </div>
                    </div>
                </div>
            </div>
            <CommentsInput v-if="showReplyComment === comment.commentID" :commentsLevel="commentsLevel + 1"
                class="comments-lvl2" :commentID="comment.commentID" @cancelCommenting="showReplyComment = null"
                :rootCommentID="props.rootCommentID || comment.commentID" :replyToCommentName="comment.displayName"
                @uploadNewComment="(data) => emit('uploadNewComment', data)" />

            <div v-if="showRepliesTrigger === comment.commentID && comment.replies?.length" class="replies-wrapper"
                key="2">
                <Comment v-if="props.commentsLevel === 1" :commentsLevel="commentsLevel + 1"
                    :testComment="comment.replies" :rootCommentID="props.rootCommentID || comment.commentID"
                    :commentID="comment.commentID" :key="comment.commentID"
                    @deleteComment="(data) => emit('deleteComment', data)"
                    @uploadNewComment="(data) => emit('uploadNewComment', data)"
                    @toggleThumbsup="emit('toggleThumbsup', $event)" </Comment>
            </div>


        </div>
    </TransitionGroup>

</template>


<style lang="scss" scoped>
.comment {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 30px;


    .comment-outer {
        display: flex;
        gap: 20px;
        padding: 10px;
        border-radius: 10px;


        .profilepic {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 10px;
        }

        .text-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 5px;
            width: 100%;

            .name-time {
                display: flex;
                align-items: center;
                gap: 30px;
                font-family: Roboto;
                font-size: 1.6rem;

                .commentDate {
                    font-size: 1.2rem;
                }

            }


            .comment-text {
                font-family: Roboto Condensed;
                font-size: 1.4rem;
                font-weight: 400;
                white-space: pre-wrap;
                width: 100%;

                .username {
                    font-weight: 900;
                    font-size: 1.5rem;
                    display: inline-block;
                    width: auto;
                    padding: 5px;
                    margin-left: -5px;
                    border-radius: 10px;
                    transition: all 0.1s ease-in-out;

                    &:hover {
                        background-color: var(--color-nav-txt);
                        color: var(--color-nav-bg);
                        cursor: pointer
                    }
                }
            }

            .thumbsup-reply {
                display: flex;
                align-items: center;
                gap: 10px;

                svg {
                    width: 40px;
                }

                ::v-deep .thumb {
                    transition: all 0.1s ease-in-out;
                }

                ::v-deep .thumb:hover {
                    stroke-width: 1px;
                    fill: var(--color-nav-txt);
                    cursor: pointer;
                }

                .btn {
                    margin-left: 30px;
                }

                &.thumbedd-up ::v-deep .thumb {
                    fill: var(--color-nav-txt);
                }


                .replies-btn-wr {
                    display: flex;
                    margin-left: 50px;
                    cursor: pointer;

                    svg {
                        fill: var(--color-nav-txt);
                        transform: rotate(-90deg);
                        transition: transform 0.1s ease;

                        &.active {
                            transform: rotate(-270deg);
                        }
                    }
                }



                .delete {
                    background-color: rgb(122, 1, 1);
                    color: var(--color-nav-bg);

                    &:hover {
                        background-color: rgb(92, 3, 3);
                    }
                }

                .delete-ask {
                    display: flex;

                    .question {
                        display: flex;
                        align-items: center;
                        margin-left: 50px;
                        font-size: 1.5rem;

                        .delete-wr {

                            .delete {
                                background-color: rgb(122, 1, 1);
                                color: var(--color-nav-bg);

                                &:hover {
                                    background-color: rgb(92, 3, 3);
                                }
                            }
                        }


                        .cancel {
                            background-color: rgb(0, 102, 0);
                            color: var(--color-nav-bg);

                            &:hover {
                                background-color: rgb(2, 136, 2);
                            }

                        }
                    }

                }
            }
        }
    }


    .comments-lvl2 {
        margin-top: 20px;
        margin-left: 70px;
        width: 90%;
    }

    .reply-to-comment-wrapper {
        margin-top: 20px;
        display: flex;
        gap: 20px;

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



    .replies-wrapper {
        margin-left: 70px;
        margin-top: 30px;

        .button-wrapper {
            display: flex;
            align-items: center;
            cursor: pointer;


        }

        .replies {
            margin-top: 20px;
            margin-left: 100px;
            display: flex;
            align-items: center;
            gap: 20px;

            img {
                width: 50px;
                margin: 0
            }

            .text-wrapper {
                font-family: Roboto;

                .name-time {
                    display: flex;
                    align-items: center;
                    gap: 30px;
                    font-family: Roboto;
                    font-size: 1.6rem;

                    .replyDate {
                        font-size: 1.2rem;
                    }
                }

                .comment-text {
                    font-family: Roboto Condensed;
                    font-size: 1.4rem;
                    font-weight: 400;
                    white-space: pre-wrap;
                }

            }
        }

    }

    .reply-to-comment-wrapper {
        width: 100%;
    }

}

.highlighted-reply {
    animation: pulseHighlight 1s ease;
}

@keyframes pulseHighlight {
    0% {
        background-color: #ffca1d;
    }

    50% {
        background-color: #ffca1d;
    }

    100% {
        background-color: transparent;
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


.question-move,
.question-enter-active,
.question-leave-active {
    transition: all 0.2s cubic-bezier(0.55, 0, 0.1, 1);
}

.question-enter-from,
.question-leave-to {
    opacity: 0;
    position: absolute;
}

.fade-move,
.fade-enter-active,
.fade-leave-active {
    transition: all 0.2s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateX(20vh);
}

.fade-leave-active {
    position: absolute;
}
</style>