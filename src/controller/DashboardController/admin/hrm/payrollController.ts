import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";

// Get all payrolls for a specific school
export const getPayrolls = async (req: Request, res: Response, next: NextFunction) => {
  const { schoolId } = req.params;
  try {
    const payrolls = await prisma.payroll.findMany({
      where: { schoolId },
      include: { user: { select: { id: true, name: true } } },
    });
    res.json(payrolls);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get a specific payroll by ID
export const getPayrollById = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const { id } = req.params;
  try {
    const payroll = await prisma.payroll.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true } } },
    });
    if (!payroll) return res.status(404).json({ error: "Payroll not found" });
    res.json(payroll);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Create a new payroll record
export const createPayroll = async (req: Request, res: Response, next: NextFunction) => {
  const { schoolId } = req.params;
  const { userId, periodStart, periodEnd, grossSalary, deductions } = req.body;
  try {
    const netSalary = grossSalary - (deductions || 0);
    const payroll = await prisma.payroll.create({
      data: {
        userId,
        schoolId,
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd),
        grossSalary,
        deductions: deductions || 0,
        netSalary,
      },
    });
    res.status(201).json(payroll);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update an existing payroll record
export const updatePayroll = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const { id } = req.params;
  const { grossSalary, deductions, paymentDate, status } = req.body;
  try {
    const existingPayroll = await prisma.payroll.findUnique({ where: { id } });
    if (!existingPayroll) return res.status(404).json({ error: "Payroll not found" });

    const netSalary = grossSalary - (deductions || existingPayroll.deductions);
    const payroll = await prisma.payroll.update({
      where: { id },
      data: {
        grossSalary,
        deductions,
        netSalary,
        paymentDate: paymentDate ? new Date(paymentDate) : undefined,
        status,
      },
    });
    res.json(payroll);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete a payroll record
export const deletePayroll = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await prisma.payroll.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};
