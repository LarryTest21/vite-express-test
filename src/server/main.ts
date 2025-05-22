import serverless from "serverless-http";
import express, { Router } from "express";
import ViteExpress from "vite-express";
import 'dotenv/config'
import authRoutes from "../../src/server/routes/appRoutes"
import bodyParser from "body-parser"
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')

const app = express();

const mongoURI = process.env.MONGO_URI;
const database = mongoose.connection;
database.on('error', (error: any) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})


mongoose.connect(mongoURI)
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '100mb' }));
app.use(cookieParser())


app.use('/api', authRoutes)


export const handler = serverless(app);
