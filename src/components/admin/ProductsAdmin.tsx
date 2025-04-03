
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Pencil, Trash2, X, Check, Eye } from "lucide-react";
import { Product, Category, categoryNames } from "@/types/product";
import { products as initialProducts } from "@/data/products";
import ProductForm from "./ProductForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const ProductsAdmin: React.FC = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredProducts = searchTerm
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  const handleAddProduct = (newProduct: Product) => {
    // En una aplicación real, aquí se haría una llamada a una API
    const productWithId = {
      ...newProduct,
      id: (products.length + 1).toString(),
    };
    setProducts([...products, productWithId]);
    setIsAddDialogOpen(false);
    toast({
      title: "Producto añadido",
      description: `${newProduct.name} ha sido añadido correctamente.`,
    });
  };

  const handleEditProduct = (updatedProduct: Product) => {
    // En una aplicación real, aquí se haría una llamada a una API
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setIsEditDialogOpen(false);
    toast({
      title: "Producto actualizado",
      description: `${updatedProduct.name} ha sido actualizado correctamente.`,
    });
  };

  const handleDeleteProduct = () => {
    if (!currentProduct) return;
    
    // En una aplicación real, aquí se haría una llamada a una API
    setProducts(products.filter((product) => product.id !== currentProduct.id));
    setIsDeleteDialogOpen(false);
    toast({
      title: "Producto eliminado",
      description: `${currentProduct.name} ha sido eliminado correctamente.`,
      variant: "destructive",
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-2.5"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Añadir Producto
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No se encontraron productos
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{categoryNames[product.category as Category]}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.stock > 10
                        ? "bg-green-100 text-green-800"
                        : product.stock > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {product.stock}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentProduct(product);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentProduct(product);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentProduct(product);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Producto</DialogTitle>
          </DialogHeader>
          <ProductForm onSubmit={handleAddProduct} />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>
          {currentProduct && (
            <ProductForm 
              initialData={currentProduct} 
              onSubmit={handleEditProduct} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalles del Producto</DialogTitle>
          </DialogHeader>
          
          {currentProduct && (
            <div className="space-y-4 mt-4">
              <div className="aspect-square overflow-hidden rounded-md">
                <img 
                  src={currentProduct.images[0]} 
                  alt={currentProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <h3 className="font-semibold">SKU:</h3>
                  <p>{currentProduct.sku}</p>
                </div>
                <div className="flex justify-between">
                  <h3 className="font-semibold">Nombre:</h3>
                  <p>{currentProduct.name}</p>
                </div>
                <div className="flex justify-between">
                  <h3 className="font-semibold">Marca:</h3>
                  <p>{currentProduct.brand}</p>
                </div>
                <div className="flex justify-between">
                  <h3 className="font-semibold">Categoría:</h3>
                  <p>{categoryNames[currentProduct.category as Category]}</p>
                </div>
                <div className="flex justify-between">
                  <h3 className="font-semibold">Precio:</h3>
                  <p>${currentProduct.price.toFixed(2)}</p>
                </div>
                {currentProduct.discountPrice && (
                  <div className="flex justify-between">
                    <h3 className="font-semibold">Precio con descuento:</h3>
                    <p>${currentProduct.discountPrice.toFixed(2)}</p>
                  </div>
                )}
                <div className="flex justify-between">
                  <h3 className="font-semibold">Stock:</h3>
                  <p>{currentProduct.stock}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Descripción:</h3>
                  <p className="text-sm">{currentProduct.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Modelos compatibles:</h3>
                  <div className="flex flex-wrap gap-1">
                    {currentProduct.compatibleModels.map((model, idx) => (
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
                    {currentProduct.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el producto 
              "{currentProduct?.name}" y no podrá ser recuperado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProduct}
              className="bg-destructive text-destructive-foreground"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsAdmin;
