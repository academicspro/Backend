import express from "express";
import { getPayrolls, getPayrollById, createPayroll, updatePayroll, deletePayroll } from "../../../../controller/DashboardController/admin/hrm/payrollController";


const router = express.Router();

router.get("/:schoolId", getPayrolls);          // Get all payrolls for a school
router.get("/single/:id", getPayrollById);      // Get a single payroll by ID
router.post("/:schoolId", createPayroll);       // Create a payroll entry
router.put("/:id", updatePayroll);              // Update a payroll entry
router.delete("/:id", deletePayroll);           // Delete a payroll entry

export default router;
