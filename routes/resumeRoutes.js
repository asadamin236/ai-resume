import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createResume, getUserResumes, getResumeById, updateResume, deleteResume, duplicateResume } from "../controllers/resumeController.js";
import { uploadImages } from "../controllers/uploadImages.js";
const resumeRouter = express.Router();


resumeRouter.post("/create", protect, createResume);
resumeRouter.get("/", protect, getUserResumes);
resumeRouter.get("/:id", protect, getResumeById);
resumeRouter.put("/:id", protect, updateResume);
resumeRouter.delete("/:id", protect, deleteResume);
resumeRouter.put('/:id/upload-images', protect, uploadImages)
resumeRouter.post("/:id/duplicate", protect, duplicateResume);

export default resumeRouter;
