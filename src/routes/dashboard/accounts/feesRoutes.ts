// Routes File (routes/feeRoutes.ts)
import { Router } from "express";
import { createFee, deleteFee, getAllFees, getFee, getFeesBySchool, getFeesByStudent, updateFee } from "../../../controller/DashboardController/accounts/feeController";


const router = Router();

router.post("/", createFee);
router.put("/:id", updateFee);
router.get("/", getAllFees);
router.get("/:id", getFee);
router.get("/student/:studentId", getFeesByStudent);
router.get("/school", getFeesBySchool);
router.delete("/:id", deleteFee);

export default router;
