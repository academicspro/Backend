import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../../db/prisma';
import { handlePrismaError } from '../../../utils/prismaErrorHandler';

export const getMedicalEmergencies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const emergencies = await prisma.medicalEmergency.findMany();
    res.json(emergencies);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getMedicalEmergencyById = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const { id } = req.params;
  try {
    const emergency = await prisma.medicalEmergency.findUnique({ where: { id } });
    if (!emergency) return res.status(404).json({ message: 'Medical emergency not found' });
    res.json(emergency);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const createMedicalEmergency = async (req: Request, res: Response, next: NextFunction) => {
  const { description, date, studentId, hostelId } = req.body;
  try {
    const emergency = await prisma.medicalEmergency.create({
      data: { description, date, studentId, hostelId },
    });
    res.status(201).json(emergency);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateMedicalEmergency = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { description, date, studentId, hostelId } = req.body;
  try {
    const emergency = await prisma.medicalEmergency.update({
      where: { id },
      data: { description, date, studentId, hostelId },
    });
    res.json(emergency);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteMedicalEmergency = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.medicalEmergency.delete({ where: { id } });
    res.json({ message: 'Medical emergency deleted successfully' });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

