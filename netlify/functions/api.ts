import express, { Router } from "express";
import serverless from "serverless-http";






import 'dotenv/config'
import ViteExpress from "vite-express";
import authRoutes from "../../src/server/routes/authRoutes"
import bodyParser from "body-parser"
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')






const api = express();

const router = Router();
router.get("/hello", (req, res) => res.send("Hello World!"));
router.post("/test2", (req, res) => res.status(202).send("Hello World!"));

api.use("/api/", router);


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


ViteExpress.listen(app, 2258, () =>
    console.log("Server is listening on http://localhost:2258"))

mongoose.connect(mongoURI)
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser())
app.use('/api', authRoutes)




export const handler = serverless(api);