import serverless from "serverless-http";
import express, { Router } from "express";
import 'dotenv/config'
import authRoutes from "../../src/server/routes/appRoutes"
import bodyParser from "body-parser"
import mongoose from "mongoose";

const cookieParser = require('cookie-parser')

const app = express();

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  throw new Error('Missing MONGO_URI in environment variables');
}

const database = mongoose.connection;
database.on('error', console.error);
database.once('connected', () => {
    console.log('Database Connected');
});


mongoose.connect(mongoURI)
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser())


app.use('/', authRoutes)
app.get('/test', (_, res) => {
  res.json({ message: 'Function is working!' });
});
app.get('/', (req, res) => {
  res.send('API root is working!');
});


export const handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Netlify!' }),
  };
};