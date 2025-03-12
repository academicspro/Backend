import { Request,Response,NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";


  // Create a new newspaper
  export const createNewspaper = async (req: Request, res: Response, next:NextFunction) => {
    const { title, content, userId } = req.body;
    try {
      const newspaper = await prisma.newspaper.create({
        data: { title, content, userId },
      });
      res.status(201).json(newspaper);
    } catch (error) {
         next(handlePrismaError(error));
    }
  };
  

// Get all newspapers
export const getAllNewspapers = async (req: Request, res: Response, next:NextFunction) => {
    try {
      const newspapers = await prisma.newspaper.findMany();
      res.status(200).json(newspapers);
    } catch (error) {
         next(handlePrismaError(error));
    }
  };
  
  // Get a single newspaper by ID
  export const getNewspaperById = async (req: Request, res: Response, next:NextFunction):Promise<any> => {
    const { id } = req.params;
    try {
      const newspaper = await prisma.newspaper.findUnique({
        where: { id },
      });
      if (!newspaper) {
        return res.status(404).json({ error: 'Newspaper not found' });
      }
      res.status(200).json(newspaper);
    } catch (error) {
         next(handlePrismaError(error));
    }
  };
  

  // Update a newspaper
  export const updateNewspaper = async (req: Request, res: Response, next:NextFunction) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
      const newspaper = await prisma.newspaper.update({
        where: { id },
        data: { title, content },
      });
      res.status(200).json(newspaper);
    } catch (error) {
         next(handlePrismaError(error));
    }
  };
  
  // Delete a newspaper
  export const deleteNewspaper = async (req: Request, res: Response, next:NextFunction) => {
    const { id } = req.params;
    try {
      await prisma.newspaper.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
         next(handlePrismaError(error));
    }
  };