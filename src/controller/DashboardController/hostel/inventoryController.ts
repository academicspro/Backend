import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";

// Get all inventories for a specific room
export const getInventories = async (req: Request, res: Response, next: NextFunction) => {
  const { roomId } = req.params;
  try {
    const inventories = await prisma.inventory.findMany({ where: { roomId } });
    res.json(inventories);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get a single inventory item by ID
export const getInventoryById = async (req: Request, res: Response, next: NextFunction) :Promise<any>=> {
  const { id } = req.params;
  try {
    const inventory = await prisma.inventory.findUnique({ where: { id } });
    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.json(inventory);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Create a new inventory item
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

// Update an inventory item
export const updateInventory = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name, quantity } = req.body;
  try {
    const updatedInventory = await prisma.inventory.update({
      where: { id },
      data: { name, quantity },
    });
    res.json(updatedInventory);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete an inventory item
export const deleteInventory = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.inventory.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};
