import express from "express";
import { deleteSchool, getAllSchools, getSchoolById, registerSchool, updateSchool } from "../../controller/superadmin/schoolRegisterController";
import multer from 'multer';


const router = express.Router();
const upload = multer();

router.post("/register",upload.single("profilePic"), registerSchool);
router.get("/get-all", getAllSchools);
router.get("/get/:id", getSchoolById);
router.put("/update/:id", updateSchool);
router.delete("/delete/:id", deleteSchool);

export default router;