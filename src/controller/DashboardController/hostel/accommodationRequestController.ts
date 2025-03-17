import { Request,Response,NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";



export const getAccommodationRequests = async (req: Request, res: Response,next:NextFunction) => {
  const user = (req as any).user;
  try {
    const requests = user.role === 'student'
      ? await prisma.accommodationRequest.findMany({ where: { studentId: user.studentId } })
      : await prisma.accommodationRequest.findMany();
    res.json(requests);
  } catch (error) {
next(handlePrismaError(error));
  }
};

export const createAccommodationRequest = async (req: Request, res: Response, next:NextFunction) => {
  const { studentId, hostelId } = req.body;
  try {
    const request = await prisma.accommodationRequest.create({
      data: { studentId, hostelId },
    });
    res.status(201).json(request);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateAccommodationRequest = async (req: Request, res: Response,next:NextFunction) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const request = await prisma.accommodationRequest.update({
      where: { id },
      data: { status },
    });
    res.json(request);
  } catch (error) {
    next(handlePrismaError(error));
  }
};