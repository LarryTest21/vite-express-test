// netlify/functions/api.ts
import express from "express";
import serverless from "serverless-http";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import appRoutes from "../../src/server/routes/appRoutes";

const MONGO_URI = process.env.MONGO_URI;
let isConnected = false;
let cachedHandler: ReturnType<typeof serverless> | null = null;

async function connectToDatabase() {
  if (isConnected) return;
  if (!MONGO_URI) throw new Error("❌ Missing MONGO_URI");

  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  isConnected = true;
  console.log("✅ Connected to MongoDB");
}

async function getHandler() {
  if (cachedHandler) return cachedHandler;

  console.log("🚀 Bootstrapping API handler...");
  const app = express();
  const router = express.Router();
  const basePath = process.env.NETLIFY ? "/.netlify/functions/api" : "/api";

  // Middleware
  app.use(cors({ origin: "*", credentials: true }));
  app.use(bodyParser.json({ limit: "100mb" }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(async (req, res, next) => {
    console.log("🔎 Incoming:", req.method, req.url);
    try {
      await connectToDatabase();
      next();
    } catch (err) {
      console.error("❌ MongoDB error:", err);
      res.status(500).send("Database connection error");
    }
  });

  // Root route confirmation
  router.get("/", (_, res) => {
    console.log("🎯 Root route hit");
    res.json({
      message: "🎉 Hello from Netlify Functions!",
      timestamp: new Date().toISOString(),
      tip: "You're successfully hitting your serverless API!"
    });
  });

  // Health checks
  router.get("/ping", (_, res) => res.json({ pong: true }));
  router.get("/test", (_, res) => res.json({ status: "✅ API is alive" }));

  // Mount actual API routes
  router.use("/api", appRoutes);

  // Fallback for unmatched routes
  router.use((req, res) => {
    console.log("❌ No matching route:", req.method, req.url);
    res.status(404).json({ error: "Route not found" });
  });

  app.use(basePath, router);

  cachedHandler = serverless(app);
  return cachedHandler;
}

// Export Netlify Function handler
export const handler = async (event:any, context:any) => {
  const handler = await getHandler();
  return handler(event, context);
};
