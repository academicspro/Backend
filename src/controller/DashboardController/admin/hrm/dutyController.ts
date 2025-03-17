import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../../../db/prisma';
import { handlePrismaError } from '../../../../utils/prismaErrorHandler';


export const getDuties = async (req: Request, res: Response, next:NextFunction) => {
  const { schoolId } = req.params;
  try {
    const duties = await prisma.duty.findMany({
      where: { schoolId },
      include: { user: { select: { id: true, name: true } } },
    });
    res.json(duties);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const createDuty = async (req: Request, res: Response, next:NextFunction) => {
  const { schoolId } = req.params;
  const { name, description } = req.body;
  try {
    const duty = await prisma.duty.create({
      data: { name, description, schoolId, assignedTo: '', hostelId: '' },
    });
    res.status(201).json(duty);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateDuty = async (req: Request, res: Response, next:NextFunction) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const duty = await prisma.duty.update({
      where: { id },
      data: { name, description },
    });
    res.json(duty);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteDuty = async (req: Request, res: Response,next:NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.duty.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const assignDutyToUser = async (req: Request, res: Response, next:NextFunction) => {
  const { userId, dutyId } = req.params;
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { duties: { connect: { id: dutyId } } },
    });
    res.json(user);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const removeDutyFromUser = async (req: Request, res: Response, next:NextFunction) => {
  const { userId, dutyId } = req.params;
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { duties: { disconnect: { id: dutyId } } },
    });
    res.json(user);
  } catch (error) {
   next(handlePrismaError(error));
  }
};