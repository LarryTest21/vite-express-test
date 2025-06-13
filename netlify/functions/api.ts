// netlify/functions/api.ts
import express from "express";
import serverless from "serverless-http";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import appRoutes from "../../src/server/routes/appRoutes";

const app = express();
const MONGO_URI = process.env.MONGO_URI;
let isConnected = false;

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Mongo connection
app.use(async (req, res, next) => {
  try {
    if (!isConnected) {
      if (!MONGO_URI) throw new Error("❌ Missing MONGO_URI");
      console.log("🔌 Connecting to MongoDB...");
      await mongoose.connect(MONGO_URI);
      isConnected = true;
      console.log("✅ Connected to MongoDB");
    }
    next();
  } catch (err) {
    console.error("❌ MongoDB error:", err);
    res.status(500).send("Database error");
  }
});

// Log every incoming request
app.use((req, res, next) => {
  console.log("🔎 Incoming:", req.method, req.url);
  next();
});

// Routing
const basePath = process.env.NETLIFY ? "/.netlify/functions/api" : "/api";
app.get(`${basePath}/`, (_, res) =>
  res.json({ hello: "🌍 Netlify API root is alive!" })
);
app.get(`${basePath}/test`, (_, res) =>
  res.json({ status: "✅ Test route active" })
);
app.use(`${basePath}/api`, appRoutes);

// 404 fallback
app.use((req, res) => {
  console.log("❌ Unmatched route:", req.method, req.url);
  res.status(404).json({ error: "Route not found" });
});

// Export final persistent handler
export const handler = serverless(app);
