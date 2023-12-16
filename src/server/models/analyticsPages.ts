import mongoose from "mongoose";


const pagesAnalyticsModel = new mongoose.Schema(
  {
    pagesAllViews:
    {
      type:Object
    },
  },
  { collection: "analytics" }
);

const pagesAnalytics = mongoose.model("pagesAnalytics", pagesAnalyticsModel);

export { pagesAnalytics };
