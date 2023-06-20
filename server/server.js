import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import Stripe from "stripe";
import mongoose from "mongoose";
import { auth } from "./src/firebase-config.js";
import ngoRoutes from "./src/routes/ngoRoute.js";
import authRoutes from "./src/routes/authRoute.js";
import stripeRoutes from "./src/routes/stripeRoute.js";
import userRoutes from "./src/routes/userRoute.js";

const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
const server = http.createServer(app);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

app.use(async (req, res, next) => {
  try {
    console.log("Headers", req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.sendStatus(400);
    }
    const verifyToken = await auth.verifyIdToken(token);
    const { email, uid } = verifyToken;
    req.body = { ...req.body, email, uid };
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Routes
app.use("/api/ngo", ngoRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", stripeRoutes);

// Connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`connected to db and listening on port', ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
