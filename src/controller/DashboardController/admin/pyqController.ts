import { Request,Response,NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";



  // Create a new PYQ
  export const createPYQ = async (req: Request, res: Response, next:NextFunction) => {
    const { question, solution, subject, topic, uploaderId } = req.body;
    try {
      const pyq = await prisma.pYQ.create({
        data: { question, solution, subject, topic, uploaderId },
      });
      res.status(201).json(pyq);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };

// Get all PYQs
export const getAllPYQs = async (req: Request, res: Response, next:NextFunction) => {
    try {
      const pyqs = await prisma.pYQ.findMany();
      res.status(200).json(pyqs);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  
  // Get a single PYQ by ID
  export const getPYQById = async (req: Request, res: Response, next:NextFunction): Promise<any> => {
    const { id } = req.params;
    try {
      const pyq = await prisma.pYQ.findUnique({
        where: { id },
      });
      if (!pyq) {
        return res.status(404).json({ error: 'PYQ not found' });
      }
      res.status(200).json(pyq);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  

  
  // Update a PYQ
  export const updatePYQ = async (req: Request, res: Response, next:NextFunction) => {
    const { id } = req.params;
    const { question, solution, subject, topic } = req.body;
    try {
      const pyq = await prisma.pYQ.update({
        where: { id },
        data: { question, solution, subject, topic },
      });
      res.status(200).json(pyq);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  
  // Delete a PYQ
  export const deletePYQ = async (req: Request, res: Response, next:NextFunction) => {
    const { id } = req.params;
    try {
      await prisma.pYQ.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
     next(handlePrismaError(error));
    }
  };