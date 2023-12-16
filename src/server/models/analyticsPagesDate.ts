import mongoose from "mongoose";

const pagesByDayModel = new mongoose.Schema(
  {
    pagesDaily:{
        type:Object
    }
  },
  { collection: "analytics" }
);

const pagesByDay = mongoose.model("pagesByDay", pagesByDayModel);

export { pagesByDay };
