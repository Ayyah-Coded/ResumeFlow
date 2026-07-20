import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";

import {
  createResume, getUserResumes, getResumeById, updateResume,
  updateSkills, updateExperiences, updateEducation, deleteResume,
} from "../controllers/resume.controller.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", createResume);

router.get("/", getUserResumes);

router.get("/:resumeId", getResumeById);

router.patch("/:resumeId", updateResume);

router.put("/:resumeId/skills", updateSkills);

router.put("/:resumeId/experiences", updateExperiences);

router.put("/:resumeId/education", updateEducation);

router.delete("/:resumeId", deleteResume);

export default router;