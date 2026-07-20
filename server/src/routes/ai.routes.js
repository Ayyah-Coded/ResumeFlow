import express from "express";
import { generateSummary } from "../controllers/ai.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post(
  "/summary",
  requireAuth,
  generateSummary
);

export default router;