import { Request ,Response,NextFunction} from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";



  // Create a new topic
  export const createTopic = async (req: Request, res: Response, next: NextFunction) => {
    const { name, roadmapId } = req.body;
    try {
      const topic = await prisma.topic.create({ 
        data: { name, roadmapId },
      });
      res.status(201).json(topic);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };

// Get all topics for a roadmap
export const getTopicsByRoadmapId = async (req: Request, res: Response, next: NextFunction) => {
    const { roadmapId } = req.params;
    try {
      const topics = await prisma.topic.findMany({
        where: { roadmapId },
      });
      res.status(200).json(topics);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  
  // Get a single topic by ID
  export const getTopicById = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
    const { id } = req.params;
    try {
      const topic = await prisma.topic.findUnique({
        where: { id },
      });
      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' });
      }
      res.status(200).json(topic);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  

  
  // Update a topic
  export const updateTopic = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const topic = await prisma.topic.update({
        where: { id },
        data: { name },
      });
      res.status(200).json(topic);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  
  // Delete a topic
  export const deleteTopic = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      await prisma.topic.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
        next(handlePrismaError(error));
    }
  };