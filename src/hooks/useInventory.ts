
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getLowStockProducts, 
  getStockSummary, 
  adjustStock, 
  updateProductStock,
  LowStockAlert 
} from '@/services/inventoryService';

interface StockSummary {
  totalProducts: number;
  totalStock: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export const useInventory = (lowStockThreshold: number = 5) => {
  const queryClient = useQueryClient();
  
  const { 
    data: stockSummary, 
    isLoading: isSummaryLoading,
    refetch: refetchSummary 
  } = useQuery({
    queryKey: ['inventory', 'summary'],
    queryFn: getStockSummary,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { 
    data: lowStockProducts, 
    isLoading: isLowStockLoading,
    refetch: refetchLowStock 
  } = useQuery({
    queryKey: ['inventory', 'lowStock', lowStockThreshold],
    queryFn: () => getLowStockProducts(lowStockThreshold),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const updateStock = async (productId: string, newStock: number, reason: string) => {
    await updateProductStock(productId, newStock, 'adjustment', reason);
    
    // Invalidate related queries
    queryClient.invalidateQueries({ queryKey: ['inventory'] });
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const adjustStockBy = async (productId: string, adjustment: number, reason: string) => {
    await adjustStock(productId, adjustment, reason);
    
    // Invalidate related queries
    queryClient.invalidateQueries({ queryKey: ['inventory'] });
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const refreshInventory = () => {
    refetchSummary();
    refetchLowStock();
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  return {
    stockSummary: stockSummary || {
      totalProducts: 0,
      totalStock: 0,
      totalValue: 0,
      lowStockCount: 0,
      outOfStockCount: 0
    },
    lowStockProducts: lowStockProducts || [],
    isLoading: isSummaryLoading || isLowStockLoading,
    updateStock,
    adjustStockBy,
    refreshInventory
  };
};
