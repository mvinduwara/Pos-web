import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', verifyToken, getAllProducts);
router.get('/:id', getProductById);
router.post('/', verifyToken, validate(productSchema), createProduct);
router.put('/:id', verifyToken, validate(productSchema), updateProduct);
router.delete('/:id', deleteProduct);

export default router;