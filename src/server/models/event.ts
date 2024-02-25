import mongoose from "mongoose";

const eventModel = new mongoose.Schema(
  {
    eventTitle: {
      type: String,
    },
    eventImage: {
      type: String,
    },
    eventCategory: {
      type: Array,
    },
    eventContent: {
      type: String,
    },
    eventDate: {
      type: String,
    },
  },
  { collection: "events" }
);

const eventPost = mongoose.model("eventPost", eventModel);

export { eventPost };
