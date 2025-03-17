// Routes file (routes/medicalEmergencies.ts)
import express from 'express';
import { getMedicalEmergencies, getMedicalEmergencyById, createMedicalEmergency, updateMedicalEmergency, deleteMedicalEmergency } from '../../../controller/DashboardController/hostel/medicalEmergencyController';


const router = express.Router();

router.get('/', getMedicalEmergencies);
router.get('/:id', getMedicalEmergencyById);
router.post('/', createMedicalEmergency);
router.put('/:id', updateMedicalEmergency);
router.delete('/:id', deleteMedicalEmergency);

export default router;
