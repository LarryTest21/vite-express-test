import serverless from "serverless-http";
import express, { Router } from "express";
import ViteExpress from "vite-express";
import 'dotenv/config';
import appRoutes from "../src/server/routes/appRoutes";
import chatRouter from "../src/server/chatControllers/mainChat";

import bodyParser from "body-parser";
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();

const mongoURI = process.env.MONGO_URI;
const database = mongoose.connection;
database.on('error', (error: any) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});
mongoose.connect(mongoURI);

const viteServer = ViteExpress.listen(app, 3333, () => {
  console.log("Server started");
});

chatRouter(viteServer);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser());

app.use('/api', appRoutes);

export const handler = serverless(app);
