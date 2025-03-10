import { NextFunction, Request, Response } from "express";
import { prisma } from "../../db/prisma";
import { handlePrismaError } from "../../utils/prismaErrorHandler";

// Create Feedback

export const createFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, schoolId } = req.body;

    const feedback = await prisma.feedback.create({
      data: {
        title,
        description,
        School: {
          connect: { id: schoolId }, // Ensuring the school exists
        },
      },
    });

    res.status(201).json(feedback);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all Feedback

export const getAllFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const feedbacks = await prisma.feedback.findMany();

    res.status(200).json(feedbacks);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get Feedback by ID

export const getFeedbackById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { feedbackId } = req.params;

    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
    });

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json(feedback);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get a School's Feedback
export const getFeedbackBySchool = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { schoolId } = req.params;

    const feedbacks = await prisma.feedback.findMany({
      where: { schoolId },
    });

    res.status(200).json(feedbacks);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update Feedback
export const updateFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { feedbackId } = req.params;
    const { title, description } = req.body;

    const updatedFeedback = await prisma.feedback.update({
      where: { id: feedbackId },
      data: {
        title,
        description,
      },
    });

    res.status(200).json(updatedFeedback);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete Feedback

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
