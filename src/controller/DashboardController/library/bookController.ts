import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";

// Create a Book
export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { libraryId } = req.params;
    const {
      title,
      isbn,
      publicationDate,
      genre,
      type,
      department,
      class: className,
      subject,
      edition,
      authors,
    } = req.body;

    // Check if user is library manager or school admin
    const library = await prisma.library.findUnique({ where: { id: libraryId } });
    if (!library || !req.user || (library.userId && library.userId !== req.user.id && req.user.role !== "admin")) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const book = await prisma.book.create({
      data: {
        title,
        isbn,
        publicationDate,
        genre,
        type,
        department,
        class: className,
        subject,
        edition,
        libraryId,
        authors: {
          create: authors.map((authorId: string) => ({ authorId })),
        },
      },
    });

    res.status(201).json(book);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get All Books
export const getBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { libraryId } = req.params;
    const books = await prisma.book.findMany({ where: { libraryId }, include: { authors: true, copies: true } });
    res.json(books);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get Single Book
export const getBookById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;
    const book = await prisma.book.findUnique({ where: { id: bookId }, include: { authors: true, copies: true } });
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update Book
export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;
    const updatedBook = await prisma.book.update({ where: { id: bookId }, data: req.body });
    res.json(updatedBook);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete Book
export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;
    await prisma.book.delete({ where: { id: bookId } });
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};
