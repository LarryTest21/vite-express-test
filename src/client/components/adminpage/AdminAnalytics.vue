<script  setup lang="ts">
import { ref, watch, onBeforeUnmount, onMounted } from "vue";
import { collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs } from "firebase/firestore";
import db from "../../firebase/firebaserInit";
import "firebase/compat/auth";
import firebase from 'firebase/compat/app'
import 'firebase/firestore'
import {
    Chart as ChartJS,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    ArcElement,
    type ChartData,
} from 'chart.js';
import { Pie } from 'vue-chartjs'


const detailsPressed = ref()

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    ArcElement,
    Legend
);

const data = ref<ChartData<'pie'>>({
    datasets: [],
});


const pageVisitsMonths = ref([]) as any
const pageVisitsMonths2 = ref() as any
const pageVisitsMonthNames = ref() as any


const allViews = ref()

const allVisitors = ref()

const thisMonthViews = ref()

const currentDate = new Date()
const querySnapshot = ref()

const Start = async () => {

    querySnapshot.value = (await getDoc(doc(db, "analytics", "visitors"))).data()

    allVisitors.value = querySnapshot.value.visitorCount



    const { visitorCount, ...viewsCountArray } = querySnapshot.value
    allViews.value = Object.values(viewsCountArray).reduce((a, b) => a as any + b, 0);


    thisMonthViews.value = viewsCountArray[currentDate.getMonth().toString()]









    pageVisitsMonths.value =
    {
        January: querySnapshot.value![0] || 0,
        February: querySnapshot.value![1] || 0,
        March: querySnapshot.value![2] || 0,
        April: querySnapshot.value![3] || 0,
        May: querySnapshot.value![4] || 0,
        June: querySnapshot.value![5] || 0,
        July: querySnapshot.value![6] || 0,
        August: querySnapshot.value![7] || 0,
        September: querySnapshot.value![8] || 0,
        October: querySnapshot.value![9] || 0,
        November: querySnapshot.value![10] || 0,
        December: querySnapshot.value![11] || 0
    }

    pageVisitsMonths2.value = Object.values(pageVisitsMonths.value)
    pageVisitsMonthNames.value = Object.keys(pageVisitsMonths.value)

}
Start();



const emit = defineEmits(["detailsPressed"]);

const analyticsDetails = () => {
    detailsPressed.value = !detailsPressed.value;
    emit("detailsPressed", detailsPressed.value);
};




onMounted(async () => {

    watch(() => pageVisitsMonths2.value, () => {
        data.value = {
            labels: pageVisitsMonthNames.value,
            datasets: [
                {
                    backgroundColor: ["#f3ab93", "#ef7780", "#cb6c80", "#93617c", "#36587b", "#42565f", "#f3ab93", "#ef7780", "#cb6c80", "#93617c", "#395876", "#42565f"],
                    data: pageVisitsMonths2.value
                }
            ]
        }
    })

})


</script>

<template>
    <div class="analytics-wrapper">
        <div class="pseudo-div"></div>
        <div class="analytics-inner">
            <div class="anayltics-top">
                <label for="Analytics">Analytics</label>
                <input type="button" class="button" value="Details" @click="analyticsDetails" />

            </div>
            <div class="analytics">
                <div> All Visitors: {{ allVisitors }}</div>
                <div>All Pageviews: {{ allViews }}</div>
                <div>This Month Views {{ thisMonthViews }}</div>
            </div>
            <div class="detail-analytics">

                <div class="pageviews-pie" v-if="detailsPressed">
                    <Pie :data="data" />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.analytics-wrapper {
    position: relative;
    width: 100%;
    height: 100%;


    .pseudo-div {
        position: absolute;
        width: 450px;
        height: 300px;
        transition: all 0.3s ease-in-out;
    }

    .analytics-inner {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: var(--color-nav-bg);
        color: var(--color-nav-txt);

        .anayltics-top {
            padding: 20px;
            background-color: green;
            font-family: Roboto Condensed;
            font-size: 2.4rem;
            font-weight: 700;
            color: var(--color-nav-bg);
            display: flex;
            justify-content: space-between;

            .button {
                position: relative;
                right: 0;
                top: 0;
                height: 100%;
                font-family: Chango;
                font-size: 1.4rem;
                font-weight: 400;
                right: 0;
                top: 0;
                border-radius: 18px;
                cursor: pointer;
                padding: 10px;
                color: var(--color-nav-txt);
                border-style: none;
                box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.3);
                background-color: var(--color-nav-bg);
                transition: all 0.2s ease-in-out;
            }

            .button:hover {
                color: rgb(240, 240, 240);
                background-color: rgb(48, 192, 4);
            }

            .button:active {
                box-shadow: -1px -1px 1px 0.5px rgba(0, 0, 0, 0.3);
            }

            label {
                position: relative;

            }
        }

        .analytics {
            font-family: Roboto Condensed;
            font-weight: 700;
            font-size: 1.5rem;

        }

        .detail-analytics {
            position: relative;
            height: 100%;
            width: 100%;
            padding: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .test-text {
            position: relative;
            height: 70%;
            width: 100%;
            color: var(--color-nav-txt);

            :deep(canvas) {
                display: flex;
                flex-direction: column;
            }
        }
    }
}
</style>