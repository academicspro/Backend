
import { Request, Response , NextFunction} from 'express';
import { prisma } from '../../../db/prisma';
import { handlePrismaError } from '../../../utils/prismaErrorHandler';

export const getMedicalEmergencies = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const emergencies = await prisma.medicalEmergency.findMany();
    res.json(emergencies);
  } catch (error) {
next(handlePrismaError(error));
  }
};

export const createMedicalEmergency = async (req: Request, res: Response, next:NextFunction) => {
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