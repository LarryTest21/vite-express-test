<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const selectedCategory = ref(['Choose category']) as any
const showSelectsTab = ref(false)

const props = defineProps({
    multiSelectOptions: Array,
    deleteAble: Boolean,
    fontSize: String,
    savedValue: Array
})
const emit = defineEmits(
    ['mainCategory', 'subCategory']
)

const savedValue = computed(() => props.savedValue)

watch(savedValue, () => {

    if (savedValue.value != undefined) {
        console.log(`output->itsok`)
        selectedCategory.value = savedValue.value
    }
})



const deleteAble = ref(props.deleteAble)

const deleteAbleShowTab = ref()

const multiSelectOptionsFiltered = ref(props.multiSelectOptions)

const fontSize = computed(() => props.fontSize || '1.5rem')


const showSelects = () => {
    showSelectsTab.value = !showSelectsTab.value
}

const clickAway = () => {
    if (!deleteAble.value) {
        showSelectsTab.value = false
    } else {
        deleteAbleShowTab.value = true
    }
}
const clickAway2 = () => {
    if (deleteAbleShowTab.value) {
        showSelectsTab.value = false
    }
}


const showSelectedDeletable = (e: any) => {
    if (deleteAble.value) {
        selectedCategory.value = selectedCategory.value.filter((item:any) => item !== 'Choose category')
        var value = e.target.innerText

        if (!selectedCategory.value.includes(value)) {
            selectedCategory.value.push(value)
            const index = multiSelectOptionsFiltered.value!.indexOf(value);
            if (index !== -1) {
                multiSelectOptionsFiltered.value!.splice(index, 1);
            }
        }

    } else {
        selectedCategory.value = []
        selectedCategory.value = [e.target.innerText]
    }
}

watch(() => selectedCategory.value, (newvalue: any) => {

    if (newvalue.length === 0) {

        if (deleteAble.value) {
            selectedCategory.value = ['Choose category']
            emit("subCategory", undefined)
        }

    } else {
        if (deleteAble.value) {
            if (newvalue == 'Choose category') {
                emit("subCategory", undefined)
            } else {
                emit("subCategory", newvalue)
            }
        }
        else if (!deleteAble.value) {
            emit("mainCategory", newvalue)
        }
    }



}, { deep: true })

const deleteFn = (e: any) => {
    const index = selectedCategory.value.indexOf(e);
    if (index !== -1) {
        selectedCategory.value.splice(index, 1);

        if (multiSelectOptionsFiltered.value?.includes(e)) {
            multiSelectOptionsFiltered.value!.sort()
        } else {
            multiSelectOptionsFiltered.value!.push(e);
            multiSelectOptionsFiltered.value!.sort()
        }
    }
}

</script>

<template>
    <div class="multiselect-wrapper">
        <div type="text" class="select" @click="showSelects" v-click-away="clickAway">
            <div class="show-category" v-if="deleteAble">
                <TransitionGroup name="list">
                    <div v-if="selectedCategory[0] === 'Choose category'">{{ 'Choose category' }}</div>
                    <div v-if="selectedCategory[0] != 'Choose category'" class="deletable"
                        v-for="category in selectedCategory">
                        <div class="category">{{ category }}</div>
                        <div class="delete-button" @click.stop.prevent="deleteFn(category)"></div>
                    </div>
                </TransitionGroup>
            </div>
            <div class="show-category" v-if="!deleteAble">
                <div v-if="selectedCategory[0] === 'Choose category'">{{ 'Choose category' }}</div>
                <div class="category" v-if="selectedCategory[0] != 'Choose category'">{{ selectedCategory[0] }}</div>
            </div>
        </div>
        <transition name="tab">
            <div class="select-tab" v-if="showSelectsTab && multiSelectOptionsFiltered!.length != 0"
                v-click-away="clickAway2">
                <div class="category" v-for="category in multiSelectOptionsFiltered">
                    <div class="category" @click="showSelectedDeletable">{{ category }}</div>
                </div>

            </div>
        </transition>

    </div>
</template>

<style lang="scss" scoped>
.multiselect-wrapper {
    display: flex;
    height: 100%;
    position: relative;
    font-family: Roboto Condensed;
    font-weight: 600;

    .select {
        font-weight: 600;
        position: relative;
        height: 100%;
        min-width: 100%;

        font-size: 1.5rem;
        font-size: v-bind(fontSize);
        border-width: 0;
        background-color: var(--color-nav-bg);
        padding-inline: 0;
        padding-block: 0;
        border-radius: 5px;
        padding: 5px;
        color: var(--color-nav-txt);
        overflow: hidden;

        .show-category {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            height: 40px;

            div {
                display: inline-block;
            }

            .deletable {
                display: flex;
                gap: 5px;
                font-size: 1.4rem;
                display: flex;
                align-items: center;
                background-color: var(--color-nav-txt);
                border-radius: 3px;
                padding: 5px;
                color: var(--color-nav-bg);
                z-index: 2;
                height: 100%;

                .delete-button {
                    position: relative;
                    width: 20px;
                    height: 20px;
                    text-align: center;
                    border-radius: 50%;
                    background-color: var(--color-nav-bg);
                    color: var(--color-nav-txt);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    top: 0;
                    bottom: 0;
                    margin: auto;
                    padding: 2px;
                    cursor: pointer;
                    z-index: 10;

                    &::after {
                        content: '';
                        position: absolute;
                        width: 80%;
                        height: 4px;
                        transform: rotate(45deg);
                        background-color: var(--color-nav-txt);
                        border-radius: 3px;
                    }

                    &::before {
                        content: '';
                        position: absolute;
                        width: 80%;
                        height: 4px;
                        transform: rotate(-45deg);
                        background-color: var(--color-nav-txt);
                        border-radius: 3px;
                    }
                }

            }

        }

        &:focus-visible {
            outline: inset 1px var(--color-nav-txt);
        }


    }

    .select-tab {
        position: absolute;
        width: 100%;
        top: 100%;
        background-color: var(--color-nav-bg);
        border-radius: 5px;
        box-shadow: 2px 7px 7px 5px rgba(0, 0, 0, 0.404);
        z-index: 1;
        margin-top: 5px;
        text-align: center;
        overflow: hidden;
        min-width: 130px;

        .category {
            height: 100%;
            transition: all 0.05s;
            cursor: pointer;
            text-align: left;
            padding: 5px 0px 5px 10px;
            font-size: 1.3rem;
            ;

            &:hover {
                background-color: var(--color-nav-txt);
                color: var(--color-nav-bg)
            }
        }
    }
}


.list-move,
/* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
    transition: all 0.1s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
    position: absolute;
}

.tab-enter-active,
.tab-leave-active {
    opacity: 1;
    transform: translateY(0px);
    transition: all 0.1s;
}

.tab-enter-from,
.tab-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}
</style>