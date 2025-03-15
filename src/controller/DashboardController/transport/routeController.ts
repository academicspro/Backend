import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";

// Create Route
export const createRoute = async (req: Request, res: Response, next: NextFunction) => {
  const { name, busId, schoolId } = req.body;
  try {
    const route = await prisma.route.create({
      data: { name, busId, schoolId },
    });
    res.status(201).json(route);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get All Routes
export const getRoutes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const routes = await prisma.route.findMany({
      include: { bus: true, school: true, busStops: true },
    });
    res.json(routes);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get Route by ID
export const getRoute = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const { id } = req.params;
  try {
    const route = await prisma.route.findUnique({
      where: { id },
      include: { bus: true, school: true, busStops: true },
    });
    if (!route) return res.status(404).json({ error: "Route not found" });
    res.json(route);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update Route
export const updateRoute = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name, busId, schoolId } = req.body;
  try {
    const route = await prisma.route.update({
      where: { id },
      data: { name, busId, schoolId },
    });
    res.json(route);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete Route
export const deleteRoute = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.route.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};
