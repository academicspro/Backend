// routes/visitorRoutes.ts
import { Router } from "express";
import { createVisitor, getVisitor, updateVisitor, deleteVisitor, verifyEntry, verifyExit } from "../../../../controller/DashboardController/admin/visitor/visitorController";


const router = Router();

router.post("/create", createVisitor);
router.get("/:id", getVisitor);
router.put("/:id", updateVisitor);
router.delete("/:id", deleteVisitor);
router.post("/verify-entry", verifyEntry);
router.post("/verify-exit", verifyExit);

export default router;