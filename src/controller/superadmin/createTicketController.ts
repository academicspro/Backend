import { NextFunction, Request, Response } from "express";
import { prisma } from "../../db/prisma";
import { handlePrismaError } from "../../utils/prismaErrorHandler";

// Create Ticket

export const createTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, priority, status, schoolId } = req.body;

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority,
        status,
        School: {
          connect: {
            id: schoolId,
          },
        },
      },
    });

    res.status(201).json(ticket);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all Tickets

export const getAllTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tickets = await prisma.ticket.findMany();

    res.status(200).json(tickets);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get Ticket by ID
export const getTicketById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ticketId } = req.params;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
       res.status(404).json({ message: "Ticket not found" });
       return;
    }

    res.status(200).json(ticket);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get ALl  Ticket of a  School
export const getTicketsBySchool = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { schoolId } = req.params;

    const tickets = await prisma.ticket.findMany({
      where: { schoolId },
    });

    res.status(200).json(tickets);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update Ticket
export const updateTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ticketId } = req.params;
    const { title, description, priority, status } = req.body;

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        title,
        description,
        priority,
        status,
      },
    });

    res.status(200).json(updatedTicket);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete Ticket

export const deleteTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ticketId } = req.params;

    await prisma.ticket.delete({
      where: { id: ticketId },
    });

    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};
