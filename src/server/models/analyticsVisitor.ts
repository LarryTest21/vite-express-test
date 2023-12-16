import mongoose from "mongoose";

const visitorsAnalyticsModel = new mongoose.Schema(
  {
    allVisitors: {
      type: Number, 
    },
  },
  { collection: "analytics" }
);

const visitorsAnalytics = mongoose.model("visitorsAnalytics", visitorsAnalyticsModel);

export { visitorsAnalytics };
