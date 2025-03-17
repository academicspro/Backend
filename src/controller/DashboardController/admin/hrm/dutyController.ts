import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../../../db/prisma';
import { handlePrismaError } from '../../../../utils/prismaErrorHandler';

// Get all duties for a school
export const getDuties = async (req: Request, res: Response, next: NextFunction) => {
  const { schoolId } = req.params;
  try {
    const duties = await prisma.duty.findMany({
      where: { schoolId },
      // include: { assignedTo: { select: { id: true, name: true } } },
    });
    res.json(duties);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get a single duty by ID
export const getDutyById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params;
  try {
    const duty = await prisma.duty.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true } }, // Corrected relation
        hostel: { select: { id: true, hostelName: true } }, // Including hostel details
        school: { select: { id: true, schoolName: true } }, // Including school details
      },
    });

    if (!duty) return res.status(404).json({ error: "Duty not found" });

    res.json(duty);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Create a new duty
export const createDuty = async (req: Request, res: Response, next: NextFunction) => {
  const { schoolId } = req.params;
  const { name, description, hostelId, assignedTo } = req.body;

  try {
    const duty = await prisma.duty.create({
      data: {
        name,
        description,
        schoolId,
        hostelId,
        assignedTo: assignedTo || null, 
      },
    });
    res.status(201).json(duty);
  } catch (error) {
    next(handlePrismaError(error));
  }
};
// Update duty
export const updateDuty = async (req: Request, res: Response, next: NextFunction) => {
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

// Delete duty
export const deleteDuty = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.duty.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Assign a duty to a user
export const assignDutyToUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, dutyId } = req.params;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { duties: { connect: { id: dutyId } } },
    });
    res.json(updatedUser);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Remove a duty from a user
export const removeDutyFromUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, dutyId } = req.params;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { duties: { disconnect: { id: dutyId } } },
    });
    res.json(updatedUser);
  } catch (error) {
    next(handlePrismaError(error));
  }
};
