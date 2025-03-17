import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";

// Create a new room
export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { number, type, status, hostelId } = req.body;
    const room = await prisma.room.create({
      data: { number, type, status, hostelId },
    });
    res.status(201).json(room);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all rooms
export const getAllRooms = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rooms = await prisma.room.findMany({
      include: { hostel: true, students: true, inventories: true },
    });
    res.json(rooms);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get a single room by ID
export const getRoomById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params;
    const room = await prisma.room.findUnique({
      where: { id },
      include: { hostel: true, students: true, inventories: true },
    });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (error) {
    next(handlePrismaError(error));
  }
};



// Update a room
export const updateRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { number, type, status, hostelId } = req.body;
    const room = await prisma.room.update({
      where: { id },
      data: { number, type, status, hostelId },
    });
    res.json(room);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete a room
export const deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.room.delete({ where: { id } });
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};
