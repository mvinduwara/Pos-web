import { z } from 'zod';

export const productSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  category: z.string().min(1, "Category is required")
});