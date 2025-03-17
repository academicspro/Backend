import { Request,Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";




export async function createFee(req: Request, res: Response, next:NextFunction):Promise<any> {
  try {
    const { studentId, amount, category, paymentDate, discount = 0, scholarship = 0 } = req.body;
    const finalAmount = amount - discount - scholarship;
    if (finalAmount < 0) {
      return res.status(400).json({ message: 'Final amount cannot be negative' });
    }
    const fee = await prisma.fee.create({
      data: {
        studentId,
        schoolId: req.user?.schoolId ?? '', // Assumes req.user is populated by auth middleware
        amount: finalAmount,
        category,
        paymentDate: new Date(paymentDate),
        dueDate: new Date(paymentDate), // Add dueDate property
        status: 'Pending',
      },
    });
    res.status(201).json(fee);
  } catch (error) {
    next(handlePrismaError(error));
  }
}

export async function updateFee(req: Request, res: Response, next:NextFunction) :Promise<any>{
  try {
    const { id } = req.params;
    const { amount, category, paymentDate, discount = 0, scholarship = 0 } = req.body;
    const finalAmount = amount - discount - scholarship;
    if (finalAmount < 0) {
      return res.status(400).json({ message: 'Final amount cannot be negative' });
    }
    const fee = await prisma.fee.update({
      where: { id },
      data: {
        amount: finalAmount,
        category,
        paymentDate: paymentDate ? new Date(paymentDate) : undefined,
      },
    });
    res.json(fee);
  } catch (error) {
   next(handlePrismaError(error));
  }
}

export async function getFee(req: Request, res: Response, next:NextFunction):Promise<any> {
  try {
    const { id } = req.params;
    const fee = await prisma.fee.findUnique({
      where: { id },
      include: { Payment: true },
    });
    if (!fee) {
      return res.status(404).json({ message: 'Fee not found' });
    }
    res.json(fee);
  } catch (error) {
    next(handlePrismaError(error));
  }
}

export async function getAllFees(req: Request, res: Response, next: NextFunction) {
  try {
    const fees = await prisma.fee.findMany({
      include: { Payment: true },
    });
    res.json(fees);
  } catch (error) {
    next(handlePrismaError(error));
  }
}

export async function getFeesByStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const { studentId } = req.params;
    const fees = await prisma.fee.findMany({
      where: { studentId },
      include: { Payment: true },
    });
    res.json(fees);
  } catch (error) {
    next(handlePrismaError(error));
  }
}

export async function getFeesBySchool(req: Request, res: Response, next: NextFunction) :Promise<any>{
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const fees = await prisma.fee.findMany({
      where: { schoolId },
      include: { Payment: true },
    });
    res.json(fees);
  } catch (error) {
    next(handlePrismaError(error));
  }
}

export async function deleteFee(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.fee.delete({ where: { id } });
    res.json({ message: "Fee deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
}
