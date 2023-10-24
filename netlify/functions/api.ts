import express, {Router} from "express";
import "dotenv/config";
import ViteExpress from "vite-express";
import authRoutes from "../../src/server/routes/authRoutes";
import bodyParser from "body-parser";
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const serverless = require("serverless-http");

const app = express();
const router = Router();
const mongoURI = process.env.MONGO_URI;
const database = mongoose.connection;
database.on("error", (error: any) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});
ViteExpress.config({ mode: "production" });

ViteExpress.listen(app, 2258, () =>
  console.log("Server is listening on http://localhost:2258")
);

router.get("/hello", (req, res) => res.send("gdgfd!"));
router.get("/test2", (req, res) => res.send("fkyou"));

mongoose.connect(mongoURI);
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: "10mb" }));
app.use(cookieParser());
app.use("/api", authRoutes);

module.exports.handler = serverless(app);
