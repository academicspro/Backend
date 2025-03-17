import { Router } from "express";
import { getHostelExpenses, getHostelExpenseById, createHostelExpense, updateHostelExpense, deleteHostelExpense } from "../../../controller/DashboardController/hostel/hostelExpenseController";


const router = Router();

router.get("/", getHostelExpenses);
router.get("/:id", getHostelExpenseById);
router.post("/", createHostelExpense);
router.put("/:id", updateHostelExpense);
router.delete("/:id", deleteHostelExpense);

export default router;
