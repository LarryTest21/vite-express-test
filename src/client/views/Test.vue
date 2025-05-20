

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue"
import StarterKit from '@tiptap/starter-kit'
import { Editor, useEditor, EditorContent } from '@tiptap/vue-3'
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'
import FontSize from "tiptap-extension-font-size"
import TextAlign from "@tiptap/extension-text-align"
import Youtube from "@tiptap/extension-youtube"
import axios from "axios";
import Imager from "../components/tiptapimage"
import Calendar from "../components/newCreatePost/CreatePostSide.vue"


const editor = new Editor({

  content: 'adsad',
  extensions: [
    StarterKit,
    TextStyle,
    FontFamily,
    FontSize,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Youtube.configure({
      inline: false,
    }),
    Imager,
  ],


  editorProps: {
    attributes: {
      class: 'content-editor',
    },
  },
  onUpdate: ({ editor }) => {
    postContent.value = editor.getHTML()
  }
});

const postContent = ref()

watch(() => postContent.value, () => {

  if (originalImage != undefined) {
    originalImage.value.forEach((e: any) => {
      var number = e.imageCount
      console.log(number);
      const imageInContent = postContent.value.includes('alt="' + number)
      console.log(originalImage.value);

      console.log(imageInContent);
      if (!imageInContent) {
        originalImage.value = originalImage.value.filter((item: any) => item.imageCount !== number);
        imageCount.value = imageCount.value - 1
        console.log(originalImage.value);
      }
    })
  }

})


const sizesOpen = ref();
const FontSizeShow = ref('20pt');


const sizeClickAway = () => {
  if (sizesOpen) { sizesOpen.value = !sizesOpen.value }
}
const toggleHeading1 = () => {
  if (editor!.isActive('heading', { level: 1 })) {
    editor!.chain().focus().toggleHeading({ level: 1 }).setFontSize(FontSizeShow.value).run()
  } else if (!editor!.isActive('heading', { level: 1 })) {
    editor!.chain().focus().toggleHeading({ level: 1 }).setFontSize('48pt').run()
  }
}
const toggleHeading2 = () => {
  if (editor!.isActive('heading', { level: 2 })) {
    editor!.chain().focus().toggleHeading({ level: 2 }).setFontSize(FontSizeShow.value).run()
  } else if (!editor!.isActive('heading', { level: 2 })) {
    editor!.chain().focus().toggleHeading({ level: 2 }).setFontSize('36pt').run()
  }
}






const date = ref()
const imageSelect = ref()
const originalImage = ref([]) as any
const imageCount = ref(0)

watch(date, () => {
  console.log(date.value);
})

const onFileSelect = (e: any) => {

  var file = e.target.files[0];
  var reader = new FileReader();
  reader.onload = (e) => {
    originalImage.value.push({
      imageCount: imageCount.value + 1,
      base64: e.target!.result
    });
    var img = document.createElement("img");
    img.onload = () => {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext("2d");
      ctx!.drawImage(img, 0, 0);

      var MAX_WIDTH = 300;
      var MAX_HEIGHT = 300;
      var width = img.width;
      var height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");
      ctx!.drawImage(img, 0, 0, width, height);
      var dataurl = canvas.toDataURL("image/png");

      imageCount.value = imageCount.value + 1
      editor.chain().focus().setImage({ src: dataurl, alt: imageCount.value.toString() }).run()
    }
    img.src = e.target!.result as any;

  }
  reader.readAsDataURL(file);
}


function addImage() {

  imageSelect.value.click();

  // if (url) {
  //   editor.chain().focus().setImage({ src: url }).run()
  // }
}

onMounted(() => {
  editor.chain().selectAll().setFontSize('20pt').run()

})

onBeforeUnmount(() => {

})

</script>

<template>
  <div class="wrapper">
    <div class="wrapper-inner">

      <div class="editor">

        <div class="buttons-editor">
          <div class="post-title-wrapper">
            <input class="post-title" />
          </div>
          <div class="buttons">
            <div class="character">

              <button class="bold" :class="{ 'is-active': editor!.isActive('bold') }"
                @click="editor!.chain().focus().toggleBold().run()">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em"
                  viewBox="0 -40 384 524"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                  <path
                    d="M0 64C0 46.3 14.3 32 32 32H80 96 224c70.7 0 128 57.3 128 128c0 31.3-11.3 60.1-30 82.3c37.1 22.4 62 63.1 62 109.7c0 70.7-57.3 128-128 128H96 80 32c-17.7 0-32-14.3-32-32s14.3-32 32-32H48V256 96H32C14.3 96 0 81.7 0 64zM224 224c35.3 0 64-28.7 64-64s-28.7-64-64-64H112V224H224zM112 288V416H256c35.3 0 64-28.7 64-64s-28.7-64-64-64H224 112z" />
                </svg>
              </button>
              <button class="italic" :class="{ 'is-active': editor!.isActive('italic') }"
                @click="editor!.chain().focus().toggleItalic().run()">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em"
                  viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                  <path
                    d="M128 64c0-17.7 14.3-32 32-32H352c17.7 0 32 14.3 32 32s-14.3 32-32 32H293.3L160 416h64c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H90.7L224 96H160c-17.7 0-32-14.3-32-32z" />
                </svg> </button>
              <button class="strike" :class="{ 'is-active': editor!.isActive('strike') }"
                @click="editor!.chain().focus().toggleStrike().run()">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em"
                  viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                  <path
                    d="M161.3 144c3.2-17.2 14-30.1 33.7-38.6c21.1-9 51.8-12.3 88.6-6.5c11.9 1.9 48.8 9.1 60.1 12c17.1 4.5 34.6-5.6 39.2-22.7s-5.6-34.6-22.7-39.2c-14.3-3.8-53.6-11.4-66.6-13.4c-44.7-7-88.3-4.2-123.7 10.9c-36.5 15.6-64.4 44.8-71.8 87.3c-.1 .6-.2 1.1-.2 1.7c-2.8 23.9 .5 45.6 10.1 64.6c4.5 9 10.2 16.9 16.7 23.9H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H270.1c-.1 0-.3-.1-.4-.1l-1.1-.3c-36-10.8-65.2-19.6-85.2-33.1c-9.3-6.3-15-12.6-18.2-19.1c-3.1-6.1-5.2-14.6-3.8-27.4zM348.9 337.2c2.7 6.5 4.4 15.8 1.9 30.1c-3 17.6-13.8 30.8-33.9 39.4c-21.1 9-51.7 12.3-88.5 6.5c-18-2.9-49.1-13.5-74.4-22.1c-5.6-1.9-11-3.7-15.9-5.4c-16.8-5.6-34.9 3.5-40.5 20.3s3.5 34.9 20.3 40.5c3.6 1.2 7.9 2.7 12.7 4.3l0 0 0 0c24.9 8.5 63.6 21.7 87.6 25.6l0 0 .2 0c44.7 7 88.3 4.2 123.7-10.9c36.5-15.6 64.4-44.8 71.8-87.3c3.6-21 2.7-40.4-3.1-58.1H335.1c7 5.6 11.4 11.2 13.9 17.2z" />
                </svg> </button>
              <button class="fontsize" @click="sizesOpen = !sizesOpen">
                {{ FontSizeShow }}


                <transition name="subStyle">

                  <div class="sizes" v-if="sizesOpen" v-click-away="sizeClickAway">
                    <div @click="editor!.chain().focus().setFontSize('18pt').run(); FontSizeShow = '18pt'"
                      :class="{ 'is-active': editor!.isActive('textStyle', { fontSize: '18pt' }) }">
                      18pt
                    </div>
                    <div @click="editor!.chain().focus().setFontSize('20pt').run(); FontSizeShow = '20pt'"
                      :class="{ 'is-active': editor!.isActive('textStyle', { fontSize: '20pt' }) }">
                      20pt
                    </div>
                    <div @click="editor!.chain().focus().setFontSize('24pt').run(); FontSizeShow = '24pt'"
                      :class="{ 'is-active': editor!.isActive('textStyle', { fontSize: '24pt' }) }">
                      24pt
                    </div>

                  </div>
                </transition>
              </button>

            </div>

            <div class="alignment">

              <button @click="editor.chain().focus().setTextAlign('left').run()"
                :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em"
                  viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                  <path
                    d="M288 64c0 17.7-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32H256c17.7 0 32 14.3 32 32zm0 256c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H256c17.7 0 32 14.3 32 32zM0 192c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
                </svg>
              </button>
              <button @click="editor.chain().focus().setTextAlign('center').run()"
                :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em"
                  viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                  <path
                    d="M352 64c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32H320c17.7 0 32-14.3 32-32zm96 128c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 448c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM352 320c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32H320c17.7 0 32-14.3 32-32z" />
                </svg>
              </button>
              <button @click="editor.chain().focus().setTextAlign('right').run()"
                :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em"
                  viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                  <path
                    d="M288 64c0 17.7-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32H256c17.7 0 32 14.3 32 32zm0 256c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H256c17.7 0 32 14.3 32 32zM0 192c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
                </svg>
              </button>
              <button @click="editor.chain().focus().setTextAlign('justify').run()"
                :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em"
                  viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                  <path
                    d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" />
                </svg>
              </button>

            </div>

            <div class="paragraph">

              <button class="heading" :class="{ 'is-active': editor!.isActive('heading', { level: 1 }) }"
                @click="toggleHeading1">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em"
                  viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                  <path
                    d="M0 64C0 46.3 14.3 32 32 32H80h48c17.7 0 32 14.3 32 32s-14.3 32-32 32H112V208H336V96H320c-17.7 0-32-14.3-32-32s14.3-32 32-32h48 48c17.7 0 32 14.3 32 32s-14.3 32-32 32H400V240 416h16c17.7 0 32 14.3 32 32s-14.3 32-32 32H368 320c-17.7 0-32-14.3-32-32s14.3-32 32-32h16V272H112V416h16c17.7 0 32 14.3 32 32s-14.3 32-32 32H80 32c-17.7 0-32-14.3-32-32s14.3-32 32-32H48V240 96H32C14.3 96 0 81.7 0 64z" />
                </svg>1</button>
              <button class="heading" :class="{ 'is-active': editor!.isActive('heading', { level: 2 }) }"
                @click="toggleHeading2">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em"
                  viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                  <path
                    d="M0 64C0 46.3 14.3 32 32 32H80h48c17.7 0 32 14.3 32 32s-14.3 32-32 32H112V208H336V96H320c-17.7 0-32-14.3-32-32s14.3-32 32-32h48 48c17.7 0 32 14.3 32 32s-14.3 32-32 32H400V240 416h16c17.7 0 32 14.3 32 32s-14.3 32-32 32H368 320c-17.7 0-32-14.3-32-32s14.3-32 32-32h16V272H112V416h16c17.7 0 32 14.3 32 32s-14.3 32-32 32H80 32c-17.7 0-32-14.3-32-32s14.3-32 32-32H48V240 96H32C14.3 96 0 81.7 0 64z" />
                </svg>2</button>
              <button class="parapgraph" :class="{ 'is-active': editor!.isActive('parapgraph') }"
                @click="editor!.chain().focus().setParagraph().run()">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em"
                  viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                  <path
                    d="M192 32h64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H384l0 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-352H288V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V352H192c-88.4 0-160-71.6-160-160s71.6-160 160-160z" />
                </svg> </button>
              <button class="blockquote" :class="{ 'is-active': editor!.isActive('blockquote') }"
                @click="editor!.chain().focus().toggleBlockquote().run()">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em"
                  viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                  <path
                    d="M448 296c0 66.3-53.7 120-120 120h-8c-17.7 0-32-14.3-32-32s14.3-32 32-32h8c30.9 0 56-25.1 56-56v-8H320c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v32 32 72zm-256 0c0 66.3-53.7 120-120 120H64c-17.7 0-32-14.3-32-32s14.3-32 32-32h8c30.9 0 56-25.1 56-56v-8H64c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v32 32 72z" />
                </svg>
              </button>
            </div>
            <button @click="imageSelect.click();">
              <input type="file" ref="imageSelect" hidden @change="onFileSelect">
              <svg xmlns="http://www.w3.org/2000/svg" height="1em"
                viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                <path
                  d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
              </svg>
            </button>

          </div>
          <div class="editor">
            <editor-content class="editor__tiptap" v-model="postContent" :editor="editor" />
          </div>
        </div>
        <Calendar :postContent="postContent" />

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  padding-top: 70px;

  .image {
    img {
      width: 300px;
    }
  }

  .wrapper-inner {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-top: 50px;
    padding: 50px;
  }



  .editor {
    width: 100%;
    display: flex;
    font-family: Roboto Condensed;
    font-size: 3rem;
    color: var(--color-nav-txt);
    gap: 50px;
    display: flex;


    .editor__tiptap {
      position: relative;
      width: 100%;
      padding: 20px;
      background-color: var(--color-nav-bg);
      color: var(--color-text);
      border-radius: 5px;

      &:focus-visible {
        outline: none
      }
    }

    .buttons-editor {
      position: relative;
      width: 80%;
      display: flex;
      flex-direction: column;
      gap: 20px;

      .post-title-wrapper {
        position: relative;
        width: 100%;
        margin: 0;
        padding: 0;
        height: 50px;
        display: flex;

        input,
        textarea {
          background-color: var(--color-nav-bg);
          color: var(--color-nav-txt-darker);
        }

        textarea:focus,
        input:focus {
          outline: 2px solid var(--color-nav-bg);
        }

        input {
          width: 100%;
          border-radius: 5px;
          font-size: 2rem;
        }
      }

      .buttons {
        position: relative;
        display: flex;
        border-radius: 5px;
        gap: 50px;
        border: 5px solid var(--color-nav-bg);
        padding: 5px;
        background-color: var(--color-nav-bg);

        .character {
          position: relative;
          display: flex;
          height: 100%;
          gap: 4px;

          .fontsize {
            position: relative;
            display: flex;
            align-items: center;
            font-size: 1.5rem;
            justify-content: center;

            .sizes {
              box-shadow: 2px 3px 5px 2px rgba(0, 0, 0, 0.363);
              z-index: 100;
              left: 0;
              display: flex;
              flex-direction: column;
              top: 100%;
              border-radius: 5px;
              margin-top: 5px;
              overflow: hidden;
              position: absolute;
              color: var(--color-nav-txt);

              div {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: var(--color-nav-bg);
                padding: 15px;

                &:hover {
                  background-color: var(--color-nav-txt);
                  color: var(--color-nav-bg)
                }
              }

            }
          }

        }

        .alignment {
          position: inherit;
          display: flex;
          gap: 5px;
        }

        .paragraph {
          position: relative;
          height: 100%;
          display: flex;
          gap: 5px;
        }
      }


      button {
        font-family: Roboto Condensed;
        background-color: var(--color-nav-bg);
        font-weight: 900;
        font-size: 1rem;
        border-radius: 5px;
        cursor: pointer;
        color: var(--color-nav-txt-darker);
        line-height: 15px;
        padding: 10px;
        border: 1px solid transparent;
        box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.363);
        transition: all 0.1s ease-in-out;

        svg {
          height: 25px;
          width: 25px;
          transition: all 0.1s ease-in-out;
        }

        &:hover {
          background-color: var(--color-nav-bg-darker);
        }

        &:focus {
          border: 1px solid var(--color-nav-bg);

          svg {
            fill: var(--color-nav-txt);
          }
        }

        &.is-active {
          box-shadow: inset 0px 1px 2px 1px rgba(0, 0, 0, 0.363);
          background-color: var(--color-nav-bg-darker);
          color: var(--color-nav-txt);

          svg {
            fill: var(--color-nav-txt);
          }
        }

        svg {
          fill: var(--color-nav-txt-darker);
        }
      }
    }
  }
}
  
.editor__tiptap {
  position: relative;
  height: 400px;
  font-family: Roboto Condensed;
  font-size: 20pt;
  overflow-y: auto;
}

.editor__tiptap::-webkit-scrollbar {
  width: 20px;
  border-radius: 10px;
}

.editor__tiptap::-webkit-scrollbar-track {
  box-shadow: inset 0 0 10px 10px var(--color-nav-bg-darker);
  border: solid 5px transparent;
  border-radius: 10px;
}

.editor__tiptap::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 10px 10px var(--color-nav-txt-darker);
  border: solid 5px transparent;
  border-radius: 10px;
}

.editor__tiptap:deep(.ProseMirror-focused) {
  outline: none;
}

.editor__tiptap:deep(.ProseMirror) {
  height: 100%;

}

.editor__tiptap:deep(blockquote) {
  position: relative;
  padding-left: 2rem;
  font-size: 1.7rem;
  padding: 20px;

  &::before {
    position: absolute;
    left: 0;
    top: 20px;
    content: '';
    width: 10px;
    height: 100%;
    display: flex;
    background-color: rgba(0, 69, 90, 0.26);
    border-radius: 10px;
  }
}

.editor__tiptap:deep(img) {
  height: auto;
  display: flex;
}

.editor__tiptap:deep(img):hover {
  cursor: pointer;
}

.edito__tiptap:deep(img):hover {
  width: 600px;
  height: auto
}

.subStyle-enter-active,
.subStyle-leave-active {
  transform: translateY(0px);
  opacity: 1;
  transition: all 0.1s;
}

.subStyle-enter-from,
.subStyle-leave-to {
  transform: translateY(-4px);
  opacity: 0;
}
</style>
