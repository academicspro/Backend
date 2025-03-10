import  express from "express";
import { createTicket, deleteTicket, getAllTickets, getTicketById, getTicketsBySchool, updateTicket } from "../../../controller/superadmin/createTicketController";

const router = express.Router();

router.post("/create-ticket", createTicket);
router.get("/get-tickets", getAllTickets);
router.get("/get-ticket/:ticketId", getTicketById);
router.get("/schooltickets/:schoolId", getTicketsBySchool);
router.put("/update-ticket/:ticketId", updateTicket);
router.delete("/delete-ticket/:ticketId", deleteTicket);


export default router;
