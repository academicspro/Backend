import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";


// Create an Author
export const createAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const author = await prisma.author.create({ data: { name } });
        res.status(201).json(author);
    } catch (error) {
        next(handlePrismaError(error));
    }
};

// Get All Authors
export const getAuthors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authors = await prisma.author.findMany();
        res.json(authors);
    } catch (error) {
        next(handlePrismaError(error));
    }
};

// Get Single Author
export const getAuthorById = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
    try {
        const { authorId } = req.params;
        const author = await prisma.author.findUnique({ where: { id: authorId } });
        if (!author) return res.status(404).json({ error: 'Author not found' });
        res.json(author);
    } catch (error) {
        next(handlePrismaError(error));
    }
};

// Update Author
export const updateAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorId } = req.params;
        const updatedAuthor = await prisma.author.update({ where: { id: authorId }, data: req.body });
        res.json(updatedAuthor);
    } catch (error) {
        next(handlePrismaError(error));
    }
};

// Delete Author
export const deleteAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorId } = req.params;
        await prisma.author.delete({ where: { id: authorId } });
        res.json({ message: 'Author deleted successfully' });
    } catch (error) {
        next(handlePrismaError(error));
    }
};