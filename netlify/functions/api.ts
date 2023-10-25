import express, {Router} from "express";
import "dotenv/config";
import ViteExpress from "vite-express";
import authRoutes from "../../src/server/routes/authRoutes";
import bodyParser from "body-parser";
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const serverless = require("serverless-http");

const api = express();
const router = Router();
const mongoURI = process.env.MONGO_URI;
const database = mongoose.connection;
database.on("error", (error: any) => {
  console.log("error in mongoose connect")
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});
ViteExpress.config({ mode: "production" });

ViteExpress.listen(api, 5173, () =>
  console.log("Server is listening on http://localhost:5173")
);

router.get("/hello", (req, res) => res.send("gdgfd!"));
router.get("/test2", (req, res) => res.send("fkyou"));

mongoose.connect(mongoURI);
api.use(bodyParser.urlencoded({ extended: true }));

api.use(bodyParser.json({ limit: "10mb" }));
api.use(cookieParser());
api.use("/api", authRoutes);

module.exports.handler = serverless(api);
