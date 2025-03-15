import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";

// Create Incharge
export const createIncharge = async (req: Request, res: Response, next: NextFunction) => {
  const { name, schoolId } = req.body;
  try {
    const incharge = await prisma.incharge.create({
      data: { name, schoolId },
    });
    res.status(201).json(incharge);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all Incharges
export const getIncharges = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const incharges = await prisma.incharge.findMany({ include: { school: true } });
    res.json(incharges);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get Incharge by ID
export const getIncharge = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const { id } = req.params;
  try {
    const incharge = await prisma.incharge.findUnique({
      where: { id },
      include: { school: true },
    });
    if (!incharge) return res.status(404).json({ error: "Incharge not found" });
    res.json(incharge);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update Incharge
export const updateIncharge = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name, schoolId } = req.body;
  try {
    const incharge = await prisma.incharge.update({
      where: { id },
      data: { name, schoolId },
    });
    res.json(incharge);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete Incharge
export const deleteIncharge = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.incharge.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};
