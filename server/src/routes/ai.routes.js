import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { generateExperienceContent, generateSummary, getAiUsageStatus } from "../controllers/ai.controller.js";


const router = express.Router();

router.post(
  "/summary",
  requireAuth,
  generateSummary
);

router.get(
  "/usage",
  requireAuth,
  getAiUsageStatus
);

router.post(
  "/experience",
  requireAuth,
  generateExperienceContent
);

export default router;