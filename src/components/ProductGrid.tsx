
import React from "react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onQuickView }) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-medium mb-2">No se encontraron productos</h3>
        <p className="text-muted-foreground">
          Intenta con otra búsqueda o categoría
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
