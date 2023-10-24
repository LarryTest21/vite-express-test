<script setup lang="ts">
import { ref } from "vue";
import { doc, getDoc } from "firebase/firestore";
import db from "../../firebase/firebaseInit";
import "firebase/compat/auth";
import 'firebase/firestore'
import userIcon from "../../components/icons/visitors.vue"

const querySnapshot = ref()
const totalVisitors = ref()

const Start = async () => {

    querySnapshot.value = (await getDoc(doc(db, "analytics", "visitors"))).data()
    totalVisitors.value = querySnapshot.value.visitorCount
}
Start();
</script>

<template>
    <div class="total-visitors-wrapper">
        <div class="text-wrapper">
            <label>Total Visitors</label>
            <div class="total-visitors">{{ totalVisitors }}</div>
        </div>
        <div class="icon-wrapper">
            <userIcon class="userIcon" />
        </div>
    </div>
</template>
  
<style lang="scss" scoped>
.total-visitors-wrapper {
    background-color: var(--color-nav-bg);
    color: var(--color-nav-txt);
    font-family: Roboto Condensed;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 30px;
    position: relative;
    overflow: hidden;

    .text-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        z-index: 2;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        label {
            font-size: 2.5rem;
            font-weight: 500;
        }

        .total-visitors {
            font-size: 3rem;
            font-weight: 700;
        }
    }

    .icon-wrapper {
        position: absolute;
        height: 150%;
        width:100%;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        .userIcon {
            position: absolute;
            z-index: 0;
            opacity: 0.2;
            height:100%;
            width:100%;
            right: -40%;
            top:20px;
            transition: all 0.1s ease-in-out;
        }


        svg :deep(.cls-1) {
            letter-spacing: -.01em;
        }

        svg :deep(.cls-2) {
            fill: none;
            stroke: var(--color-nav-txt);
            stroke-miterlimit: 10;
            stroke-width: 5px;
        }

        svg :deep(.cls-3) {
            letter-spacing: .01em;

        }

        svg :deep(.cls-4) {
            letter-spacing: 0em;
            stroke: var(--color-nav-txt);

        }

        svg :deep(.cls-5) {
            letter-spacing: -.03em;
            stroke: var(--color-nav-txt);

        }

        svg :deep(.cls-6) {
            font-family: Nunito-ExtraBold, Nunito;
            font-size: 12px;
            font-weight: 700;
            stroke: var(--color-nav-txt);

        }

        svg :deep(.cls-7) {
            fill: var(--color-nav-txt);
        }
    }
}

.total-visitors-wrapper:hover {

    .icon-wrapper {
        .userIcon {
            opacity: 0.4;

        }
    }
}
</style>