import { Request,Response,NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";





  // Create a new roadmap
  export const createRoadmap = async (req: Request, res: Response, next: NextFunction) => {
    const { title, userId } = req.body;
    try {
      const roadmap = await prisma.roadmap.create({
        data: { title, userId },
      });
      res.status(201).json(roadmap);
    } catch (error) {
      next(handlePrismaError(error));
    }
  };

// Get all roadmaps
export const getAllRoadmaps = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roadmaps = await prisma.roadmap.findMany({
        include: { topics: true },
      });
      res.status(200).json(roadmaps);
    } catch (error) {
      next(handlePrismaError(error));
    }
  };
  
  // Get a single roadmap by ID
  export const getRoadmapById = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
    const { id } = req.params;
    try {
      const roadmap = await prisma.roadmap.findUnique({
        where: { id },
        include: { topics: true },
      });
      if (!roadmap) {
        return res.status(404).json({ error: 'Roadmap not found' });
      }
      res.status(200).json(roadmap);
    } catch (error) {
      next(handlePrismaError(error));
    }
  };
  

  
  // Update a roadmap
  export const updateRoadmap = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title } = req.body;
    try {
      const roadmap = await prisma.roadmap.update({
        where: { id },
        data: { title },
      });
      res.status(200).json(roadmap);
    } catch (error) {
      next(handlePrismaError(error));
    }
  };
  
  // Delete a roadmap
  export const deleteRoadmap = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      await prisma.roadmap.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
      next(handlePrismaError(error));
    }
  };