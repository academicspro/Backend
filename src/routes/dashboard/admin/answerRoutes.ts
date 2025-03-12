import express from 'express';
import { getAnswersByDoubtId, getAnswerById, createAnswer, updateAnswer, deleteAnswer } from '../../../controller/DashboardController/admin/answerController';

const router = express.Router();


router.get('/doubts/:doubtId/answers', getAnswersByDoubtId);
router.get('/answers/:id', getAnswerById);
router.post('/answers', createAnswer);
router.put('/answers/:id', updateAnswer);
router.delete('/answers/:id', deleteAnswer);


export default router;