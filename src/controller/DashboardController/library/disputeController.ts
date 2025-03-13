import { Request,Response,NextFunction } from "express";
import { prisma } from "../../../db/prisma";



// Create a Dispute
export const createDispute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { issueId } = req.params;
        const { reason } = req.body;
        const dispute = await prisma.dispute.create({
            data: { bookIssueId: issueId, userId: req.user?.id ?? '', reason },
        });
        res.status(201).json(dispute);
    } catch (error) {
        next(error);
    }
};

// Add Message to a Dispute
export const addDisputeMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { disputeId } = req.params;
        const { message } = req.body;
        const msg = await prisma.disputeMessage.create({
            data: { disputeId, userId: req.user?.id ?? '', message },
        });
        res.status(201).json(msg);
    } catch (error) {
        next(error);
    }
};

// Resolve a Dispute
export const resolveDispute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { disputeId } = req.params;
        const { resolution, status } = req.body;
        const dispute = await prisma.dispute.update({
            where: { id: disputeId },
            data: { status, resolution },
        });
        res.json(dispute);
    } catch (error) {
        next(error);
    }
}; 