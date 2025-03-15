import express from 'express';
import { updateAttendance, deleteAttendance } from '../../../controller/DashboardController/teacher/attendenceController';
import { recordAttendance, getAttendance, getAttendanceByStudent } from '../../../controller/DashboardController/transport/busattendeceController';


const router = express.Router();


router.post("/", recordAttendance); // Record new attendance
router.get("/", getAttendance); // Get all attendance records
router.get("/:studentId", getAttendanceByStudent); // Get attendance by student
router.patch("/:attendanceId", updateAttendance); // Update attendance status
router.delete("/:attendanceId", deleteAttendance); // Delete attendance record

export default router;