import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";

export const getHostels = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const hostels = await prisma.hostel.findMany();
    res.json(hostels);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const createHostel = async (req: Request, res: Response, next:NextFunction) => {
  const { hostelName, location, capacity, schoolId } = req.body;
  try {
    const hostel = await prisma.hostel.create({
      data: { hostelName, location, capacity, schoolId },
    });
    res.status(201).json(hostel);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getHostelById = async (req: Request, res: Response, next:NextFunction) => {
  const { id } = req.params;
  try {
    const hostel = await prisma.hostel.findUnique({ where: { id } });
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });
    res.json(hostel);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateHostel = async (req: Request, res: Response, next:NextFunction) => {
  const { id } = req.params;
  const { hostelName, location, capacity } = req.body;
  try {
    const hostel = await prisma.hostel.update({
      where: { id },
      data: { hostelName, location, capacity },
    });
    res.json(hostel);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteHostel = async (req: Request, res: Response, next:NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.hostel.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};
