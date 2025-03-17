import express from 'express';
import { getDuties, getDutyById, createDuty, updateDuty, deleteDuty, assignDutyToUser, removeDutyFromUser } from '../../../../controller/DashboardController/admin/hrm/dutyController';

const router = express.Router();

// Routes for CRUD operations on duties
router.get('/school/:schoolId/duties', getDuties);
router.get('/duties/:id', getDutyById);
router.post('/school/:schoolId/duties', createDuty);
router.put('/duties/:id', updateDuty);
router.delete('/duties/:id', deleteDuty);

// Routes for assigning and removing users from duties
router.post('/duties/:dutyId/assign/:userId', assignDutyToUser);
router.delete('/duties/:dutyId/remove/:userId', removeDutyFromUser);

export default router;
