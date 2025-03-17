import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";

export async function getFeesCollected(req: Request, res: Response, next: NextFunction) {
  try {
    const { startDate, endDate } = req.query;
    const payments = await prisma.payment.findMany({
      where: {
        status: "Success",
        paymentDate: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
      },
      include: { fee: true },
    });
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    res.json({ total, payments });
  } catch (error) {
    next(handlePrismaError(error));
  }
}

export async function getOutstandingFees(req: Request, res: Response, next: NextFunction) {
  try {
    const fees = await prisma.fee.findMany({
      where: { status: { not: "Paid" } },
      include: { Payment: true },
    });
    const outstanding = fees.map((fee) => {
      const paid = fee.Payment.filter((p) => p.status === "Success").reduce((sum, p) => sum + p.amount, 0);
      return { ...fee, outstandingAmount: fee.amount - paid };
    });
    const totalOutstanding = outstanding.reduce((sum, f) => sum + f.outstandingAmount, 0);
    res.json({ totalOutstanding, fees: outstanding });
  } catch (error) {
    next(handlePrismaError(error));
  }
}

export async function getSalaryPayments(req: Request, res: Response, next: NextFunction) {
  try {
    const { startDate, endDate } = req.query;
    const payments = await prisma.salaryPayment.findMany({
      where: {
        status: "Success",
        paymentDate: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
      },
      include: { teacher: true },
    });
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    res.json({ total, payments });
  } catch (error) {
    next(handlePrismaError(error));
  }
}
