import Feedback from "../models/feedback.model.js";
import { validationResult } from "express-validator";

//  Add Feedback
export const addFeedback = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { doctorId, rating, comment } = req.body;
    const feedback = new Feedback({
      doctorId,
      patientId: req.user.id,
      rating,
      comment,
    });
    await feedback.save();
    res
      .status(201)
      .json({ message: "Feedback submitted successfully", feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get Feedback for a Doctor
export const getFeedbackByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.query;
    if (!doctorId)
      return res.status(400).json({ error: "Doctor ID is required" });

    const feedbacks = await Feedback.find({ doctorId });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Delete Feedback
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ error: "Feedback not found" });

    // Only the patient who wrote it or an admin can delete
    if (feedback.patientId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await feedback.deleteOne();
    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
