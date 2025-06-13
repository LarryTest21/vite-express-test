// api.ts
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

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB connection
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

// Health check route
router.get("/test", (_, res) => {
  res.json({ message: "✅ Express API is live on Netlify!" });
});
router.get("/ping", (_, res) => {
  res.json({ ok: true });
});
// Mount your actual API routes
router.get("/", (_, res) => {
  res.json({ message: "🎉 API root is reachable!" });
});
router.use("/api", appRoutes);
app.use((req, res, next) => {
  console.log("🔎 Incoming:", req.method, req.url);
  next();
});
// Netlify-compatible base path
const basePath = process.env.NETLIFY ? "/.netlify/functions/api" : "/api";
app.use(basePath, router);

// Export the handler
export const handler = serverless(app);
