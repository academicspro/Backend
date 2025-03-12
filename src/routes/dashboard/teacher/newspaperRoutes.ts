import express from 'express';
import { getAllNewspapers, getNewspaperById, createNewspaper, updateNewspaper, deleteNewspaper } from '../../../controller/DashboardController/teacher/newspaperController';

const router = express.Router();


router.get('/newspapers', getAllNewspapers);
router.get('/newspapers/:id', getNewspaperById);
router.post('/newspapers', createNewspaper);
router.put('/newspapers/:id', updateNewspaper);
router.delete('/newspapers/:id', deleteNewspaper);

export default router;