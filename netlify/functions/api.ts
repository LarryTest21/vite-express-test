// import express, { Router } from "express";
// import serverless from "serverless-http";
// import authRoutes from "../../src/server/routes/appRoutes";
// import bodyParser from "body-parser";
// import mongoose from "mongoose";
// import cookieParser from "cookie-parser";

// const app = express();
// const router = Router();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json({ limit: "10mb" }));
// app.use(cookieParser());


// let isConnected = false;
// const mongoURI = process.env.MONGO_URI;

// async function connectToDatabase() {
//   if (isConnected) return;
//   if (!mongoURI) throw new Error("Missing MONGO_URI");

//   console.log("🔌 Attempting to connect to MongoDB...");
//   try {
//     await mongoose.connect(mongoURI, {
//       serverSelectionTimeoutMS: 2000,
//     });
//     isConnected = true;
//     console.log("✅ MongoDB connected");
//   } catch (err: any) {
//     console.error("❌ MongoDB connection error:", err.message);
//     throw err;
//   }
// }


// app.use(async (req, res, next) => {
//   if (mongoose.connection.readyState !== 1) {
//     try {
//       await connectToDatabase();
//     } catch (err) {
//       return res.status(500).send("Database connection error");
//     }
//   }
//   next();
//   console.log("yes connected")
//   app.use("/api/", authRoutes );
//   app.use("/api/test", (_, res)=> {
//     res.json({message: "Works in dev"})
//   });


// });

// export const handler = serverless(app);

exports.handler = async () => ({
  statusCode: 200,
  body: JSON.stringify({ message: "✅ You are seeing the NEW version" }),
});
