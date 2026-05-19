import express from 'express';
import { getAllUsers, deleteUser } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getAllUsers);
router.delete('/:id', verifyToken, deleteUser);

export default router;