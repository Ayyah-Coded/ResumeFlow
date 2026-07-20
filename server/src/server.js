import "dotenv/config";
import cors from 'cors';
import express from "express";

import { clerkMiddleware } from "@clerk/express";
import resumeRoutes from "./routes/resume.routes.js";


const app = express();
app.use(express.json());
app.use(clerkMiddleware());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});


app.use("/api/resumes", resumeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});