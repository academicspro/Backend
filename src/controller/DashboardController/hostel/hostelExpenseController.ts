import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";

export const getHostelExpenses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expenses = await prisma.hostelExpense.findMany();
    res.json(expenses);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const createHostelExpense = async (req: Request, res: Response, next: NextFunction) => {
  const { description, amount, date, hostelId } = req.body;
  try {
    const expense = await prisma.hostelExpense.create({
      data: { description, amount, date, hostelId },
    });
    res.status(201).json(expense);
  } catch (error) {
    next(handlePrismaError(error));
  }
};
