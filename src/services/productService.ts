
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

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
    
    return data as Product[] || [];
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
    
    return data as Product[] || [];
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
    
    return data as Product[] || [];
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
    
    return data as Product;
  } catch (err) {
    return handleError(err, "Exception in getProduct:");
  }
};

export const createProduct = async (product: Omit<Product, "id">): Promise<Product> => {
  console.log("Creating product:", product);
  try {
    // Make sure arrays are properly formatted
    const formattedProduct = {
      ...product,
      compatibleModels: Array.isArray(product.compatibleModels) 
        ? product.compatibleModels 
        : typeof product.compatibleModels === 'string' 
          ? product.compatibleModels.split(',').map(m => m.trim()) 
          : [],
      features: Array.isArray(product.features) 
        ? product.features 
        : typeof product.features === 'string' 
          ? product.features.split(',').map(f => f.trim())
          : [],
      images: Array.isArray(product.images) 
        ? product.images 
        : typeof product.images === 'string' 
          ? product.images.split(',').map(i => i.trim())
          : []
    };

    const { data, error } = await supabase
      .from("products")
      .insert(formattedProduct)
      .select()
      .single();
    
    if (error) {
      return handleError(error, "Error creating product:");
    }
    
    return data as Product;
  } catch (err) {
    return handleError(err, "Exception in createProduct:");
  }
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  console.log("Updating product:", id, product);
  try {
    // Make sure arrays are properly formatted
    const formattedProduct = {
      ...product,
      compatibleModels: product.compatibleModels && (
        Array.isArray(product.compatibleModels) 
          ? product.compatibleModels 
          : typeof product.compatibleModels === 'string' 
            ? product.compatibleModels.split(',').map(m => m.trim()) 
            : product.compatibleModels
      ),
      features: product.features && (
        Array.isArray(product.features) 
          ? product.features 
          : typeof product.features === 'string' 
            ? product.features.split(',').map(f => f.trim())
            : product.features
      ),
      images: product.images && (
        Array.isArray(product.images) 
          ? product.images 
          : typeof product.images === 'string' 
            ? product.images.split(',').map(i => i.trim())
            : product.images
      )
    };

    const { data, error } = await supabase
      .from("products")
      .update(formattedProduct)
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      return handleError(error, "Error updating product:");
    }
    
    return data as Product;
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
