import { Request,Response, NextFunction } from "express";
import { prisma} from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";


  // Create a new doubt
  export const createDoubt = async (req: Request, res: Response, next:NextFunction) => {
    const { title, content, userId } = req.body;
    try {
      const doubt = await prisma.doubt.create({
        data: { title, content, userId },
      });
      res.status(201).json(doubt);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  

// Get all doubts
export const getAllDoubts = async (req: Request, res: Response, next:NextFunction) => {
    try {
      const doubts = await prisma.doubt.findMany({
        include: { answers: true }, // Include related answers
      });
      res.status(200).json(doubts);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  
  // Get a single doubt by ID
  export const getDoubtById = async (req: Request, res: Response, next:NextFunction): Promise<any> => {
    const { id } = req.params;
    try {
      const doubt = await prisma.doubt.findUnique({
        where: { id },
        include: { answers: true },
      });
      if (!doubt) {
        return res.status(404).json({ error: 'Doubt not found' });
      }
      res.status(200).json(doubt);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  

  // Update a doubt
  export const updateDoubt = async (req: Request, res: Response, next:NextFunction) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
      const doubt = await prisma.doubt.update({
        where: { id },
        data: { title, content },
      });
      res.status(200).json(doubt);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  
  // Delete a doubt
  export const deleteDoubt = async (req: Request, res: Response, next:NextFunction) => {
    const { id } = req.params;
    try {
      await prisma.doubt.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
        next(handlePrismaError(error));
    }
  };