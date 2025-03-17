import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../../db/prisma";
import { handlePrismaError } from "../../../../../utils/prismaErrorHandler";

export const getInventoryItems = async (req: Request, res: Response, next: NextFunction) => {
  const { schoolId } = req.params;
  try {
    const items = await prisma.inventoryItem.findMany({
      where: { schoolId },
      include: { transactions: true },
    });
    res.json(items);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const createInventoryItem = async (req: Request, res: Response, next: NextFunction) => {
  const { schoolId } = req.params;
  const { name, description, quantity } = req.body;
  try {
    const item = await prisma.inventoryItem.create({
      data: { name, description, quantity, schoolId },
    });
    res.status(201).json(item);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateInventoryItem = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name, description, quantity } = req.body;
  try {
    const item = await prisma.inventoryItem.update({
      where: { id },
      data: { name, description, quantity },
    });
    res.json(item);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteInventoryItem = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.inventoryItem.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const recordInventoryTransaction = async (req: Request, res: Response, next: NextFunction) => {
  const { inventoryItemId, type, quantity, userId } = req.body;
  try {
    const transaction = await prisma.inventoryTransaction.create({
      data: { inventoryItemId, type, quantity, userId },
    });
    if (type === "ADD") {
      await prisma.inventoryItem.update({
        where: { id: inventoryItemId },
        data: { quantity: { increment: quantity } },
      });
    } else if (type === "REMOVE") {
      await prisma.inventoryItem.update({
        where: { id: inventoryItemId },
        data: { quantity: { decrement: quantity } },
      });
    }
    res.status(201).json(transaction);
  } catch (error) {
    next(handlePrismaError(error));
  }
};
