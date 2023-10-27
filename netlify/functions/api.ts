import serverless from "serverless-http";
import express, { Router } from "express";
import ViteExpress from "vite-express";

const api = express();


const router = Router();


router.get("/hello", (req, res) => res.send("Hello World!"));


ViteExpress.config({ mode: "production" })

ViteExpress.listen(api, 5173, () =>
    console.log("Server is listening on http://localhost:5173"))

api.use("/api", router);

export const handler = serverless(api);
