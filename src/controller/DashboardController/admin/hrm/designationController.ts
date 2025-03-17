import { Request, Response } from 'express';
import { prisma } from '../../../../db/prisma';

// Get all designations for a school
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

// Get a single designation by ID
export const getDesignationById = async (req: Request, res: Response):Promise<any> => {
  const { id } = req.params;
  try {
    const designation = await prisma.designation.findUnique({
      where: { id },
      include: { users: { select: { id: true, name: true } } },
    });

    if (!designation) return res.status(404).json({ error: 'Designation not found' });

    res.json(designation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch designation' });
  }
};

// Create a new designation
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

// Update an existing designation
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

// Delete a designation
export const deleteDesignation = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.designation.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete designation' });
  }
};

// Assign a user to a designation
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

// Remove a user from a designation
export const removeUserFromDesignation = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { designationId: null },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove user from designation' });
  }
};
