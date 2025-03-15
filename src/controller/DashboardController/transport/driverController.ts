import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";

// Create a Driver
export const createDriver = async (req: Request, res: Response, next: NextFunction) => {
  const { name, license, busId, schoolId } = req.body;
  try {
    const driver = await prisma.driver.create({
      data: { name, license, busId, schoolId },
    });
    res.status(201).json(driver);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all Drivers
export const getDrivers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const drivers = await prisma.driver.findMany({
      include: { bus: true, school: true },
    });
    res.json(drivers);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get Driver by ID
export const getDriver = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const { id } = req.params;
  try {
    const driver = await prisma.driver.findUnique({
      where: { id },
      include: { bus: true, school: true },
    });
    if (!driver) return res.status(404).json({ error: "Driver not found" });
    res.json(driver);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Assign Driver to a Bus
export const assignDriverToBus = async (req: Request, res: Response, next: NextFunction) => {
  const { busId, driverId } = req.body;
  try {
    const driver = await prisma.driver.update({
      where: { id: driverId },
      data: { busId },
    });
    res.json(driver);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update Driver Details
export const updateDriver = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name, license, busId, schoolId } = req.body;
  try {
    const driver = await prisma.driver.update({
      where: { id },
      data: { name, license, busId, schoolId },
    });
    res.json(driver);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete a Driver
export const deleteDriver = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.driver.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};
