import { ref, watch } from "vue";
import type { Ref } from 'vue';
import { userData } from "../../store/userData";

const isItRunning = ref(false) as any;
const readDotFunction = (
  messageArray: any,
  chatUserData: any,
  ifNewChat: boolean
) => {
  if (ifNewChat) {
    if (messageArray !== undefined) {
      const lastRead = messageArray.findLast(
        (message: any) =>
          message.read === true && message.senderID != chatUserData._id
      );

      if (lastRead != undefined) {
        lastRead.lastMsg = true;
      }

      const deleteReads = messageArray.forEach((message: any) => {
        if (
          message.read &&
          message.senderID != chatUserData._id &&
          message.lastMsg != true
        ) {
          delete message.read;
        }
      });

      const lastUnread = messageArray.findLast(
        (message: any) =>
          message.read === false && message.senderID != chatUserData._id
      );
      if (lastUnread != undefined) {
        lastUnread.lastMsg = true;
      }
      const deleteUnreads = messageArray.forEach((message: any) => {
        if (
          message.read === false &&
          message.senderID != chatUserData._id &&
          message.lastMsg != true
        ) {
          delete message.read;
        }
      });
    }
  } else if (!ifNewChat) {
    // if (isItRunning.value == false) {
    //   isItRunning.value = true;
    //   const promise = new Promise(function (resolve) {
    //     if (chatUserData.isConnected) {
    //       const lastUnRead = messageArray
    //         .map((message: any) => message.showUnRead)
    //         .lastIndexOf(true);
    //       if (lastUnRead != -1) {
    //         delete messageArray[lastUnRead].showUnRead;
    //       }
    //       const newUnRead = messageArray
    //         .map((message: any) => message.showUnRead)
    //         .lastIndexOf(true);
    //       messageArray[messageArray.length - 1].showUnRead = true;
    //       return resolve('success');
    //     } else {
    //       console.log('test');
    //       const deletePreviousUnRead = messageArray
    //         .map((message: any) => message.showUnRead)
    //         .lastIndexOf(true);
    //       if (deletePreviousUnRead != -1) {
    //         delete messageArray[deletePreviousUnRead].showUnRead;
    //         delete messageArray[deletePreviousUnRead].lastMsg;
    //       }
    //       const newMsg = messageArray
    //         .map((message: any) => message.sendTo)
    //         .lastIndexOf(chatUserData._id);
    //       if (newMsg != -1) {
    //         messageArray[newMsg].lastMsg = true;
    //         messageArray[newMsg].showUnRead = true;
    //       }
    //       return resolve('success');
    //     }
    //   });
    //   promise.then(() => {
    //     isItRunning.value = false;
    //   });
    // }
  }
};

export default readDotFunction;
