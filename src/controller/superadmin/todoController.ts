import { Request, Response, NextFunction } from "express";

import { prisma } from "../../db/prisma";
import { handlePrismaError } from "../../utils/prismaErrorHandler";



export const createTodo = async (req: Request, res: Response,next: NextFunction) => {
    try {
      const { title, description, status, userId } = req.body;
      const todo = await prisma.todo.create({
        data: { title, description, status, userId },
      });
      res.status(201).json(todo);
    } catch (error) {
     next(handlePrismaError(error));
    }
  };
  
  // Get all Todos
  export const getTodos = async (req: Request, res: Response, next:NextFunction) => {
    try {
      const todos = await prisma.todo.findMany();
      res.status(200).json(todos);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  
  // Get a single Todo by ID
  export const getTodoById = async (req: Request, res: Response,next:NextFunction): Promise<any> => {
    try {
      const { id } = req.params;
      const todo = await prisma.todo.findUnique({ where: { id } });
      if (!todo) return res.status(404).json({ error: "Todo not found" });
      res.status(200).json(todo);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  
  // Update a Todo
  export const updateTodo = async (req: Request, res: Response,next:NextFunction) => {
    try {
      const { id } = req.params;
      const { title, description, status } = req.body;
      const todo = await prisma.todo.update({
        where: { id },
        data: { title, description, status },
      });
      res.status(200).json(todo);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  
  // Delete a Todo
  export const deleteTodo = async (req: Request, res: Response, next:NextFunction) => {
    try {
      const { id } = req.params;
      await prisma.todo.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  