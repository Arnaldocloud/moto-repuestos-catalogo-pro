import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Product } from "@/types/product";
import { products as initialSampleProducts } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct, deleteProduct } from "@/services/productService";
import { useProducts } from "@/hooks/useProducts";

// Import our new components
import SearchBar from "./product-list/SearchBar";
import ProductsTable from "./product-list/ProductsTable";
import ProductDetailsDialog from "./product-list/ProductDetailsDialog";
import DeleteConfirmDialog from "./product-list/DeleteConfirmDialog";
import ProductFormDialog from "./product-list/ProductFormDialog";

const ProductsAdmin: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: databaseProducts, isLoading, error, refetch } = useProducts();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  useEffect(() => {
    if (databaseProducts) {
      setProducts(databaseProducts);
    } else {
      setProducts(initialSampleProducts);
    }
  }, [databaseProducts]);

  const filteredProducts = searchTerm
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  const handleAddProduct = async (newProduct: Product) => {
    try {
      const createdProduct = await createProduct(newProduct);

      setProducts([...products, createdProduct]);
      setIsAddDialogOpen(false);

      queryClient.invalidateQueries({ queryKey: ["products"] });

      toast({
        title: "Producto añadido",
        description: `${newProduct.name} ha sido añadido correctamente.`,
      });
    } catch (error: any) {
      console.error("Error al añadir producto:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo añadir el producto. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = async (updatedProduct: Product) => {
    try {
      if (/^\d+$/.test(updatedProduct.id)) {
        throw new Error("No puedes editar un producto de muestra. Los productos de muestra no están en la base de datos.");
      }
      
      await updateProduct(updatedProduct.id, updatedProduct);

      setProducts(
        products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
      setIsEditDialogOpen(false);

      queryClient.invalidateQueries({ queryKey: ["products"] });

      toast({
        title: "Producto actualizado",
        description: `${updatedProduct.name} ha sido actualizado correctamente.`,
      });
    } catch (error: any) {
      console.error("Error al actualizar producto:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el producto. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async () => {
    if (!currentProduct) return;
    
    try {
      if (/^\d+$/.test(currentProduct.id)) {
        throw new Error("No puedes eliminar un producto de muestra. Los productos de muestra no están en la base de datos.");
      }
      
      await deleteProduct(currentProduct.id);

      setProducts(products.filter((product) => product.id !== currentProduct.id));
      setIsDeleteDialogOpen(false);

      queryClient.invalidateQueries({ queryKey: ["products"] });

      toast({
        title: "Producto eliminado",
        description: `${currentProduct.name} ha sido eliminado correctamente.`,
        variant: "destructive",
      });
    } catch (error: any) {
      console.error("Error al eliminar producto:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el producto. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleStockUpdated = () => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Añadir Producto
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Cargando productos...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          Error al cargar productos. Mostrando productos de muestra.
        </div>
      ) : (
        <ProductsTable 
          products={filteredProducts} 
          onView={(product) => {
            setCurrentProduct(product);
            setIsViewDialogOpen(true);
          }}
          onEdit={(product) => {
            setCurrentProduct(product);
            setIsEditDialogOpen(true);
          }}
          onDelete={(product) => {
            setCurrentProduct(product);
            setIsDeleteDialogOpen(true);
          }}
          onStockUpdated={handleStockUpdated}
        />
      )}

      <ProductFormDialog 
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onSubmit={handleAddProduct}
        mode="add"
      />

      <ProductFormDialog 
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        initialData={currentProduct || undefined}
        onSubmit={handleEditProduct}
        mode="edit"
      />

      <ProductDetailsDialog 
        isOpen={isViewDialogOpen}
        setIsOpen={setIsViewDialogOpen}
        product={currentProduct}
      />

      <DeleteConfirmDialog 
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        product={currentProduct}
        onConfirm={handleDeleteProduct}
      />
    </div>
  );
};

export default ProductsAdmin;
