import express from 'express';
import { createRoute, getRoutes, getRoute, updateRoute, deleteRoute } from '../../../controller/DashboardController/transport/routeController';

const router = express.Router();

router.post("/", createRoute); // Create a Route
router.get("/", getRoutes); // Get all Routes
router.get("/:id", getRoute); // Get Route by ID
router.patch("/:id", updateRoute); // Update Route details
router.delete("/:id", deleteRoute); // Delete a Route



export default router;