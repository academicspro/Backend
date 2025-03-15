import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { io } from "../../../index";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";

export const recordAttendance = async (req: Request, res: Response, next: NextFunction) => {
  const { studentId, busId, status } = req.body;
  
  try {
    const attendance = await prisma.busAttendance.create({
      data: { studentId, busId, status, date: new Date() },
    });

    io.emit("attendanceUpdate", attendance); // Emit real-time update
    res.status(201).json(attendance);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attendance = await prisma.busAttendance.findMany({
      include: { student: true, bus: true },
    });

    res.json(attendance);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getAttendanceByStudent = async (req: Request, res: Response, next: NextFunction) => {
  const { studentId } = req.params;
  
  try {
    const attendance = await prisma.busAttendance.findMany({
      where: { studentId },
      include: { bus: true },
    });

    res.json(attendance);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateAttendance = async (req: Request, res: Response, next: NextFunction) => {
  const { attendanceId } = req.params;
  const { status } = req.body;

  try {
    const attendance = await prisma.busAttendance.update({
      where: { id: attendanceId },
      data: { status },
    });

    io.emit("attendanceUpdate", attendance); // Emit real-time update
    res.json(attendance);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteAttendance = async (req: Request, res: Response, next: NextFunction) => {
  const { attendanceId } = req.params;

  try {
    await prisma.busAttendance.delete({ where: { id: attendanceId } });

    io.emit("attendanceUpdate", { attendanceId, deleted: true });
    res.json({ message: "Attendance record deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};
