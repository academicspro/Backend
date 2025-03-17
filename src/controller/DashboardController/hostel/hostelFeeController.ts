import { Request, Response ,NextFunction} from 'express';
import { prisma } from '../../../db/prisma';
import { handlePrismaError } from '../../../utils/prismaErrorHandler';

export const getHostelFees = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const fees = await prisma.hostelFee.findMany();
    res.json(fees);
  } catch (error) {
   next(handlePrismaError(error));
  }
};

export const createHostelFee = async (req: Request, res: Response, next:NextFunction) => {
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

export const updateHostelFee = async (req: Request, res: Response, next:NextFunction) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const fee = await prisma.hostelFee.update({
      where: { id },
      data: { status },
    });
    res.json(fee);
  } catch (error) {
    next(handlePrismaError(error));
  }
};