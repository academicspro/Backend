import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";

export const getOutpassRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await prisma.outpassRequest.findMany();
    res.json(requests);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getOutpassRequestById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params;
  try {
    const request = await prisma.outpassRequest.findUnique({
      where: { id },
    });
    if (!request) {
      return res.status(404).json({ message: "Outpass request not found" });
    }
    res.json(request);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const createOutpassRequest = async (req: Request, res: Response, next: NextFunction) => {
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

export const updateOutpassRequest = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { studentId, reason, fromDate, toDate, status } = req.body;
  try {
    const request = await prisma.outpassRequest.update({
      where: { id },
      data: { studentId, reason, fromDate, toDate, status },
    });
    res.json(request);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteOutpassRequest = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.outpassRequest.delete({
      where: { id },
    });
    res.json({ message: "Outpass request deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getOutpassRequestsByStudentId = async (req: Request, res: Response, next: NextFunction) => {
  const { studentId } = req.params;
  try {
    const requests = await prisma.outpassRequest.findMany({
      where: { studentId },
    });
    res.json(requests);
  } catch (error) {
    next(handlePrismaError(error));
  }
};
