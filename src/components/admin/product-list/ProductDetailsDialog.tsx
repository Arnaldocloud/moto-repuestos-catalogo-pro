
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Product, Category, categoryNames } from "@/types/product";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductDetailsDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  product: Product | null;
}

const ProductDetailsDialog: React.FC<ProductDetailsDialogProps> = ({
  isOpen,
  setIsOpen,
  product,
}) => {
  if (!product) return null;

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]" closeButton={false}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Detalles del Producto</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="aspect-square overflow-hidden rounded-md">
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <h3 className="font-semibold">SKU:</h3>
              <p>{product.sku}</p>
            </div>
            <div className="flex justify-between">
              <h3 className="font-semibold">Nombre:</h3>
              <p>{product.name}</p>
            </div>
            <div className="flex justify-between">
              <h3 className="font-semibold">Marca:</h3>
              <p>{product.brand}</p>
            </div>
            <div className="flex justify-between">
              <h3 className="font-semibold">Categoría:</h3>
              <p>{categoryNames[product.category as Category]}</p>
            </div>
            <div className="flex justify-between">
              <h3 className="font-semibold">Precio:</h3>
              <p>${product.price.toFixed(2)}</p>
            </div>
            {product.discountPrice && (
              <div className="flex justify-between">
                <h3 className="font-semibold">Precio con descuento:</h3>
                <p>${product.discountPrice.toFixed(2)}</p>
              </div>
            )}
            <div className="flex justify-between">
              <h3 className="font-semibold">Stock:</h3>
              <p>{product.stock}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Descripción:</h3>
              <p className="text-sm">{product.description}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Modelos compatibles:</h3>
              <div className="flex flex-wrap gap-1">
                {product.compatibleModels.map((model, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted"
                  >
                    {model}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Características:</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                {product.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
