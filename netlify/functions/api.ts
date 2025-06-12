import express from "express";
import serverless from "serverless-http";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import appRoutes from "../../src/server/routes/appRoutes";

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cookieParser());

let isConnected = false;
const mongoURI = process.env.MONGO_URI;

async function connectToDatabase() {
  if (isConnected || mongoose.connection.readyState === 1) return;
  if (!mongoURI) throw new Error("Missing MONGO_URI");

  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 3000 });
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err: any) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
}

// Ensure Mongo is connected before handling any routes
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Mount routes
router.use("/", appRoutes);

// Dynamic base path
const isNetlify = process.env.NETLIFY === "true";
const basePath = isNetlify ? "/.netlify/functions/api" : "/api";

app.use(basePath, router);

// Test route (still accessible at /api/test locally)
app.get("/test", (_, res) => {
  res.json({ message: "✅ Works in dev + prod" });
});

// Fallback 404
app.use("*", (req, res) => {
  res.status(404).json({ error: "Not found", path: req.path });
});

export const handler = serverless(app);
