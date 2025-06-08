
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Package, Plus, Minus } from "lucide-react";
import { updateProductStock, adjustStock } from "@/services/inventoryService";
import { Product } from "@/types/product";

interface StockManagementProps {
  product: Product;
  onStockUpdated: () => void;
}

const StockManagement: React.FC<StockManagementProps> = ({ product, onStockUpdated }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newStock, setNewStock] = useState(product.stock);
  const [adjustment, setAdjustment] = useState(0);
  const [reason, setReason] = useState("");
  const [mode, setMode] = useState<'set' | 'adjust'>('adjust');

  const handleSetStock = async () => {
    if (newStock < 0) {
      toast({
        title: "Error",
        description: "El stock no puede ser negativo",
        variant: "destructive",
      });
      return;
    }

    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un motivo para el cambio",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateProductStock(product.id, newStock, 'adjustment', reason);
      
      toast({
        title: "Stock actualizado",
        description: `Stock actualizado a ${newStock} unidades`,
      });

      setIsOpen(false);
      onStockUpdated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el stock",
        variant: "destructive",
      });
    }
  };

  const handleAdjustStock = async () => {
    if (adjustment === 0) {
      toast({
        title: "Error",
        description: "El ajuste debe ser diferente de cero",
        variant: "destructive",
      });
      return;
    }

    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un motivo para el ajuste",
        variant: "destructive",
      });
      return;
    }

    try {
      await adjustStock(product.id, adjustment, reason);
      
      toast({
        title: "Stock ajustado",
        description: `Se ${adjustment > 0 ? 'agregaron' : 'redujeron'} ${Math.abs(adjustment)} unidades`,
      });

      setIsOpen(false);
      onStockUpdated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo ajustar el stock",
        variant: "destructive",
      });
    }
  };

  const handleQuickAdjust = async (quickAdjustment: number) => {
    try {
      await adjustStock(product.id, quickAdjustment, `Ajuste rápido: ${quickAdjustment > 0 ? '+' : ''}${quickAdjustment}`);
      
      toast({
        title: "Stock ajustado",
        description: `Se ${quickAdjustment > 0 ? 'agregaron' : 'redujeron'} ${Math.abs(quickAdjustment)} unidades`,
      });

      onStockUpdated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo ajustar el stock",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Package className="h-4 w-4 mr-1" />
          Stock: {product.stock}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gestionar Stock - {product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Stock actual: <span className="font-medium">{product.stock} unidades</span>
          </div>

          {/* Ajustes rápidos */}
          <div className="space-y-2">
            <Label>Ajustes rápidos</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAdjust(-1)}
                disabled={product.stock <= 0}
              >
                <Minus className="h-3 w-3" />
                1
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAdjust(-5)}
                disabled={product.stock < 5}
              >
                <Minus className="h-3 w-3" />
                5
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAdjust(1)}
              >
                <Plus className="h-3 w-3" />
                1
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAdjust(5)}
              >
                <Plus className="h-3 w-3" />
                5
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAdjust(10)}
              >
                <Plus className="h-3 w-3" />
                10
              </Button>
            </div>
          </div>

          {/* Selector de modo */}
          <div className="space-y-2">
            <Label>Tipo de cambio</Label>
            <div className="flex gap-2">
              <Button
                variant={mode === 'adjust' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('adjust')}
              >
                Ajustar
              </Button>
              <Button
                variant={mode === 'set' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('set')}
              >
                Establecer
              </Button>
            </div>
          </div>

          {mode === 'adjust' ? (
            <div className="space-y-2">
              <Label htmlFor="adjustment">Ajuste (positivo para agregar, negativo para reducir)</Label>
              <Input
                id="adjustment"
                type="number"
                value={adjustment}
                onChange={(e) => setAdjustment(parseInt(e.target.value) || 0)}
                placeholder="Ej: +10 o -5"
              />
              <div className="text-sm text-muted-foreground">
                Nuevo stock: {Math.max(0, product.stock + adjustment)}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="newStock">Nuevo stock</Label>
              <Input
                id="newStock"
                type="number"
                min="0"
                value={newStock}
                onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo del cambio</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej: Recepción de mercancía, corrección de inventario, venta, etc."
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={mode === 'adjust' ? handleAdjustStock : handleSetStock}
              className="flex-1"
            >
              {mode === 'adjust' ? 'Aplicar Ajuste' : 'Establecer Stock'}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StockManagement;
