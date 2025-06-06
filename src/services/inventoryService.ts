
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';

export interface StockMovement {
  id?: string;
  product_id: string;
  movement_type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  created_at?: string;
  previous_stock?: number;
  new_stock?: number;
}

export interface LowStockAlert {
  product: Product;
  current_stock: number;
  threshold: number;
}

export const updateProductStock = async (
  productId: string, 
  newStock: number,
  movementType: 'in' | 'out' | 'adjustment' = 'adjustment',
  reason: string = 'Manual adjustment'
): Promise<boolean> => {
  try {
    // Primero obtenemos el stock actual
    const { data: currentProduct, error: fetchError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', productId)
      .single();

    if (fetchError) {
      throw new Error(`Error fetching current stock: ${fetchError.message}`);
    }

    const previousStock = currentProduct.stock;

    // Actualizamos el stock del producto
    const { error: updateError } = await supabase
      .from('products')
      .update({ 
        stock: newStock,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId);

    if (updateError) {
      throw new Error(`Error updating stock: ${updateError.message}`);
    }

    console.log(`Stock updated for product ${productId}: ${previousStock} → ${newStock}`);
    return true;

  } catch (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }
};

export const adjustStock = async (
  productId: string,
  adjustment: number,
  reason: string
): Promise<boolean> => {
  try {
    // Obtenemos el stock actual
    const { data: currentProduct, error: fetchError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', productId)
      .single();

    if (fetchError) {
      throw new Error(`Error fetching current stock: ${fetchError.message}`);
    }

    const newStock = Math.max(0, currentProduct.stock + adjustment);
    const movementType = adjustment > 0 ? 'in' : 'out';

    return await updateProductStock(productId, newStock, movementType, reason);

  } catch (error) {
    console.error('Error adjusting stock:', error);
    throw error;
  }
};

export const getLowStockProducts = async (threshold: number = 5): Promise<LowStockAlert[]> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .lte('stock', threshold)
      .order('stock', { ascending: true });

    if (error) {
      throw new Error(`Error fetching low stock products: ${error.message}`);
    }

    return (products || []).map(product => ({
      product: {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        discountPrice: product.discount_price,
        brand: product.brand,
        category: product.category,
        compatibleModels: product.compatible_models || [],
        description: product.description,
        features: product.features || [],
        images: product.images || [],
        stock: product.stock,
        isNew: product.is_new,
        isSpecialOrder: product.is_special_order
      },
      current_stock: product.stock,
      threshold
    }));

  } catch (error) {
    console.error('Error getting low stock products:', error);
    return [];
  }
};

export const getStockSummary = async () => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('stock, price');

    if (error) {
      throw new Error(`Error fetching stock summary: ${error.message}`);
    }

    const totalProducts = products?.length || 0;
    const totalStock = products?.reduce((sum, product) => sum + (product.stock || 0), 0) || 0;
    const totalValue = products?.reduce((sum, product) => sum + ((product.stock || 0) * (product.price || 0)), 0) || 0;
    const lowStockCount = products?.filter(product => (product.stock || 0) <= 5).length || 0;
    const outOfStockCount = products?.filter(product => (product.stock || 0) === 0).length || 0;

    return {
      totalProducts,
      totalStock,
      totalValue,
      lowStockCount,
      outOfStockCount
    };

  } catch (error) {
    console.error('Error getting stock summary:', error);
    return {
      totalProducts: 0,
      totalStock: 0,
      totalValue: 0,
      lowStockCount: 0,
      outOfStockCount: 0
    };
  }
};
