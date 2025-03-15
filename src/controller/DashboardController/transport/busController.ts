import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";


// Create a Bus 


export const createBus = async (req: Request, res: Response, next: NextFunction) => {
  const { busNumber, capacity, schoolId } = req.body;
  try {
    const bus = await prisma.bus.create({
      data: { busNumber, capacity, schoolId },
    });
    res.status(201).json(bus);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all Buses

export const getBuses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const buses = await prisma.bus.findMany({ include: { school: true } });
    res.json(buses);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get Buseby id 
export const getBus = async (req: Request, res: Response, next: NextFunction) : Promise<any>=> {
  const { id } = req.params;
  try {
    const bus = await prisma.bus.findUnique({ where: { id }, include: { school: true } });
    if (!bus) return res.status(404).json({ error: "Bus not found" });
    res.json(bus);
  } catch (error) {
    next(handlePrismaError(error));
  }
};


//  Updata Bus

export const updateBus = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { busNumber, capacity } = req.body;
  try {
    const bus = await prisma.bus.update({
      where: { id },
      data: { busNumber, capacity },
    });
    res.json(bus);
  } catch (error) {
    next(handlePrismaError(error));
  }
};
// delete bus 
export const deleteBus = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.bus.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};
