import { Request,Response,NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";



  // Create a new competition
  export const createCompetition = async (req: Request, res: Response, next: NextFunction) => {
    const { name, userId, score } = req.body;
    try {
      const competition = await prisma.competition.create({
        data: { name, userId, score },
      });
      res.status(201).json(competition);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };


// Get all competitions
export const getAllCompetitions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const competitions = await prisma.competition.findMany();
      res.status(200).json(competitions);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  
  // Get a single competition by ID
  export const getCompetitionById = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
    const { id } = req.params;
    try {
      const competition = await prisma.competition.findUnique({
        where: { id },
      });
      if (!competition) {
        return res.status(404).json({ error: 'Competition not found' });
      }
      res.status(200).json(competition);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  

  
  // Update a competition
  export const updateCompetition = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, score } = req.body;
    try {
      const competition = await prisma.competition.update({
        where: { id },
        data: { name, score },
      });
      res.status(200).json(competition);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  
  // Delete a competition
  export const deleteCompetition = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      await prisma.competition.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
        next(handlePrismaError(error));
    }
  };