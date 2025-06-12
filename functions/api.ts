import express from "express";
import serverless from "serverless-http";
import appRoutes from "../src/server/routes/appRoutes";
import bodyParser from "body-parser"



const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')

const app = express();
const router = express.Router(); // Define routes inside the router 
const mongoURI = process.env.MONGO_URI;
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '100mb' }));
app.use(cookieParser())


let isConnected = false;


async function connectToDatabase() {
  if (isConnected) return;
  if (!mongoURI) throw new Error("Missing MONGO_URI");

  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(mongoURI);
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

router.get("/test", (_, res) => { res.json({ message: "✅ Express function works!" }); });

app.use('/.netlify/functions/api', router);
router.use("/", appRoutes);
export const handler = serverless(app);
