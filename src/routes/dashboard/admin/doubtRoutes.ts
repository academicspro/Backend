import express from 'express'
import { createDoubt, deleteDoubt, getAllDoubts, getDoubtById, updateDoubt } from '../../../controller/DashboardController/admin/doubtController';

const router = express.Router();

router.post('/doubt', createDoubt);
router.get('/doubts', getAllDoubts);
router.get('/doubt/:id', getDoubtById);
router.put('/doubt/:id', updateDoubt);
router.delete('/doubt/:id', deleteDoubt);


export default router;