import express from 'express';
import { createFeedback, deleteFeedback, getAllFeedback, getFeedbackById, getFeedbackBySchool, updateFeedback } from '../../../controller/superadmin/feedbackController';

const router = express.Router();    

router.post("/create-feedback", createFeedback);
router.get("/get-feedbacks", getAllFeedback);
router.get("/get-feedback/:feedbackId", getFeedbackById);
router.get("/schoolfeedback/:schoolId", getFeedbackBySchool);
router.put("/update-feedback/:feedbackId", updateFeedback);
router.delete("/delete-feedback/:feedbackId", deleteFeedback);

export default router;
