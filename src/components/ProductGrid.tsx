
import React from "react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import { AlertCircle, Database } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProductGridProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  isLoading?: boolean;
  error?: Error | null;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onQuickView, 
  isLoading = false,
  error = null 
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-motorcycle-red border-t-transparent rounded-full mb-4"></div>
        <h3 className="text-xl font-medium mb-2">Cargando productos...</h3>
        <p className="text-muted-foreground">
          Obteniendo los productos desde la base de datos
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar productos: {error.message}
            <br />
            <span className="text-sm text-muted-foreground mt-2 block">
              Verifica tu conexión a internet y la configuración de Supabase
            </span>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Database className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No se encontraron productos</h3>
        <p className="text-muted-foreground text-center">
          Intenta con otra búsqueda o categoría, o verifica la conexión con la base de datos
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
