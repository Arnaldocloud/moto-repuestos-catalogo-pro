import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { Settings, Search, PlusCircle, BarChart3, TrendingUp, Truck } from "lucide-react";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import ProductGrid from "@/components/ProductGrid";
import QuickViewModal from "@/components/QuickViewModal";
import FloatingContact from "@/components/FloatingContact";
import SpecialOrderForm from "@/components/SpecialOrderForm";
import SupabaseConnectionTest from "@/components/SupabaseConnectionTest";
import BusinessInfo from "@/components/BusinessInfo";
import Testimonials from "@/components/Testimonials";
import SEOHead from "@/components/SEOHead";
import { Product } from "@/types/product";
import { useProducts } from "@/hooks/useProducts";
import { STORE_NAME } from "@/config/contact";
import { toast } from "sonner";

// Componente para el Skeleton Loader
const ProductGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array(8).fill(null).map((_, index) => (
        <div key={index} className="h-[400px] rounded-lg bg-muted animate-pulse">
          <div className="h-1/2 bg-muted-foreground/10 rounded-t-lg"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 w-1/3 bg-muted-foreground/10 rounded"></div>
            <div className="h-6 w-3/4 bg-muted-foreground/10 rounded"></div>
            <div className="h-4 w-1/2 bg-muted-foreground/10 rounded"></div>
            <div className="h-8 w-1/3 bg-muted-foreground/10 rounded mt-6"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || "todos");
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || "");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false);
  const [isSpecialOrderOpen, setIsSpecialOrderOpen] = useState<boolean>(false);
  const [showDiagnostic, setShowDiagnostic] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  
  // Manejar el evento de scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sincronizar con URL params
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    if (category) setSelectedCategory(category);
    if (search) setSearchQuery(search);
  }, [searchParams]);

  const {
    data: products,
    isLoading,
    error
  } = useProducts({
    category: selectedCategory !== "todos" ? selectedCategory : undefined,
    search: searchQuery || undefined
  });

  useEffect(() => {
    if (error) {
      toast.error("Error al cargar productos", {
        description: "Intenta de nuevo más tarde",
      });
    }
  }, [error]);

  const filteredProducts = products || [];
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery("");
    setSearchParams(category !== "todos" ? { category } : {});
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory("todos");
    setSearchParams(query ? { search: query } : {});
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
  
  const toggleDiagnostic = () => {
    setShowDiagnostic(!showDiagnostic);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="Repuestos de Motos de Calidad - Envíos a toda Venezuela"
        description="Encuentra los mejores repuestos para tu moto. Motor, frenos, eléctricos, suspensión y más. Calidad garantizada y envíos rápidos a toda Venezuela."
        keywords="repuestos motos Venezuela, repuestos motocicletas Caracas, motor moto, frenos moto, repuestos Honda, repuestos Yamaha"
      />
      
      <Header onSearch={handleSearch} />
      
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-motorcycle-dark to-motorcycle-red/90 text-white py-10 px-4 relative overflow-hidden">
        {/* Video de fondo */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video 
            autoPlay 
            muted 
            loop 
            className="w-full h-full object-cover"
            poster="/images/motorcycle-poster.jpg"
          >
            Tu navegador no soporta videos HTML5.
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40 z-10"></div>
        </div>
        
        <div className="container mx-auto flex flex-col items-center relative z-20">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 animate-fade-in text-shadow-sm">
            {STORE_NAME}
          </h1>
          <p className="text-lg text-center max-w-2xl mb-6 animate-fade-in text-shadow-sm">
            Encuentra los mejores repuestos para tu moto con calidad garantizada y envíos a todo Venezuela
          </p>
          
          {/* Diagnostic Section */}
          {showDiagnostic && (
            <div className="w-full max-w-md mb-6 bg-white text-gray-900 rounded-lg">
              <SupabaseConnectionTest />
            </div>
          )}
          
          {/* Metrics Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
            <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm flex flex-col items-center hover:bg-white/20 transition-all hover:scale-105">
              <BarChart3 className="h-8 w-8 mb-2" />
              <div className="text-2xl font-bold">Calidad</div>
              <div className="text-sm">Repuestos garantizados</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm flex flex-col items-center hover:bg-white/20 transition-all hover:scale-105">
              <TrendingUp className="h-8 w-8 mb-2" />
              <div className="text-2xl font-bold">Variedad</div>
              <div className="text-sm">Múltiples marcas y modelos</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm flex flex-col items-center hover:bg-white/20 transition-all hover:scale-105">
              <Truck className="h-8 w-8 mb-2" />
              <div className="text-2xl font-bold">Envíos</div>
              <div className="text-sm">A todo el país</div>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="relative w-full max-w-md mb-4 md:hidden">
            <input 
              type="search" 
              placeholder="Buscar repuestos..." 
              className="w-full rounded-full py-2 px-4 text-black pr-10" 
              value={searchQuery} 
              onChange={e => handleSearch(e.target.value)} 
            />
            <div className="absolute right-3 top-2.5 text-gray-500">
              <Search className="h-5 w-5" />
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="bg-white text-motorcycle-dark hover:bg-gray-100 transition-all hover:scale-105 font-semibold"
            onClick={openSpecialOrderForm}
            aria-label="Solicitar repuesto especial"
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
            <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect} />
          </aside>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {searchQuery ? `Resultados para "${searchQuery}"` : selectedCategory === 'todos' ? 'Todos los productos' : `Categoría: ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`}
              </h2>
              <div className="text-sm text-muted-foreground">
                {isLoading ? "Cargando..." : error ? "Error" : `${filteredProducts.length} productos`}
              </div>
            </div>
            
            {error ? (
              <div className="p-4 rounded-md bg-destructive/10 text-destructive">
                Error al cargar productos: {error instanceof Error ? error.message : "Error desconocido"}
              </div>
            ) : isLoading ? (
              <ProductGridSkeleton />
            ) : (
              <ProductGrid products={filteredProducts} onQuickView={handleQuickView} />
            )}
          </div>
        </div>

        {/* Secciones adicionales para SEO y credibilidad */}
        <div className="mt-16 space-y-16">
          <BusinessInfo />
          <Testimonials />
        </div>
      </main>
      
      <footer className="bg-motorcycle-dark text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4">{STORE_NAME}</h3>
              <p className="max-w-md text-gray-300 mb-4">
                Más de 10 años ofreciendo repuestos de calidad para motocicletas en Venezuela. 
                Somos tu aliado confiable para mantener tu moto en perfecto estado.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">Instagram</a>
                <a href="#" className="text-gray-300 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-300 hover:text-white">YouTube</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Enlaces Rápidos</h4>
              <div className="space-y-2">
                <Link to="/categorias" className="block text-gray-300 hover:text-white">Categorías</Link>
                <Link to="/contacto" className="block text-gray-300 hover:text-white">Contacto</Link>
                <a href="#" className="block text-gray-300 hover:text-white">Términos y Condiciones</a>
                <a href="#" className="block text-gray-300 hover:text-white">Política de Privacidad</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Contáctanos</h4>
              <p className="text-gray-300">WhatsApp: +58 412-123-4567</p>
              <p className="text-gray-300">Email: info@motorepuestospro.com</p>
              <p className="text-gray-300">Dirección: Av. Principal, Centro Comercial Plaza, Local 15, Caracas</p>
              <p className="text-gray-300 mt-2">Lun-Sáb: 8:00 AM - 6:00 PM</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} {STORE_NAME}. Todos los derechos reservados. 
            <span className="block md:inline md:ml-2">Hecho con ❤️ en Venezuela</span>
          </div>
        </div>
      </footer>
      
      {/* Modals & Floating Elements */}
      <QuickViewModal product={selectedProduct} isOpen={isQuickViewOpen} onClose={closeQuickView} />
      
      <SpecialOrderForm isOpen={isSpecialOrderOpen} onClose={closeSpecialOrderForm} />
      
      <FloatingContact />
      
      {/* Botón para volver arriba */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-20 right-4 bg-motorcycle-red text-white rounded-full p-3 shadow-lg transition-all ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-label="Volver arriba"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </button>
    </div>
  );
};

export default Index;
