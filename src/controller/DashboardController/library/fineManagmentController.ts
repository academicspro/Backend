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
export const getAllFines = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fines = await prisma.fine.findMany();
        res.json(fines);
    } catch (error) {
        next(error);
    }
};

// Create a Fine
export const createFine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookIssueId, amount, reason } = req.body;
        const fine = await prisma.fine.create({
            data: { bookIssueId, amount, reason, paid: false },
        });
        res.status(201).json(fine);
    } catch (error) {
        next(error);
    }
};

// Get Single Fine
export const getFineById = async (req: Request, res: Response, next: NextFunction) : Promise<any>=> {
    try {
        const { fineId } = req.params;
        const fine = await prisma.fine.findUnique({ where: { id: fineId } });
        if (!fine) return res.status(404).json({ error: "Fine not found" });
        res.json(fine);
    } catch (error) {
        next(error);
    }
};

// Update Fine
export const updateFine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fineId } = req.params;
        const fine = await prisma.fine.update({
            where: { id: fineId },
            data: req.body,
        });
        res.json(fine);
    } catch (error) {
        next(error);
    }
};

// Delete Fine
export const deleteFine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fineId } = req.params;
        await prisma.fine.delete({ where: { id: fineId } });
        res.json({ message: "Fine deleted successfully" });
    } catch (error) {
        next(error);
    }
};