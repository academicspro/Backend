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

export const getDepartmentById = async (req: Request, res: Response):Promise<any> => {
  const { id } = req.params;
  try {
    const department = await prisma.department.findUnique({ where: { id } });
    if (!department) return res.status(404).json({ error: 'Department not found' });
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch department' });
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  const { schoolId } = req.params;
  const { name, description } = req.body;
  try {
    const department = await prisma.department.create({ data: { name, description, schoolId } });
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create department' });
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const department = await prisma.department.update({ where: { id }, data: { name, description } });
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
  const { userId, departmentId } = req.params;
  try {
    const user = await prisma.user.update({ where: { id: userId }, data: { departmentId } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign user to department' });
  }
};

export const removeUserFromDepartment = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.update({ where: { id: userId }, data: { departmentId: null } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove user from department' });
  }
};

export const getDepartmentUsers = async (req: Request, res: Response) => {
  const { departmentId } = req.params;
  try {
    const users = await prisma.user.findMany({
      where: { departmentId },
      select: { id: true, name: true, email: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};