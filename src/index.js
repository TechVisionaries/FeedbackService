import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import feedbackRoutes from "./routes/feedback.route.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Service is healthy" });
});

app.use("/api/feedbacks", feedbackRoutes);

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
