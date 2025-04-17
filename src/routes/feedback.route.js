import express from "express";
import { body } from "express-validator";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  addFeedback,
  getFeedbackByDoctor,
  deleteFeedback,
} from "../controllers/feedback.controller.js";

const router = express.Router();

// feedback - Add Feedback
router.post(
  "/",
  authMiddleware,
  [
    body("doctorId").notEmpty().withMessage("Doctor ID is required"),
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment").notEmpty().withMessage("Comment is required"),
  ],
  addFeedback
);

//  Get Feedback for a Doctor
router.get("/", getFeedbackByDoctor);

// Delete Feedback (Only Patient/Admin)
router.delete("/:id", authMiddleware, deleteFeedback);

export default router;
