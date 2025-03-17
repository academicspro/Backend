import { Router } from 'express';
import { getDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment, assignUserToDepartment, removeUserFromDepartment, getDepartmentUsers } from '../../../../controller/DashboardController/admin/hrm/departmentController';


const router = Router();

// Department Routes
router.get('/schools/:schoolId/departments', getDepartments);
router.get('/departments/:id', getDepartmentById);
router.post('/schools/:schoolId/departments', createDepartment);
router.put('/departments/:id', updateDepartment);
router.delete('/departments/:id', deleteDepartment);

// User Assignment Routes
router.post('/departments/:departmentId/users/:userId', assignUserToDepartment);
router.delete('/departments/:departmentId/users/:userId', removeUserFromDepartment);
router.get('/departments/:departmentId/users', getDepartmentUsers);

export default router;
