import express from "express";

import { getUserPermissionsById, updateUserPermissions } from "../../controller/superadmin/userPermissionController";

const router = express.Router();

router.get("/get/:userId", getUserPermissionsById);
router.get("/update/:userId", updateUserPermissions);

export default router;