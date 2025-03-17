import { Router } from 'express';
import { getDesignations, getDesignationById, createDesignation, updateDesignation, deleteDesignation, assignUserToDesignation, removeUserFromDesignation } from '../../../../controller/DashboardController/admin/hrm/designationController';

const router = Router();

// Get all designations for a school
router.get('/:schoolId/designations', getDesignations);

// Get a specific designation by ID
router.get('/designation/:id', getDesignationById);

// Create a new designation
router.post('/:schoolId/designation', createDesignation);

// Update a designation
router.put('/designation/:id', updateDesignation);

// Delete a designation
router.delete('/designation/:id', deleteDesignation);

// Assign a user to a designation
router.post('/user/:userId/assign-designation', assignUserToDesignation);

// Remove a user from a designation
router.delete('/user/:userId/remove-designation', removeUserFromDesignation);

export default router;
