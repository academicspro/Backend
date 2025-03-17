import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../../db/prisma';
import { handlePrismaError } from '../../../utils/prismaErrorHandler';

export const getComplaints = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const complaints = await prisma.complaint.findMany();
    res.json(complaints);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getComplaintById = async (req: Request, res: Response, next: NextFunction) :Promise<any>=> {
  const { id } = req.params;
  try {
    const complaint = await prisma.complaint.findUnique({
      where: { id },
    });
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json(complaint);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const createComplaint = async (req: Request, res: Response, next: NextFunction) => {
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

export const updateComplaint = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status, description } = req.body;
  try {
    const complaint = await prisma.complaint.update({
      where: { id },
      data: { status, description },
    });
    res.json(complaint);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteComplaint = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.complaint.delete({
      where: { id },
    });
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteAllComplaints = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.complaint.deleteMany();
    res.json({ message: 'All complaints deleted successfully' });
  } catch (error) {
    next(handlePrismaError(error));
  }
};
