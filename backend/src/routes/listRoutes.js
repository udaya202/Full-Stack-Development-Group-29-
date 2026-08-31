import express from 'express';
import { getLists, getListById, createList, updateList, deleteList } from '../controllers/listController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All list routes protected by JWT middleware
router.use(authenticateToken);

router.get('/', getLists);
router.get('/:id', getListById);
router.post('/', createList);
router.put('/:id', updateList);
router.delete('/:id', deleteList);

export default router;
