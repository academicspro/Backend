import express from 'express';
import { createBusStop, getBusStops, getBusStop, updateBusStop, deleteBusStop } from '../../../controller/DashboardController/transport/busStopController';

const router = express.Router();

router.post("/", createBusStop); // Create a bus stop
router.get("/", getBusStops); // Get all bus stops
router.get("/:id", getBusStop); // Get bus stop by ID
router.patch("/:id", updateBusStop); // Update bus stop details
router.delete("/:id", deleteBusStop); // Delete a bus stop

export default router;