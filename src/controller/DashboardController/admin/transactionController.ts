import { Request,Response,NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";

 // Create a new transaction
 export const createTransaction = async (req: Request, res: Response, next:NextFunction) => {
    const { userId, coinsUsed, amountPaid, status } = req.body;
    try {
      const transaction = await prisma.transaction.create({
        data: { userId, coinsUsed, amountPaid, status: status || 'PENDING' },
      });
      res.status(201).json(transaction);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };


// Get all transactions for a user
export const getTransactionsByUserId = async (req: Request, res: Response, next:NextFunction) => {
    const { userId } = req.params;
    try {
      const transactions = await prisma.transaction.findMany({
        where: { userId },
      });
      res.status(200).json(transactions);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  
  // Get a single transaction by ID
  export const getTransactionById = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
    const { id } = req.params;
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id },
      });
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      res.status(200).json(transaction);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  
 
  
  // Update a transaction
  export const updateTransaction = async (req: Request, res: Response, next:NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const transaction = await prisma.transaction.update({
        where: { id },
        data: { status },
      });
      res.status(200).json(transaction);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  
  // Delete a transaction
  export const deleteTransaction = async (req: Request, res: Response, next:NextFunction) => {
    const { id } = req.params;
    try {
      await prisma.transaction.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
        next(handlePrismaError(error));
    }
  };