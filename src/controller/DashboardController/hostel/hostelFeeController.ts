import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../../db/prisma';
import { handlePrismaError } from '../../../utils/prismaErrorHandler';

// Get all hostel fees
export const getHostelFees = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fees = await prisma.hostelFee.findMany();
    res.json(fees);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get a single hostel fee by ID
export const getHostelFeeById = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const { id } = req.params;
  try {
    const fee = await prisma.hostelFee.findUnique({
      where: { id },
    });
    if (!fee) {
      return res.status(404).json({ message: 'Hostel fee not found' });
    }
    res.json(fee);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Create a new hostel fee
export const createHostelFee = async (req: Request, res: Response, next: NextFunction) => {
  const { amount, dueDate, studentId, hostelId, type } = req.body;
  try {
    const fee = await prisma.hostelFee.create({
      data: { amount, dueDate, studentId, hostelId, type },
    });
    res.status(201).json(fee);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update a hostel fee
export const updateHostelFee = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { amount, dueDate, status } = req.body;
  try {
    const fee = await prisma.hostelFee.update({
      where: { id },
      data: { amount, dueDate, status },
    });
    res.json(fee);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete a hostel fee
export const deleteHostelFee = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.hostelFee.delete({
      where: { id },
    });
    res.json({ message: 'Hostel fee deleted successfully' });
  } catch (error) {
    next(handlePrismaError(error));
  }
};
