import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";

export const getInventories = async (req: Request, res: Response, next: NextFunction) => {
  const { roomId } = req.params;
  try {
    const inventories = await prisma.inventory.findMany({ where: { roomId } });
    res.json(inventories);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const createInventory = async (req: Request, res: Response, next: NextFunction) => {
  const { roomId } = req.params;
  const { name, quantity } = req.body;
  try {
    const inventory = await prisma.inventory.create({
      data: { name, quantity, roomId },
    });
    res.status(201).json(inventory);
  } catch (error) {
    next(handlePrismaError(error));
  }
};
