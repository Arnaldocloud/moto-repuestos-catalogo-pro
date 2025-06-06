
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Plus,
  Minus,
  RefreshCw
} from "lucide-react";
import {
  getLowStockProducts,
  getStockSummary,
  adjustStock,
  updateProductStock,
  LowStockAlert
} from "@/services/inventoryService";
import { useProducts } from "@/hooks/useProducts";

interface StockSummary {
  totalProducts: number;
  totalStock: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

const InventoryDashboard: React.FC = () => {
  const { toast } = useToast();
  const { data: products, refetch: refetchProducts } = useProducts();
  const [stockSummary, setStockSummary] = useState<StockSummary>({
    totalProducts: 0,
    totalStock: 0,
    totalValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0
  });
  const [lowStockProducts, setLowStockProducts] = useState<LowStockAlert[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const loadInventoryData = async () => {
    setIsLoading(true);
    try {
      const [summary, lowStock] = await Promise.all([
        getStockSummary(),
        getLowStockProducts(5)
      ]);
      
      setStockSummary(summary);
      setLowStockProducts(lowStock);
    } catch (error) {
      console.error('Error loading inventory data:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar los datos del inventario",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventoryData();
  }, []);

  const handleStockAdjustment = async () => {
    if (!selectedProduct || adjustmentQuantity === 0 || !adjustmentReason.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    try {
      await adjustStock(selectedProduct, adjustmentQuantity, adjustmentReason);
      
      toast({
        title: "Stock actualizado",
        description: `Se ${adjustmentQuantity > 0 ? 'agregaron' : 'redujeron'} ${Math.abs(adjustmentQuantity)} unidades`,
      });

      // Limpiar el formulario
      setSelectedProduct("");
      setAdjustmentQuantity(0);
      setAdjustmentReason("");

      // Recargar datos
      await loadInventoryData();
      refetchProducts();

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el stock",
        variant: "destructive",
      });
    }
  };

  const handleQuickAdjustment = async (productId: string, adjustment: number, reason: string) => {
    try {
      await adjustStock(productId, adjustment, reason);
      
      toast({
        title: "Stock actualizado",
        description: `Se ${adjustment > 0 ? 'agregaron' : 'redujeron'} ${Math.abs(adjustment)} unidades`,
      });

      await loadInventoryData();
      refetchProducts();

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el stock",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Panel de Inventario</h2>
        <Button onClick={loadInventoryData} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Resumen del Inventario */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockSummary.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockSummary.totalStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stockSummary.totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stockSummary.lowStockCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stockSummary.outOfStockCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ajuste de Stock */}
        <Card>
          <CardHeader>
            <CardTitle>Ajustar Stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="product-select">Producto</Label>
              <select
                id="product-select"
                className="w-full mt-1 p-2 border rounded-md"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">Seleccionar producto...</option>
                {products?.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} (SKU: {product.sku}) - Stock: {product.stock}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="quantity">Cantidad (positivo para agregar, negativo para reducir)</Label>
              <Input
                id="quantity"
                type="number"
                value={adjustmentQuantity}
                onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value) || 0)}
                placeholder="Ej: +10 o -5"
              />
            </div>

            <div>
              <Label htmlFor="reason">Motivo del ajuste</Label>
              <Textarea
                id="reason"
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                placeholder="Ej: Recepción de mercancía, corrección de inventario, etc."
              />
            </div>

            <Button onClick={handleStockAdjustment} className="w-full">
              Aplicar Ajuste
            </Button>
          </CardContent>
        </Card>

        {/* Productos con Stock Bajo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Productos con Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-muted-foreground">No hay productos con stock bajo</p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((alert) => (
                  <div key={alert.product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{alert.product.name}</h4>
                      <p className="text-sm text-muted-foreground">SKU: {alert.product.sku}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={alert.current_stock === 0 ? "destructive" : "secondary"}>
                          Stock: {alert.current_stock}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickAdjustment(alert.product.id, 5, "Reposición automática")}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickAdjustment(alert.product.id, 10, "Reposición automática")}
                      >
                        +10
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryDashboard;
