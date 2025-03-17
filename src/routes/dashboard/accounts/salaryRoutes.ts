import express from "express";
import { getSalaryPayments } from "../../../controller/DashboardController/accounts/reportController";
import { recordSalaryPayment } from "../../../controller/DashboardController/accounts/salaryController";


const router = express.Router();

router.post("/pay",  recordSalaryPayment);
router.get("/payments/:teacherId",  getSalaryPayments);
// router.get("/payments",  getSalaryPaymentsByDate);

export default router;
