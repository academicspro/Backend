import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import * as QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";

// Create a new visitor and issue a QR code
export const createVisitor = async (req: Request, res: Response, next:NextFunction) => {
  const { name, phone, email, purpose, validFrom, validUntil, schoolId } = req.body;

  // Basic input validation
  if (!name || !phone || !purpose || !validFrom || !validUntil || !schoolId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Validate school existence
  const school = await prisma.school.findUnique({ where: { id: schoolId } });
  if (!school) {
    return res.status(404).json({ error: "School not found" });
  }

  // Generate unique token for QR code
  const token = uuidv4();

  try {
    // Create visitor record
    const visitor = await prisma.visitor.create({
      data: {
        name,
        phone,
        email,
        purpose,
        token,
        validFrom: new Date(validFrom),
        validUntil: new Date(validUntil),
        schoolId,
      },
    });

    // Generate QR code with the token
    const qrCodeData = await QRCode.toDataURL(token);

    return res.status(201).json({
      visitorId: visitor.id,
      token,
      qrCodeData, // QR code as a data URL
    });
  } catch (error) {
   next(handlePrismaError(error));
  }
};

// Verify visitor entry
export const verifyEntry = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  const now = new Date();

  // Find visitor by token
  const visitor = await prisma.visitor.findUnique({ where: { token } });
  if (!visitor) {
    return res.status(404).json({ error: "Visitor not found" });
  }

  // Check if the QR code is within the valid time period
  if (now < visitor.validFrom || now > visitor.validUntil) {
    return res.status(403).json({ error: "Visitor pass is not valid at this time" });
  }

  // Check if entry has already been recorded
  if (visitor.entryTime) {
    return res.status(400).json({ error: "Visitor has already entered" });
  }

  // Record entry time
  await prisma.visitor.update({
    where: { id: visitor.id },
    data: { entryTime: now },
  });

  return res.json({ success: true, message: "Entry recorded successfully" });
};

// Verify visitor exit
export const verifyExit = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  const now = new Date();

  // Find visitor by token
  const visitor = await prisma.visitor.findUnique({ where: { token } });
  if (!visitor) {
    return res.status(404).json({ error: "Visitor not found" });
  }

  // Check if visitor has entered
  if (!visitor.entryTime) {
    return res.status(400).json({ error: "Visitor has not entered yet" });
  }

  // Check if exit has already been recorded
  if (visitor.exitTime) {
    return res.status(400).json({ error: "Visitor has already exited" });
  }

  // Record exit time
  await prisma.visitor.update({
    where: { id: visitor.id },
    data: { exitTime: now },
  });

  return res.json({ success: true, message: "Exit recorded successfully" });
};
