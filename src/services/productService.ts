
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

// Helper function to handle errors
const handleError = (error: any, message: string) => {
  console.error(message, error);
  throw error;
};

// Helper function to format product data for Supabase
const formatProductForSupabase = (product: Partial<Product>) => {
  return {
    name: product.name,
    sku: product.sku,
    price: product.price,
    discount_price: product.discountPrice,
    brand: product.brand,
    category: product.category,
    compatible_models: Array.isArray(product.compatibleModels) 
      ? product.compatibleModels 
      : [],
    description: product.description,
    features: Array.isArray(product.features) 
      ? product.features 
      : [],
    images: Array.isArray(product.images) 
      ? product.images 
      : [],
    stock: product.stock,
    is_new: product.isNew,
    is_special_order: product.isSpecialOrder
  };
};

// Helper function to format Supabase data for our app
const formatSupabaseProduct = (data: any): Product => {
  return {
    id: data.id,
    name: data.name,
    sku: data.sku,
    price: data.price,
    discountPrice: data.discount_price,
    brand: data.brand,
    category: data.category,
    compatibleModels: data.compatible_models || [],
    description: data.description,
    features: data.features || [],
    images: data.images || [],
    stock: data.stock || 0,
    isNew: data.is_new,
    isSpecialOrder: data.is_special_order
  };
};

export const getProducts = async (): Promise<Product[]> => {
  console.log("Calling getProducts in productService");
  try {
    const { data, error } = await supabase.from("products").select("*");
    
    if (error) {
      return handleError(error, "Error fetching products:");
    }
    
    return (data || []).map(formatSupabaseProduct);
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
    
    return (data || []).map(formatSupabaseProduct);
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
    
    return (data || []).map(formatSupabaseProduct);
  } catch (err) {
    return handleError(err, "Exception in searchProducts:");
  }
};

export const getProduct = async (id: string): Promise<Product> => {
  
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      return handleError(error, "Error fetching product:");
    }
    
    return formatSupabaseProduct(data);
  } catch (err) {
    return handleError(err, "Exception in getProduct:");
  }
};

export const createProduct = async (product: Omit<Product, "id">): Promise<Product> => {
  
  try {
    const formattedProduct = formatProductForSupabase(product);

    const { data, error } = await supabase
      .from("products")
      .insert(formattedProduct)
      .select()
      .single();
    
    if (error) {
      return handleError(error, "Error creating product:");
    }
    
    return formatSupabaseProduct(data);
  } catch (err) {
    return handleError(err, "Exception in createProduct:");
  }
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  console.log("Updating product:", id, product);
  try {
    // Validar que el ID no sea uno de los IDs de la muestra (1, 2, 3, etc.)
    // Si es un ID numérico simple, probablemente sea de los datos de muestra y no de la base de datos
    if (/^\d+$/.test(id)) {
      throw new Error("No se puede actualizar un producto de muestra. Este producto no existe en la base de datos.");
    }
    
    const formattedProduct = formatProductForSupabase(product);

    const { data, error } = await supabase
      .from("products")
      .update(formattedProduct)
      .eq("id", id)
      .select();
    
    if (error) {
      return handleError(error, "Error updating product:");
    }
    
    return formatSupabaseProduct(data?.[0]);
  } catch (err) {
    return handleError(err, "Exception in updateProduct:");
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  console.log("Deleting product:", id);
  try {
    // Validar que el ID no sea uno de los IDs de la muestra
    if (/^\d+$/.test(id)) {
      throw new Error("No se puede eliminar un producto de muestra. Este producto no existe en la base de datos.");
    }
    
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
