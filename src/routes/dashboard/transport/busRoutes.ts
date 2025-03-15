import express from 'express';
import { createBus, getBuses, getBus, updateBus, deleteBus } from '../../../controller/DashboardController/transport/busController';

const router = express.Router();


router.post("/", createBus); // Create a bus
router.get("/", getBuses); // Get all buses
router.get("/:id", getBus); // Get bus by ID
router.patch("/:id", updateBus); // Update bus details
router.delete("/:id", deleteBus); // Delete a bus


export default router;