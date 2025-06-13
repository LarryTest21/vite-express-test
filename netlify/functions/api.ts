// netlify/functions/api.ts
import express from "express";
import serverless from "serverless-http";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import appRoutes from "../../src/server/routes/appRoutes";

const app = express();
const router = express.Router();
const MONGO_URI = process.env.MONGO_URI;
let isConnected = false;

// ✅ Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(async (req, res, next) => {
  console.log("🔎 Incoming:", req.method, req.url);
  try {
    if (!isConnected) {
      if (!MONGO_URI) throw new Error("Missing MONGO_URI");
      console.log("🔌 Connecting to MongoDB...");
      await mongoose.connect(MONGO_URI);
      isConnected = true;
      console.log("✅ Connected to MongoDB");
    }
    next();
  } catch (err) {
    console.error("❌ MongoDB error:", err);
    res.status(500).send("Database connection error");
  }
});

// ✅ Routes
router.get("/", (_, res) => {
  console.log("🎯 Root route hit");
  res.json({
    message: "🎉 Hello from Netlify Functions!",
    timestamp: new Date().toISOString()
  });
});

router.get("/test", (_, res) => {
  res.json({ status: "✅ Test route alive" });
});

router.use("/api", appRoutes);

// 🔚 Catch-all 404
router.use((req, res) => {
  console.log("❌ No matching route:", req.method, req.url);
  res.status(404).json({ error: "Route not found" });
});

// ✅ Mount router under function base path
const basePath = process.env.NETLIFY ? "/.netlify/functions/api" : "/api";
app.use(basePath, router);

// ✅ Export serverless handler
export const handler = serverless(app);
