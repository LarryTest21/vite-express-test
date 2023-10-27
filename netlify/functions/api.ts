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






import 'dotenv/config'
import authRoutes from "../../src/server/routes/authRoutes"
import bodyParser from "body-parser"
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')

const app = express();


// database connection

const mongoURI = process.env.MONGO_URI;
const database = mongoose.connection;
database.on('error', (error: any) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

ViteExpress.config({ mode: "production" })

ViteExpress.listen(app, 5173, () =>
    console.log("Server is listening on http://localhost:5173"))

mongoose.connect(mongoURI)
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser())
app.use('/api', authRoutes)


























export const handler = serverless(app);
