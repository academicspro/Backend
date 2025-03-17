import { Router } from "express";
import { getInventories, getInventoryById, createInventory, updateInventory, deleteInventory } from "../../../controller/DashboardController/hostel/inventoryController";

const router = Router();

router.get("/room/:roomId", getInventories);
router.get("/:id", getInventoryById);
router.post("/room/:roomId", createInventory);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);

export default router;
