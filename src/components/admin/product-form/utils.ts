
import { Product } from "@/types/product";
import { ProductFormValues, ProductFormDefaults } from "./schema";

/**
 * Gets default values for the product form
 * @param product Product to get default values from
 * @returns Default values for the product form
 */
export const getDefaultValues = (product?: Product): ProductFormDefaults => {
  if (!product) {
    return {
      name: "",
      sku: "",
      price: 0,
      discountPrice: 0,
      brand: "",
      category: "accesorios",
      compatibleModels: "",
      description: "",
      features: "",
      images: "",
      stock: 0,
      isNew: false,
      isSpecialOrder: false,
    };
  }
  
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    price: product.price,
    discountPrice: product.discountPrice || 0,
    brand: product.brand,
    category: product.category,
    compatibleModels: Array.isArray(product.compatibleModels) ? product.compatibleModels.join('\n') : '',
    description: product.description,
    features: Array.isArray(product.features) ? product.features.join('\n') : '',
    images: Array.isArray(product.images) ? product.images.join('\n') : '',
    stock: product.stock,
    isNew: product.isNew || false,
    isSpecialOrder: product.isSpecialOrder || false,
  };
};

/**
 * Transforms form values to a product
 * @param values Form values
 * @param existingId Existing product ID
 * @returns Product
 */
export const transformFormToProduct = (values: ProductFormValues, existingId?: string): Product => {
  const product: Product = {
    id: existingId || crypto.randomUUID(),
    name: values.name,
    sku: values.sku,
    price: values.price,
    discountPrice: values.discountPrice > 0 ? values.discountPrice : null,
    brand: values.brand,
    category: values.category,
    description: values.description,
    stock: values.stock,
    isNew: values.isNew,
    isSpecialOrder: values.isSpecialOrder,
    // Process fields that can be strings or arrays
    compatibleModels: values.compatibleModels 
      ? values.compatibleModels.split('\n').filter(item => item.trim() !== '') 
      : [],
    features: values.features
      ? values.features.split('\n').filter(item => item.trim() !== '')
      : [],
    images: values.images
      ? values.images.split('\n').filter(item => item.trim() !== '')
      : [],
    // Use the existing properties directly from the Product type
  };
  
  return product;
};
