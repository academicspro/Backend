import { Router } from 'express';
import { getHostelFees, getHostelFeeById, createHostelFee, updateHostelFee, deleteHostelFee } from '../../../controller/DashboardController/hostel/hostelFeeController';


const router = Router();

router.get('/', getHostelFees); // Get all hostel fees
router.get('/:id', getHostelFeeById); // Get a specific hostel fee
router.post('/', createHostelFee); // Create a new hostel fee
router.put('/:id', updateHostelFee); // Update a hostel fee
router.delete('/:id', deleteHostelFee); // Delete a hostel fee

export default router;
