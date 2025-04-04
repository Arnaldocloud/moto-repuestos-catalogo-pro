
import { Product } from "@/types/product";
import { ProductFormDefaults } from "./schema";

// Helper function to prepare default values for the form
export const getDefaultValues = (initialData?: Product): ProductFormDefaults => {
  if (!initialData) {
    return {
      name: "",
      sku: "",
      price: 0,
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
    ...initialData,
    compatibleModels: Array.isArray(initialData.compatibleModels) 
      ? initialData.compatibleModels.join(", ")
      : "",
    features: Array.isArray(initialData.features) 
      ? initialData.features.join("\n") 
      : "",
    images: Array.isArray(initialData.images) 
      ? initialData.images.join(", ") 
      : "",
    isNew: initialData.isNew || false,
    isSpecialOrder: initialData.isSpecialOrder || false,
  };
};

// Helper function to transform form values back to product data
export const transformFormToProduct = (values: ProductFormValues): Product => {
  return {
    id: values.id || String(Date.now()),
    name: values.name,
    sku: values.sku,
    price: values.price,
    discountPrice: values.discountPrice,
    brand: values.brand,
    category: values.category,
    compatibleModels: Array.isArray(values.compatibleModels) 
      ? values.compatibleModels 
      : values.compatibleModels.split(',').map(s => s.trim()),
    description: values.description,
    features: Array.isArray(values.features) 
      ? values.features 
      : values.features.split('\n').filter(s => s.trim().length > 0),
    images: Array.isArray(values.images) 
      ? values.images 
      : values.images.split(',').map(s => s.trim()),
    stock: values.stock,
    isNew: values.isNew,
    isSpecialOrder: values.isSpecialOrder,
  };
};
