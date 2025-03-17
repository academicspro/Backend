import { Router } from 'express';
import { getComplaints, getComplaintById, createComplaint, updateComplaint, deleteComplaint, deleteAllComplaints } from '../../../controller/DashboardController/hostel/complaintController';


const router = Router();

router.get('/', getComplaints);
router.get('/:id', getComplaintById);
router.post('/', createComplaint);
router.put('/:id', updateComplaint);
router.delete('/:id', deleteComplaint);
router.delete('/', deleteAllComplaints);

export default router;
