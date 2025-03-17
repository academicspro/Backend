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

export const getHostelExpenseById = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const { id } = req.params;
  try {
    const expense = await prisma.hostelExpense.findUnique({
      where: { id },
    });

    if (!expense) {
      return res.status(404).json({ message: "Hostel Expense not found" });
    }

    res.json(expense);
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

export const updateHostelExpense = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { description, amount, date, hostelId } = req.body;
  try {
    const expense = await prisma.hostelExpense.update({
      where: { id},
      data: { description, amount, date, hostelId },
    });

    res.json(expense);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteHostelExpense = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.hostelExpense.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};
