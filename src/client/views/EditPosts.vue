<script setup lang="ts">
import { ref } from "vue";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
</script>

<template>
  <div class="edit-post-wrapper">
    <img src="../assets/logos/logo.svg" alt="" />
    <div class="inputs">
      <div class="text">
        <div class="input"></div>

        <div class="input">
          <passwordSVG class="icon" />
        </div>
      </div>

      <div class="buttons">
        <input type="button" value="LogIn" @click.prevent="" />

        <RouterLink to="/register">
          <input type="button" value="Register" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media (min-width: 1024px) {
  .edit-post-wrapper {
    height: 100vh;
    width: 100vw;
    margin-top: 75px;
    font-family: Chango;
    color: var(--color-nav-txt);
    font-size: 1rem;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    gap: 20px;

    img {
      width: 200px;
    }
    .inputs {
      background-color: var(--color-nav-bg) !important;
      border-radius: 20px;
      width: 25%;
      height: 300px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 30px;
      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;

        .input {
          border-color: var(--vt-c-nav-text-bg-hover);
          width: 90%;
          border-width: 2px;
          border-style: default;
          border-radius: 5px;
          transition: width 0.1s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;

          .icon {
            position: absolute;
            width: 30px;
            height: 15px;
            stroke-width: 2px;
            fill: var(--color-nav-txt);
            z-index: 0;
            pointer-events: none;
            transform: translate(-250%, 0%);
            transition: all 0.2s ease-in-out;
          }
        }
      }

      .buttons {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 100%;
        gap: 10px;

        input[type="button"] {
          padding: 0 0;
          width: 50%;
          font-family: Chango;
          font-size: 16px;
          cursor: pointer;
          height: 40px;
          color: var(--color-nav-txt) !important;
          border-style: none;
          box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.3);
          background-color: var(--color-nav-bg);
          transition: all 0.1s ease-in-out;
          border-radius: 18px;
        }
        a {
          width: 50%;
          padding: 0 0;
          height: 40px;

          input[type="button"] {
            width: 100%;
          }
        }

        input[type="button"]:hover {
          color: var(--color-nav-bg) !important;
          background-color: var(--color-nav-txt);
        }
        input[type="button"]:active {
          box-shadow: -1px -1px 1px 0.5px rgba(0, 0, 0, 0.3);
        }
      }
    }
  }
}
</style>
