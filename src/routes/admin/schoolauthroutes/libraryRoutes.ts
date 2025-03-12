import express from 'express';
import { deleteLibrary, getAllLibrary, getLibraryById, registerLibrary, updateLibrary } from '../../../controller/admin/schoolauth/registerLibraryController';


const router = express.Router();

router.post('/library', registerLibrary);
router.get('/library', getAllLibrary);
router.get('/library/:id', getLibraryById);
router.put('/library/:id', updateLibrary);
router.delete('/library/:id', deleteLibrary);

export default router;
