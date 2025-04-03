
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import ProductGrid from "@/components/ProductGrid";
import QuickViewModal from "@/components/QuickViewModal";
import FloatingContact from "@/components/FloatingContact";
import SpecialOrderForm from "@/components/SpecialOrderForm";
import { Product } from "@/types/product";
import { products, getProductsByCategory, searchProducts } from "@/data/products";
import { Search, PlusCircle, BarChart3, TrendingUp, Truck } from "lucide-react";
import { STORE_NAME } from "@/config/contact";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false);
  const [isSpecialOrderOpen, setIsSpecialOrderOpen] = useState<boolean>(false);

  const filteredProducts = searchQuery 
    ? searchProducts(searchQuery) 
    : getProductsByCategory(selectedCategory);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery("");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory("todos");
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
  };

  const openSpecialOrderForm = () => {
    setIsSpecialOrderOpen(true);
  };

  const closeSpecialOrderForm = () => {
    setIsSpecialOrderOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={handleSearch} />
      
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-motorcycle-dark to-motorcycle-red/90 text-white py-10 px-4 relative">
        <div className="container mx-auto flex flex-col items-center">
          {/* Add Admin Panel Button */}
          <Link 
            to="/admin" 
            className="absolute top-4 right-4"
          >
            <Button variant="outline" size="icon" className="text-white border-white hover:bg-white/10">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Catálogo de Repuestos de Motos
          </h1>
          <p className="text-lg text-center max-w-2xl mb-6">
            Encuentra los mejores repuestos para tu moto con calidad garantizada y envíos a todo el país
          </p>
          
          {/* Metrics Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
            <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm flex flex-col items-center">
              <BarChart3 className="h-8 w-8 mb-2" />
              <div className="text-2xl font-bold">125+</div>
              <div className="text-sm">Talleres confían en nosotros</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm flex flex-col items-center">
              <TrendingUp className="h-8 w-8 mb-2" />
              <div className="text-2xl font-bold">1,500+</div>
              <div className="text-sm">Pedidos mensuales</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm flex flex-col items-center">
              <Truck className="h-8 w-8 mb-2" />
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm">Envíos a tiempo</div>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="relative w-full max-w-md mb-4 md:hidden">
            <input
              type="search"
              placeholder="Buscar repuestos..."
              className="w-full rounded-full py-2 px-4 text-black pr-10"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <div className="absolute right-3 top-2.5 text-gray-500">
              <Search className="h-5 w-5" />
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="bg-white text-motorcycle-red hover:bg-gray-100"
            onClick={openSpecialOrderForm}
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Solicitar repuesto especial
          </Button>
        </div>
      </div>
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <CategoryFilter 
              selectedCategory={selectedCategory} 
              onSelectCategory={handleCategorySelect}
            />
          </aside>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {searchQuery 
                  ? `Resultados para "${searchQuery}"`
                  : selectedCategory === 'todos' 
                    ? 'Todos los productos' 
                    : `Categoría: ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`
                }
              </h2>
              <div className="text-sm text-muted-foreground">
                {filteredProducts.length} productos
              </div>
            </div>
            
            <ProductGrid 
              products={filteredProducts}
              onQuickView={handleQuickView}
            />
          </div>
        </div>
      </main>
      
      <footer className="bg-motorcycle-dark text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4">{STORE_NAME}</h3>
              <p className="max-w-md text-gray-300">
                Ofrecemos una amplia variedad de repuestos para motos de todas las marcas y modelos. Calidad garantizada y los mejores precios del mercado.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Contáctanos</h4>
              <p className="text-gray-300">WhatsApp: +XX XXXX-XXXX</p>
              <p className="text-gray-300">Email: info@motorepuestospro.com</p>
              <p className="text-gray-300">Dirección: Av. Ejemplo 123, Ciudad</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} {STORE_NAME}. Todos los derechos reservados.
          </div>
        </div>
      </footer>
      
      {/* Modals & Floating Elements */}
      <QuickViewModal 
        product={selectedProduct} 
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
      />
      
      <SpecialOrderForm
        isOpen={isSpecialOrderOpen}
        onClose={closeSpecialOrderForm}
      />
      
      <FloatingContact />
    </div>
  );
};

export default Index;
