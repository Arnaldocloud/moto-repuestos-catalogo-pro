
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

interface ProductQueryParams {
  category?: string;
  search?: string;
  limit?: number;
}

// Helper function to map database records to our Product type
const mapDatabaseToProduct = (record: any): Product => {
  return {
    id: record.id || "",
    name: record.name || "",
    sku: record.sku || "",
    price: typeof record.price === 'number' ? record.price : 0,
    discountPrice: typeof record.discount_price === 'number' ? record.discount_price : null,
    brand: record.brand || "",
    category: record.category || "accesorios", // Default category
    compatibleModels: Array.isArray(record.compatible_models) ? record.compatible_models : [],
    description: record.description || "",
    features: Array.isArray(record.features) ? record.features : [],
    images: Array.isArray(record.images) ? record.images : [],
    stock: typeof record.stock === 'number' ? record.stock : 0,
    isNew: Boolean(record.is_new),
    isSpecialOrder: Boolean(record.is_special_order)
  };
};

export const fetchProducts = async ({ 
  category, 
  search,
  limit
}: ProductQueryParams): Promise<Product[]> => {
  console.log("Fetching products with params:", { category, search, limit });
  
  try {
    let query = supabase.from("products").select("*");
    
    if (category && category !== 'todos') {
      query = query.eq("category", category);
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%, sku.ilike.%${search}%, brand.ilike.%${search}%`);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching products:", error);
      throw new Error(`Error fetching products: ${error.message}`);
    }
    
    console.log("Products fetched:", data?.length || 0);
    
    // Map database records to our Product type with proper null/undefined handling
    return (data || []).map(mapDatabaseToProduct);
  } catch (err) {
    console.error("Exception in fetchProducts:", err);
    // Return empty array in case of error to avoid breaking the UI
    return [];
  }
};

export const useProducts = (params: ProductQueryParams = {}) => {
  return useQuery({
    queryKey: ["products", params.category, params.search, params.limit],
    queryFn: () => fetchProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
