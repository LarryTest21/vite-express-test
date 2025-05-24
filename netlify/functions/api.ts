const serverless = require("serverless-http");
const express = require("express");
import "dotenv/config";
import authRoutes from "../../src/server/routes/appRoutes";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
let isConnected = false;
const mongoURI = process.env.MONGO_URI;

async function connectToDatabase() {
  if (isConnected) return;
  if (!mongoURI) throw new Error("Missing MONGO_URI");

  console.log("🔌 Attempting to connect to MongoDB...");
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
}
await connectToDatabase();


app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: "10mb" }));
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use("/api", authRoutes);
app.get("/api/test", (_, res) => {
  res.json({ message: "Function is working!" });
});
app.get("/api", (req, res) => {
  res.send("API root is ww!");
});

module.exports.handler = serverless(app);
