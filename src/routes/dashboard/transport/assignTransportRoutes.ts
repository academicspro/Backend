
import express from 'express';
import { assignTransport, getTransportDetails, updateTransport, removeTransport } from '../../../controller/DashboardController/transport/assignTransportStudentController';

const router = express.Router();


router.put("/:studentId", assignTransport); // Assign or update transport details
router.get("/:studentId", getTransportDetails); // Get transport details
router.patch("/:studentId", updateTransport); // Update transport details
router.delete("/:studentId", removeTransport); // Remove transport details

export default router;