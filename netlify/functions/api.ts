// netlify/functions/api.ts
import express from "express";
import serverless from "serverless-http";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import appRoutes from "../../src/server/routes/appRoutes";
console.log("✨ API function handler running");

const app = express();
const router = express.Router();
const MONGO_URI = process.env.MONGO_URI;
let isConnected = false;

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log("🔎 Incoming:", req.method, req.url);
  next();
});

// MongoDB connection logic
async function connectToDatabase() {
  if (isConnected) return;
  if (!MONGO_URI) throw new Error("Missing MONGO_URI");

  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  isConnected = true;
  console.log("✅ Connected to MongoDB");
}

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error("❌ MongoDB error:", err);
    res.status(500).send("Database connection error");
  }
});

// 🔹 Root route - confirms API is alive
router.get("/", (_, res) => {
  res.json({
    message: "🎉 Hello from Netlify Functions!",
    timestamp: new Date().toISOString(),
    tip: "You're successfully hitting your serverless API. Now plug in your routes!"
  });
});

// 🔹 Test routes
router.get("/test", (_, res) => res.json({ message: "✅ API working!" }));
router.get("/ping", (_, res) => res.json({ pong: true }));

// 🔹 App routes
router.use("/api", appRoutes);

// 🔹 Set base path for Netlify
const basePath = process.env.NETLIFY ? "/.netlify/functions/api" : "/api";
app.use(basePath, router);

// 🔹 Export the Netlify function handler
export const handler = serverless(app);
