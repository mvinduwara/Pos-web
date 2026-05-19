import express from 'express';
import { createTransaction, getAllTransactions } from '../controllers/transactionController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createTransaction);
router.get('/', verifyToken, getAllTransactions);

export default router;