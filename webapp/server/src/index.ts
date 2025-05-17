// src/server/index.ts
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth";
import connectionRoutes from "./routes/connections";
import eventsRouter from "./routes/events";

// Load environment variables
dotenv.config();

const app = express();
// const PORT = process.env.PORT || 5000;
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/events", eventsRouter);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/identityx")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
