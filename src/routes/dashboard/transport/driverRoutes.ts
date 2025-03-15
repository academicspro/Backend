import express from 'express';
import { createDriver, getDrivers, getDriver, assignDriverToBus, updateDriver, deleteDriver } from '../../../controller/DashboardController/transport/driverController';

const router = express.Router();

router.post("/", createDriver); // Create a driver
router.get("/", getDrivers); // Get all drivers
router.get("/:id", getDriver); // Get driver by ID
router.patch("/assign", assignDriverToBus); // Assign driver to a bus
router.patch("/:id", updateDriver); // Update driver details
router.delete("/:id", deleteDriver); // Delete a driver

export default router;