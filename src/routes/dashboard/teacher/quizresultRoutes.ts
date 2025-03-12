import express from 'express';
import { getQuizResultsByUserId, getQuizResultById, createQuizResult, updateQuizResult, deleteQuizResult } from '../../../controller/DashboardController/teacher/quizResultController';

const router = express.Router();

router.get('/users/:userId/quiz-results', getQuizResultsByUserId);
router.get('/quiz-results/:id', getQuizResultById);
router.post('/quiz-results', createQuizResult);
router.put('/quiz-results/:id', updateQuizResult);
router.delete('/quiz-results/:id', deleteQuizResult);


export default router;