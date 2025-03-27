import { NextFunction, Request, Response } from "express";
import { prisma } from "../../db/prisma";
import { handlePrismaError } from "../../utils/prismaErrorHandler";

// Create Feedback (Initially PENDING)
export const createFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, schoolId } = req.body;

    const feedback = await prisma.feedback.create({
      data: {
        title,
        description,
        status: "PENDING", // Default status
        School: {
          connect: { id: schoolId },
        },
      },
    });

    res.status(201).json(feedback);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all APPROVED Feedback (Publicly Available)
export const getAllFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      where: { status: "APPROVED" },
    });

    res.status(200).json(feedbacks);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get Feedback by ID (Only if APPROVED)
export const getFeedbackById = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const { feedbackId } = req.params;

    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId, status: "APPROVED" },
    });

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found or not approved" });
    }

    res.status(200).json(feedback);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get a School's Feedback (Only APPROVED ones)
export const getFeedbackBySchool = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { schoolId } = req.params;

    const feedbacks = await prisma.feedback.findMany({
      where: { schoolId, status: "APPROVED" },
    });

    res.status(200).json(feedbacks);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Admin: Approve Feedback
export const approveFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { feedbackId } = req.params;

    const updatedFeedback = await prisma.feedback.update({
      where: { id: feedbackId },
      data: { status: "APPROVED" },
    });

    res.status(200).json(updatedFeedback);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Admin: Reject Feedback
export const rejectFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { feedbackId } = req.params;

    const updatedFeedback = await prisma.feedback.update({
      where: { id: feedbackId },
      data: { status: "REJECTED" },
    });

    res.status(200).json(updatedFeedback);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update Feedback (Only if not approved)
export const updateFeedback = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const { feedbackId } = req.params;
    const { title, description } = req.body;

    const feedback = await prisma.feedback.findUnique({ where: { id: feedbackId } });

    if (!feedback || feedback.status === "APPROVED") {
      return res.status(403).json({ message: "Cannot edit approved feedback" });
    }

    const updatedFeedback = await prisma.feedback.update({
      where: { id: feedbackId },
      data: { title, description },
    });

    res.status(200).json(updatedFeedback);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete Feedback (Allowed for any status)
export const deleteFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { feedbackId } = req.params;

    await prisma.feedback.delete({
      where: { id: feedbackId },
    });

    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};
