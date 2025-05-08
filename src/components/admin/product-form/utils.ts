
import { Product } from "@/types/product";
import { ProductFormValues } from "./schema";
import { Category } from "@/data/products";

/**
 * Transforma un producto a valores de formulario
 * @param product Producto a transformar
 * @returns Valores para el formulario de producto
 */
export const productToFormValues = (product: Product): ProductFormValues => {
  return {
    name: product.name,
    sku: product.sku,
    price: product.price,
    discountPrice: product.discount_price || 0,
    brand: product.brand,
    category: product.category as Category,
    compatibleModels: product.compatible_models ? product.compatible_models.join('\n') : '',
    description: product.description,
    features: product.features ? product.features.join('\n') : '',
    images: product.images ? product.images.join('\n') : '',
    stock: product.stock,
    isNew: product.is_new || false,
    isSpecialOrder: product.is_special_order || false,
  };
};

/**
 * Transforma valores de formulario a un producto
 * @param values Valores del formulario
 * @returns Producto
 */
export const formValuesToProduct = (values: ProductFormValues, existingId?: string): Product => {
  const product: Product = {
    id: existingId || crypto.randomUUID(),
    name: values.name,
    sku: values.sku,
    price: values.price,
    discount_price: values.discountPrice > 0 ? values.discountPrice : null,
    brand: values.brand,
    category: values.category,
    description: values.description,
    stock: values.stock,
    is_new: values.isNew,
    is_special_order: values.isSpecialOrder,
    // Procesamos los campos que pueden ser strings o arrays
    compatible_models: typeof values.compatibleModels === 'string' 
      ? values.compatibleModels.split('\n').filter(item => item.trim() !== '') 
      : (values.compatibleModels || []),
    features: typeof values.features === 'string'
      ? values.features.split('\n').filter(item => item.trim() !== '')
      : (values.features || []),
    images: typeof values.images === 'string'
      ? values.images.split('\n').filter(item => item.trim() !== '')
      : (values.images || []),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  return product;
};
