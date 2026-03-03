import { z } from 'zod';

// Esquema de validación que debe calzar exacto con tu Product.cs de ASP.NET
export const productSchema = z.object({
  id: z.number().optional(), // El Backend lo generará (Autoincremental)
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100),
  price: z.coerce.number().min(0.01, 'El precio debe ser mayor a 0'), // z.coerce transforma strings a numbers
  quantity: z.coerce.number().int().min(0, 'La cantidad no puede ser negativa'),
});

// Inferimos los Tipos TypeScript a partir del esquema
export type Product = z.infer<typeof productSchema>;
export type ProductFormData = Omit<Product, 'id'>;