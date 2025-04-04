
import * as z from "zod";
import { Category } from "@/types/product";

// Define the form schema with proper transformations
export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  sku: z.string().min(3, { message: "El SKU debe tener al menos 3 caracteres" }),
  price: z.coerce.number().min(0, { message: "El precio debe ser mayor o igual a 0" }),
  discountPrice: z.coerce.number().min(0, { message: "El precio con descuento debe ser mayor o igual a 0" }).optional(),
  brand: z.string().min(1, { message: "La marca es requerida" }),
  category: z.enum([
    "motor", "frenos", "electricos", "suspension", "carroceria", 
    "aceites", "filtros", "transmision", "llantas", "accesorios"
  ]),
  compatibleModels: z.string().transform(str => str.split(',').map(s => s.trim())),
  description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
  features: z.string().transform(str => str.split('\n').filter(s => s.trim().length > 0)),
  images: z.string().transform(str => str.split(',').map(s => s.trim())),
  stock: z.coerce.number().int().min(0, { message: "El stock debe ser un número entero positivo" }),
  isNew: z.boolean().optional(),
  isSpecialOrder: z.boolean().optional(),
});

// Infer the form values type from the schema
export type ProductFormValues = z.infer<typeof productSchema>;

// Define a type for the form's default values
export type ProductFormDefaults = {
  id?: string;
  name: string;
  sku: string;
  price: number;
  discountPrice?: number;
  brand: string;
  category: Category;
  compatibleModels: string; // String for input
  description: string;
  features: string; // String for input
  images: string; // String for input
  stock: number;
  isNew: boolean;
  isSpecialOrder: boolean;
};
