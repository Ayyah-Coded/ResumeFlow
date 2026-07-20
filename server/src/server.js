import "dotenv/config";
import cors from 'cors';
import express from "express";

import aiRoutes from "./routes/ai.routes.js";
import { clerkMiddleware } from "@clerk/express";
import resumeRoutes from "./routes/resume.routes.js";


const app = express();
app.use(express.json());
app.use(clerkMiddleware());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

app.use("/api/ai", aiRoutes);

app.use("/api/resumes", resumeRoutes);

 app.use((_req, res) => {
    res.status(404).json({ message: "Not Found" });
  })

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});