import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";

// Create a Bus Stop
export const createBusStop = async (req: Request, res: Response, next: NextFunction) => {
  const { name, location, routeId, schoolId } = req.body;
  try {
    const busStop = await prisma.busStop.create({
      data: { name, location, routeId, schoolId },
    });
    res.status(201).json(busStop);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all Bus Stops
export const getBusStops = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const busStops = await prisma.busStop.findMany({
      include: { route: true, school: true },
    });
    res.json(busStops);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get Bus Stop by ID
export const getBusStop = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const { id } = req.params;
  try {
    const busStop = await prisma.busStop.findUnique({
      where: { id },
      include: { route: true, school: true },
    });
    if (!busStop) return res.status(404).json({ error: "Bus Stop not found" });
    res.json(busStop);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update Bus Stop
export const updateBusStop = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name, location, routeId } = req.body;
  try {
    const busStop = await prisma.busStop.update({
      where: { id },
      data: { name, location, routeId },
    });
    res.json(busStop);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete Bus Stop
export const deleteBusStop = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.busStop.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};
