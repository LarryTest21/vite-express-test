import { sensitiveHeaders } from "http2";
import mongoose from "mongoose";

const messagesChildModel = new mongoose.Schema(
  {
    senderID: String,
    sendTo: String,
    message: String,
    date: Date,
    emojis: Array,
    read: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "messages" }
);

const messagesParenthModel = new mongoose.Schema(
  {
    convParticipants: {
      Type: Array,
    },
    messages: [messagesChildModel],
  },
  { collection: "messages" }
);

const messagesChild = mongoose.model("messagesChildModel", messagesChildModel);

const messagesParent = mongoose.model(
  "messagesParenthModel",
  messagesParenthModel
);

export { messagesParent, messagesChild };
