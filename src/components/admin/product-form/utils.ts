
import { Product, Category } from "@/types/product";
import { ProductFormDefaults, ProductFormValues } from "./schema";

/**
 * Transform a Product object to form default values
 */
export const getDefaultValues = (product?: Product): ProductFormDefaults => {
  if (!product) {
    return {
      name: "",
      sku: "",
      price: 0,
      discountPrice: 0,
      brand: "",
      category: "motor",
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
    price: product.price || 0,
    discountPrice: product.discountPrice || 0,
    brand: product.brand,
    category: product.category,
    compatibleModels: product.compatibleModels ? product.compatibleModels.join(", ") : "",
    description: product.description || "",
    features: product.features ? product.features.join("\n") : "",
    images: product.images ? product.images.join(", ") : "",
    stock: product.stock || 0,
    isNew: product.isNew || false,
    isSpecialOrder: product.isSpecialOrder || false,
  };
};

/**
 * Transform the form values to a Product object
 */
export const transformFormToProduct = (values: ProductFormValues): Product => {
  return {
    ...(values.id ? { id: values.id } : {}),
    name: values.name,
    sku: values.sku,
    price: values.price,
    discountPrice: values.discountPrice,
    brand: values.brand,
    category: values.category as Category,
    compatibleModels: typeof values.compatibleModels === 'string' 
      ? values.compatibleModels.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : values.compatibleModels,
    description: values.description,
    features: typeof values.features === 'string'
      ? values.features.split('\n').filter(s => s.trim().length > 0)
      : values.features,
    images: typeof values.images === 'string'
      ? values.images.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : values.images,
    stock: values.stock,
    isNew: values.isNew,
    isSpecialOrder: values.isSpecialOrder,
  };
};
