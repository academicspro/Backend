import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";

export const assignTransport = async (req: Request, res: Response, next: NextFunction) => {
  const { studentId } = req.params;
  const { busId, routeId, busStopId } = req.body;

  try {
    const student = await prisma.student.update({
      where: { id: studentId },
      data: { busId, routeId, busStopId },
    });
    res.json(student);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getTransportDetails = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const { studentId } = req.params;

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { id: true, busId: true, routeId: true, busStopId: true },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateTransport = async (req: Request, res: Response, next: NextFunction) => {
  const { studentId } = req.params;
  const { busId, routeId, busStopId } = req.body;

  try {
    const student = await prisma.student.update({
      where: { id: studentId },
      data: { busId, routeId, busStopId },
    });

    res.json(student);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const removeTransport = async (req: Request, res: Response, next: NextFunction) => {
  const { studentId } = req.params;

  try {
    const student = await prisma.student.update({
      where: { id: studentId },
      data: { busId: null, routeId: null, busStopId: null },
    });

    res.json({ message: "Transport details removed successfully" , student});
  } catch (error) {
    next(handlePrismaError(error));
  }
};
