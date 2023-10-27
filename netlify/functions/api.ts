import serverless from "serverless-http";
import express, { Router } from "express";
import authRoutes from "../../src/server/routes/authRoutes";

const app = express();

// database connection

const router = Router();
router.get("/hello", (req, res) => res.send("Hello World!"));

app.use("/api", router);

export const handler = serverless(app);
