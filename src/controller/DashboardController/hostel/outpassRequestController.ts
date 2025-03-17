import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../../db/prisma';
import { handlePrismaError } from '../../../utils/prismaErrorHandler';

export const getOutpassRequests = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const requests = await prisma.outpassRequest.findMany();
    res.json(requests);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const createOutpassRequest = async (req: Request, res: Response, next:NextFunction) => {
  const { studentId, reason, fromDate, toDate } = req.body;
  try {
    const request = await prisma.outpassRequest.create({
      data: { studentId, reason, fromDate, toDate },
    });
    res.status(201).json(request);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateOutpassRequest = async (req: Request, res: Response, next:NextFunction) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const request = await prisma.outpassRequest.update({
      where: { id },
      data: { status },
    });
    res.json(request);
  } catch (error) {
    next(handlePrismaError(error));
  }
};