import express from "express";
import {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume
} from "../controllers/resume.controller.js";

const router = express.Router();

router.post("/", createResume);

router.get("/user/:email", getUserResumes); // TODO create a middleware for this route to check if the user is authenticated and authorized to access their resumes

router.get("/:resumeId", getResumeById);

router.patch("/:resumeId", updateResume);

router.put("/:resumeId/skills", updateSkills);

router.put("/:resumeId/experiences", updateExperiences);

router.put("/:resumeId/education", updateEducation);

export default router;