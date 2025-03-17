import { Request, Response } from 'express';
import { prisma } from '../../../../db/prisma';

export const getDesignations = async (req: Request, res: Response) => {
  const { schoolId } = req.params;
  try {
    const designations = await prisma.designation.findMany({
      where: { schoolId },
      include: { users: { select: { id: true, name: true } } },
    });
    res.json(designations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch designations' });
  }
};

export const createDesignation = async (req: Request, res: Response) => {
  const { schoolId } = req.params;
  const { name, description } = req.body;
  try {
    const designation = await prisma.designation.create({
      data: { name, description, schoolId },
    });
    res.status(201).json(designation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create designation' });
  }
};

export const updateDesignation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const designation = await prisma.designation.update({
      where: { id },
      data: { name, description },
    });
    res.json(designation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update designation' });
  }
};

export const deleteDesignation = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.designation.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete designation' });
  }
};

export const assignUserToDesignation = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { designationId } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { designationId },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign designation' });
  }
};