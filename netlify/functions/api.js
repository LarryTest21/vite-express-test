import serverless from "serverless-http";
import express from "express";


const app = express();

app.use("/api", (_, res) => {
  res.json({ message: "✅ Works in dev + prod" });
});


export const handler = serverless(app);
