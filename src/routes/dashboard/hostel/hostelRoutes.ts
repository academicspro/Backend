import express from "express";
import { getHostels, createHostel, getHostelById, updateHostel, deleteHostel, getHostelsBySchoolId, searchHostels } from "../../../controller/DashboardController/hostel/hostelController";

const router = express.Router();

router.get("/", getHostels); // Get all hostels (with pagination & filters)
router.post("/", createHostel); // Create a new hostel
router.get("/:id", getHostelById); // Get hostel by ID
router.put("/:id", updateHostel); // Update hostel
router.delete("/:id", deleteHostel); // Delete hostel
router.get("/school/:schoolId", getHostelsBySchoolId); // Get hostels by school ID
router.get("/search", searchHostels); // Search hostels by name

export default router;
