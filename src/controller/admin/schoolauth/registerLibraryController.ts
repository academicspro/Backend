import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { sendRegistrationEmail } from "../../../config/email";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";

// Create Library User

export const registerLibrary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, schoolId } = req.body;
    if (!name || !email || !phone || !schoolId) {
      res.status(400).json({ error: "Please provide all the required fields." });
      return;
    }

    const tempPassword = randomBytes(6).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: "library",
        school: {
          connect: { id: schoolId },
        },
      },
    });

    const library = await prisma.library.create({
      data: {
        school: {
          connect: { id: schoolId },
        },
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        libraryId: library.id,
      },
    });

    await sendRegistrationEmail(email, tempPassword);
    res.status(201).json({ message: "Library User registered successfully." });
  } catch (error) {
    next(handlePrismaError(error));
  }
};


// Get all Library Users

export const getAllLibrary = async (req: Request, res: Response) => {
  try {
    const library = await prisma.user.findMany({
      where: {
        role: "library",
      },
    });

    res.status(200).json(library);
  } catch (error) {
    console.error("Error getting Library Users:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Get Library User by ID

export const getLibraryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const library = await prisma.library.findUnique({
      where: { id },
    });

    if (!library) {
      res.status(404).json({ error: "Library User not found." });
      return;
    }

    res.status(200).json(library);
  } catch (error) {
    console.error("Error getting Library User:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};


// Update Library User

export const updateLibrary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const library = await prisma.library.update({
      where: { id },
      data: {
        user: {
          update: {
            name,
            email,
            phone,
          },
        },
      },
    });

    res.status(200).json({ message: "Library User updated successfully.", library });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete Library User


export const deleteLibrary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: "Library User deleted successfully." });
  } catch (error) {
    console.error("Error deleting Library User:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};