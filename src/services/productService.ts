
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

// Helper function to map database records to our Product interface
const mapDatabaseToProduct = (record: any): Product => {
  return {
    id: record.id,
    name: record.name,
    sku: record.sku,
    price: record.price,
    discountPrice: record.discount_price,
    brand: record.brand,
    category: record.category,
    compatibleModels: record.compatible_models || [],
    description: record.description,
    features: record.features || [],
    images: record.images || [],
    stock: record.stock,
    isNew: record.is_new,
    isSpecialOrder: record.is_special_order
  };
};

// Helper function to map our Product interface to database format
const mapProductToDatabase = (product: Partial<Product>) => {
  return {
    name: product.name,
    sku: product.sku,
    price: product.price,
    discount_price: product.discountPrice,
    brand: product.brand,
    category: product.category,
    compatible_models: product.compatibleModels,
    description: product.description,
    features: product.features,
    images: product.images,
    stock: product.stock,
    is_new: product.isNew,
    is_special_order: product.isSpecialOrder
  };
};

// Helper function to handle errors
const handleError = (error: any, message: string) => {
  console.error(message, error);
  throw error;
};

export const getProducts = async (): Promise<Product[]> => {
  console.log("Calling getProducts in productService");
  try {
    const { data, error } = await supabase.from("products").select("*");
    
    if (error) {
      return handleError(error, "Error fetching products:");
    }
    
    return (data || []).map(mapDatabaseToProduct);
  } catch (err) {
    return handleError(err, "Exception in getProducts:");
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  console.log("Fetching products by category:", category);
  if (category === "todos") {
    return getProducts();
  }
  
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category);
    
    if (error) {
      return handleError(error, "Error fetching products by category:");
    }
    
    return (data || []).map(mapDatabaseToProduct);
  } catch (err) {
    return handleError(err, "Exception in getProductsByCategory:");
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  console.log("Searching products with query:", query);
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .or(`name.ilike.%${query}%, sku.ilike.%${query}%, brand.ilike.%${query}%`);
    
    if (error) {
      return handleError(error, "Error searching products:");
    }
    
    return (data || []).map(mapDatabaseToProduct);
  } catch (err) {
    return handleError(err, "Exception in searchProducts:");
  }
};

export const getProduct = async (id: string): Promise<Product> => {
  console.log("Fetching product with id:", id);
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      return handleError(error, "Error fetching product:");
    }
    
    return mapDatabaseToProduct(data);
  } catch (err) {
    return handleError(err, "Exception in getProduct:");
  }
};

export const createProduct = async (product: Omit<Product, "id">): Promise<Product> => {
  console.log("Creating product:", product);
  try {
    // Convert to database format
    const dbProduct = mapProductToDatabase(product);
    
    const { data, error } = await supabase
      .from("products")
      .insert(dbProduct)
      .select()
      .single();
    
    if (error) {
      return handleError(error, "Error creating product:");
    }
    
    return mapDatabaseToProduct(data);
  } catch (err) {
    return handleError(err, "Exception in createProduct:");
  }
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  console.log("Updating product:", id, product);
  try {
    // Convert to database format
    const dbProduct = mapProductToDatabase(product);

    const { data, error } = await supabase
      .from("products")
      .update(dbProduct)
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      return handleError(error, "Error updating product:");
    }
    
    return mapDatabaseToProduct(data);
  } catch (err) {
    return handleError(err, "Exception in updateProduct:");
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  console.log("Deleting product:", id);
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);
    
    if (error) {
      return handleError(error, "Error deleting product:");
    }
    
    return true;
  } catch (err) {
    return handleError(err, "Exception in deleteProduct:");
  }
};

export const getCategories = async () => {
  console.log("Fetching categories");
  try {
    const { data, error } = await supabase.from("categories").select("*");
    
    if (error) {
      return handleError(error, "Error fetching categories:");
    }
    
    return data || [];
  } catch (err) {
    return handleError(err, "Exception in getCategories:");
  }
};
