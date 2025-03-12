import express from 'express';
import { getTopicsByRoadmapId, getTopicById, createTopic, updateTopic, deleteTopic } from '../../../controller/DashboardController/student/topicController';

const router = express.Router();


router.get('/roadmaps/:roadmapId/topics', getTopicsByRoadmapId);
router.get('/topics/:id', getTopicById);
router.post('/topics', createTopic);
router.put('/topics/:id', updateTopic);
router.delete('/topics/:id', deleteTopic);

export default router;