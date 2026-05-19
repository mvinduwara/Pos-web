import { Product } from '../models/index.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.findAll();
  res.status(200).json(products);
});

export const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findByPk(req.params.id);
  
  if (!product) {
    return next(new AppError('Product not found', 404));
  }
  
  res.status(200).json(product);
});

export const createProduct = asyncHandler(async (req, res, next) => {
  const { sku, name, price, stock, category } = req.body;
  const newProduct = await Product.create({ sku, name, price, stock, category });
  res.status(201).json(newProduct);
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByPk(req.params.id);
  
  if (!product) {
    return next(new AppError('Product not found', 404));
  }
  
  await product.update({ 
    sku: req.body.sku, 
    name: req.body.name, 
    price: req.body.price, 
    stock: req.body.stock, 
    category: req.body.category 
  });
  
  res.status(200).json(product);
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByPk(req.params.id);
  
  if (!product) {
    return next(new AppError('Product not found', 404));
  }
  
  await product.destroy();
  res.status(200).json({ message: 'Product deleted successfully' });
});