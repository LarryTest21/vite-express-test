import express, { Router } from "express";
import serverless from "serverless-http";
import ViteExpress from 'vite-express'
import AuthRoutes from "../../src/server/routes/authRoutes"
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
import bodyParser from "body-parser"

const mongoURI = process.env.MONGO_URI;
const database = mongoose.connection;




const app = express();

mongoose.connect(mongoURI)
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser())
app.use('/api', AuthRoutes)

export const handler = serverless(app);

