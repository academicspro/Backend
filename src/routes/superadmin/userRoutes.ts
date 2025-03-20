import express from "express";
import { getAllUsers, getUserById } from "../../controller/superadmin/userController";

const router = express.Router();

router.get("/get-all", getAllUsers );
router.get("/get/:id", getUserById );

export default router;
