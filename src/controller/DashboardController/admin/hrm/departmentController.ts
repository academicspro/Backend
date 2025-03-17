import { Request, Response } from 'express';
import { prisma } from '../../../../db/prisma';

export const getDepartments = async (req: Request, res: Response) => {
  const { schoolId } = req.params;
  try {
    const departments = await prisma.department.findMany({
      where: { schoolId },
      include: { users: { select: { id: true, name: true } } },
    });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  const { schoolId } = req.params;
  const { name, description } = req.body;
  try {
    const department = await prisma.department.create({
      data: { name, description, schoolId },
    });
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create department' });
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const department = await prisma.department.update({
      where: { id },
      data: { name, description },
    });
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update department' });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.department.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete department' });
  }
};

export const assignUserToDepartment = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { departmentId } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { departmentId },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign department' });
  }
};