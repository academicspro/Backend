import express from 'express';
import { createIncharge, getIncharges, getIncharge, updateIncharge, deleteIncharge } from '../../../controller/DashboardController/transport/inchargeController';

const router = express.Router();

router.post("/", createIncharge); // Create an Incharge
router.get("/", getIncharges); // Get all Incharges
router.get("/:id", getIncharge); // Get Incharge by ID
router.patch("/:id", updateIncharge); // Update Incharge details
router.delete("/:id", deleteIncharge); // Delete an Incharge

export default router;