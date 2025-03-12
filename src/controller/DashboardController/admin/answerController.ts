import { Request,Response,NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";



  // Create a new answer
  export const createAnswer = async (req: Request, res: Response, next:NextFunction) => {
    const { content, userId, doubtId } = req.body;
    try {
      const answer = await prisma.answer.create({
        data: { content, userId, doubtId },
      });
      res.status(201).json(answer);
    } catch (error) {
             next(handlePrismaError(error));
    }
  };

// Get all answers for a doubt
export const getAnswersByDoubtId = async (req: Request, res: Response, next:NextFunction) => {
    const { doubtId } = req.params;
    try {
      const answers = await prisma.answer.findMany({
        where: { doubtId },
      });
      res.status(200).json(answers);
    } catch (error) {
          next(handlePrismaError(error));
    }
  };
  
  // Get a single answer by ID
  export const getAnswerById = async (req: Request, res: Response, next:NextFunction):Promise<any> => {
    const { id } = req.params;
    try {
      const answer = await prisma.answer.findUnique({
        where: { id },
      });
      if (!answer) {
        return res.status(404).json({ error: 'Answer not found' });
      }
      res.status(200).json(answer);
    } catch (error) {
             next(handlePrismaError(error));
    }
  };
  

  
  // Update an answer
  export const updateAnswer = async (req: Request, res: Response, next:NextFunction) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
      const answer = await prisma.answer.update({
        where: { id },
        data: { content },
      });
      res.status(200).json(answer);
    } catch (error) {
             next(handlePrismaError(error));
    }
  };
  
  // Delete an answer
  export const deleteAnswer = async (req: Request, res: Response, next:NextFunction) => {
    const { id } = req.params;
    try {
      await prisma.answer.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
             next(handlePrismaError(error));
    }
  };