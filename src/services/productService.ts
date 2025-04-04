
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

export const getProducts = async () => {
  console.log("Calling getProducts in productService");
  const { data, error } = await supabase.from("products").select("*");
  
  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
  
  return data as Product[];
};

export const getProductsByCategory = async (category: string) => {
  console.log("Fetching products by category:", category);
  if (category === "todos") {
    return getProducts();
  }
  
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category);
  
  if (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
  
  return data as Product[];
};

export const searchProducts = async (query: string) => {
  console.log("Searching products with query:", query);
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or(`name.ilike.%${query}%, sku.ilike.%${query}%, brand.ilike.%${query}%`);
  
  if (error) {
    console.error("Error searching products:", error);
    throw error;
  }
  
  return data as Product[];
};

export const getProduct = async (id: string) => {
  console.log("Fetching product with id:", id);
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
  
  return data as Product;
};

export const createProduct = async (product: Omit<Product, "id">) => {
  console.log("Creating product:", product);
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating product:", error);
    throw error;
  }
  
  return data as Product;
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  console.log("Updating product:", id, product);
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating product:", error);
    throw error;
  }
  
  return data as Product;
};

export const deleteProduct = async (id: string) => {
  console.log("Deleting product:", id);
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
  
  return true;
};

export const getCategories = async () => {
  console.log("Fetching categories");
  const { data, error } = await supabase.from("categories").select("*");
  
  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
  
  return data;
};
