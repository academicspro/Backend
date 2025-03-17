import express from "express";
import { getAccommodationRequests, getAccommodationRequestById, createAccommodationRequest, updateAccommodationRequest, deleteAccommodationRequest } from "../../../controller/DashboardController/hostel/accommodationRequestController";


const router = express.Router();

router.get("/", getAccommodationRequests);
router.get("/:id", getAccommodationRequestById);
router.post("/", createAccommodationRequest);
router.put("/:id", updateAccommodationRequest);
router.delete("/:id", deleteAccommodationRequest);

export default router;
