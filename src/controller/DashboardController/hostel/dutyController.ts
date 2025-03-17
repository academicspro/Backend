import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../../db/prisma';
import { handlePrismaError } from '../../../utils/prismaErrorHandler';

export const getComplaints = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const complaints = await prisma.complaint.findMany();
    res.json(complaints);
  } catch (error) {
next(handlePrismaError(error));
  }
};

export const createComplaint = async (req: Request, res: Response, next:NextFunction) => {
  const { description, studentId, hostelId } = req.body;
  try {
    const complaint = await prisma.complaint.create({
      data: { description, studentId, hostelId },
    });
    res.status(201).json(complaint);
  } catch (error) {
  next(handlePrismaError(error));
  }
};

export const updateComplaint = async (req: Request, res: Response, next:NextFunction) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const complaint = await prisma.complaint.update({
      where: { id },
      data: { status },
    });
    res.json(complaint);
  } catch (error) {
   next(handlePrismaError(error));
  }
};