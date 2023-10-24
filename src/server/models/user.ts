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

const userSettingsModel = new mongoose.Schema({
  autoLogin: Boolean,
  themeCheck: Boolean,
  themeName: String,
  readPosts: Boolean,
});

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
    userSettings: userSettingsModel,
    savedPost: Object,
  },
  { collection: "users" }
);

const userAuth = mongoose.model("authModel", authModel);
const User = mongoose.model("User", userModel);

export { User, userAuth };
