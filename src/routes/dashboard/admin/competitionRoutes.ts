import express from 'express';
import { getAllCompetitions, getCompetitionById, createCompetition, updateCompetition, deleteCompetition } from '../../../controller/DashboardController/admin/competationController';


const router = express.Router();


router.get('/competitions', getAllCompetitions);
router.get('/competitions/:id', getCompetitionById);
router.post('/competitions', createCompetition);
router.put('/competitions/:id', updateCompetition);
router.delete('/competitions/:id', deleteCompetition);



export default router;