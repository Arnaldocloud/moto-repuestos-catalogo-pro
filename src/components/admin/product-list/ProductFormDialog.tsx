
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProductForm from "../product-form";
import { Product } from "@/types/product";

interface ProductFormDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialData?: Product;
  onSubmit: (product: Product) => void;
  mode: 'add' | 'edit';
}

const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
  isOpen,
  setIsOpen,
  initialData,
  onSubmit,
  mode
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Añadir Nuevo Producto' : 'Editar Producto'}
          </DialogTitle>
        </DialogHeader>
        <ProductForm 
          initialData={initialData} 
          onSubmit={onSubmit} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
