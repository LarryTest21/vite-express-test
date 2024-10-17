import mongoose from "mongoose";

const authModel = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { collection: "authentication" }
);

const userModel = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    activated: {
      required: true,
      type: Boolean,
    },
    activationToken: String,
    autoLogin: Boolean,
    clearance: String,
    createdAt: Date,
    displayName: String,
    firstName: String,
    lastName: String,
    notificationsRead: Boolean,
    profilePic: String,
    readBlog: Array,
    token: String,
    notificationArray:{
      type: Array
    },
    userSettings: {
      type: Object,
      default: {
        autoLogin: false,
        themeCheck: true,
        themeName: "theme-light",
        readPosts: false,
        notifSounds: true,
       
      }
    },
    chatFriendColor: {
      type:Object
    },
    friendsActions: {
      type: Object
    },
      
    savedPosts: Array,
  },
  { collection: "users" }
);

const userAuth = mongoose.model("authModel", authModel);
const User = mongoose.model("User", userModel);

export { User, userAuth };
