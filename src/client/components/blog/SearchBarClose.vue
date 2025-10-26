<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(["close"]);


</script>

<template>
    <a class="close-button" @click="() => { emit('close') }">Close</a>
</template>

<style lang="scss" scoped>
@mixin transition($prop: all, $time: 1s, $ease: ease-out) {
    -webkit-transition: $prop $time $ease;
    -moz-transition: $prop $time $ease;
    -ms-transition: $prop $time $ease;
    -o-transition: $prop $time $ease;
    transition: $prop $time $ease;
}

@mixin rotate($degrees) {
    -webkit-transform: rotate($degrees);
    -moz-transform: rotate($degrees);
    -ms-transform: rotate($degrees);
    -o-transform: rotate($degrees);
    transform: rotate($degrees);
}

@mixin square($size) {
    width: $size;
    height: $size;
}

$black: var(--color-nav-bg);
$white: var(--color-nav-txt);

// ---- [ Close Button ] ---- //
.close-button {
    @include square(50px);
    border-radius: 10px;
    background: $black;
    margin-top: -75px;
    margin-left: -75px;
    position: absolute;
    display: block;
    z-index: 200;
    text-indent: -9999px;
    cursor: pointer;

    &:before,
    &:after {
        content: '';
        width: 50%;
        height: 5px;
        background: $white;
        position: absolute;
        top: 48%;
        left: 22%;
        @include rotate(-45deg);
        @include transition($prop: all, $time: 0.3s);
    }

    &:after {
        @include rotate(45deg);
        @include transition($prop: all, $time: 0.3s);
    }

    &:hover {

        &:before,
        &:after {
            @include rotate(180deg);
        }
    }
}

</style>
