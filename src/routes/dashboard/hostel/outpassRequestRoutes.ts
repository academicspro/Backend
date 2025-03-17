import express from 'express';
import { getOutpassRequests, getOutpassRequestById, getOutpassRequestsByStudentId, createOutpassRequest, updateOutpassRequest, deleteOutpassRequest } from '../../../controller/DashboardController/hostel/outpassRequestController';


const router = express.Router();

router.get('/', getOutpassRequests);
router.get('/:id', getOutpassRequestById);
router.get('/student/:studentId', getOutpassRequestsByStudentId);
router.post('/', createOutpassRequest);
router.put('/:id', updateOutpassRequest);
router.delete('/:id', deleteOutpassRequest);

export default router;
