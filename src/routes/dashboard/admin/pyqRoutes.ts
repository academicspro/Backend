import express from 'express';
import { createPYQ, deletePYQ, getAllPYQs, getPYQById, updatePYQ } from '../../../controller/DashboardController/admin/pyqController';

const router = express.Router();

router.get('/pyqs', getAllPYQs);
router.get('/pyqs/:id', getPYQById);
router.post('/pyqs', createPYQ);
router.put('/pyqs/:id', updatePYQ);
router.delete('/pyqs/:id', deletePYQ);

export default router;