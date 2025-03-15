import express from 'express';
import { createConductor, getConductors, getConductor, assignConductorToBus, updateConductor, deleteConductor } from '../../../controller/DashboardController/transport/conductorController';

const router = express.Router();

router.post("/", createConductor); // Create a conductor
router.get("/", getConductors); // Get all conductors
router.get("/:id", getConductor); // Get conductor by ID
router.patch("/assign", assignConductorToBus); // Assign conductor to a bus
router.patch("/:id", updateConductor); // Update conductor details
router.delete("/:id", deleteConductor); // Delete a conductor

export default router;