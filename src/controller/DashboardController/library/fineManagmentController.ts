import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";


// Pay Fine
export const payFine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fineId } = req.params;
        const fine = await prisma.fine.update({
            where: { id: fineId },
            data: { paid: true },
        });
        await prisma.bookIssue.update({
            where: { id: fine.bookIssueId },
            data: { finePaid: true },
        });
        res.json(fine);
    } catch (error) {
        next(error);
    }
};

// Get All Fines

// Create a Fine

// Get Single Fine

// Update Fine

// Delete Fine

