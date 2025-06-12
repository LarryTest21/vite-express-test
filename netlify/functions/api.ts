import express from "express";
import serverless from "serverless-http";
const app = express();
const router = express.Router(); // Define routes inside the router 
app.use("/api", router);

const basePath = process.env.NETLIFY ? "/.netlify/functions/api" : "/api";

router.get("/test", (_, res) => { res.json({ message: "✅ Express function works!" }); });

app.use(basePath, router);

export const handler = serverless(app);
