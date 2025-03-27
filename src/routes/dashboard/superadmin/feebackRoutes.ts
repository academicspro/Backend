import express from 'express';
import { approveFeedback, createFeedback, deleteFeedback, getAllFeedback, getFeedbackById, getFeedbackBySchool, rejectFeedback, updateFeedback } from '../../../controller/superadmin/feedbackController';

const router = express.Router();    

router.post("/create-feedback", createFeedback);
router.get("/get-feedbacks", getAllFeedback);
router.get("/get-feedback/:feedbackId", getFeedbackById);
router.get("/schoolfeedback/:schoolId", getFeedbackBySchool);
router.put("/update-feedback/:feedbackId", updateFeedback);
router.delete("/delete-feedback/:feedbackId", deleteFeedback);

router.patch("/approve-feedback/:feedbackId", approveFeedback);
router.patch("/reject-feedback/:feedbackId", rejectFeedback);

export default router;
