import { Request,Response,NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";


// Issue a Book
export const issueBook = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
    try {
        const { libraryId } = req.params;
        const { bookCopyId, userId, dueDate } = req.body;

        const library = await prisma.library.findUnique({ where: { id: libraryId } });
        if (!library || !req.user || (library.userId && library.userId !== req.user.id) && req.user.role !== 'superadmin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const copy = await prisma.bookCopy.findUnique({ where: { id: bookCopyId } });
        if (!copy || copy.status !== 'AVAILABLE') {
            return res.status(400).json({ error: 'Book copy not available' });
        }

        const issue = await prisma.bookIssue.create({
            data: {
                bookCopyId,
                userId,
                issueDate: new Date(),
                dueDate: new Date(dueDate),
            },
        });
        await prisma.bookCopy.update({ where: { id: bookCopyId }, data: { status: 'ISSUED' } });
        res.status(201).json(issue);
    } catch (error) {
        next(handlePrismaError(error));
    }
};

// Return a Book
export const returnBook = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
    try {
        const { libraryId, issueId } = req.params;

        const library = await prisma.library.findUnique({ where: { id: libraryId } });
        if (!library || !req.user || (library.userId && library.userId !== req.user.id) && req.user.role !== 'superadmin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const issue = await prisma.bookIssue.findUnique({ where: { id: issueId } });
        if (!issue || issue.returnDate) {
            return res.status(400).json({ error: 'Book already returned or not found' });
        }

        const returnDate = new Date();
        let fineAmount = 0;
        if (returnDate > new Date(issue.dueDate)) {
            const daysLate = Math.ceil((returnDate.getTime() - new Date(issue.dueDate).getTime()) / (1000 * 60 * 60 * 24));
            fineAmount = daysLate * library.finePerDay;
        }

        const updatedIssue = await prisma.bookIssue.update({
            where: { id: issueId },
            data: { returnDate, fineAmount },
        });
        await prisma.bookCopy.update({ where: { id: issue.bookCopyId }, data: { status: 'AVAILABLE' } });

        if (fineAmount > 0) {
            await prisma.fine.create({
                data: { bookIssueId: issueId, amount: fineAmount, reason: 'Late return' },
            });
        }
        res.json(updatedIssue);
    } catch (error) {
        next(handlePrismaError(error));
    }
};