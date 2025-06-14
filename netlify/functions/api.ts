import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import appRoutes from "../../src/server/routes/appRoutes";

const app = express();
const router = express.Router();
const MONGO_URI = process.env.MONGO_URI as any;
let isConnected = false;

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB connection
app.use(async (req, res, next) => {
  try {
    if (!isConnected) {
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

// Logging
app.use((req, res, next) => {
  console.log("🔎 Incoming:", req.method, req.url);
  next();
});
router.use((req, res, next) => {
  console.log("🧭 Matched route:", req.method, req.url);
  next();
});

// Routes
router.get("/test", (_, res) => {
  res.json({ status: "✅ Test route through router works" });
});

router.use("/api", appRoutes);

router.use((req, res) => {
  console.log("❌ No matching route:", req.method, req.url);
  res.status(404).json({ error: "Not found" });
});

// 🚨 Mount router at "/" — NOT basePath — Netlify handles that
app.use("/", router);

// Export handler
export const handler = serverless(app);
