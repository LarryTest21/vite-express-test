const express = require("express");
const serverless = require("serverless-http");
const mongoose = require("mongoose");

let isConnected = false;
const app = express();

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

// Define routes after DB connects
app.get("/", async (req, res) => {
  await connectToDatabase();
  res.send("API is running with MongoDB");
});

module.exports.handler = serverless(app);
