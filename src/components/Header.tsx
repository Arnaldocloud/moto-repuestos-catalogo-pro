import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CartDrawer from "./CartDrawer";
import OrderForm from "./OrderForm";
import ThemeSwitcher from "./ThemeSwitcher";
import { STORE_NAME } from "@/config/contact";
import { useAdminRole } from "@/hooks/useAdminRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isAdmin, loading } = useAdminRole();
  const navigate = useNavigate();

  // Verificar si hay sesión activa
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
    
    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    navigate("/");
  };

  const handleCartCheckout = () => {
    setIsOrderFormOpen(true);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Sesión cerrada correctamente");
      navigate("/");
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-motorcycle-red rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">MR</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline-block">{STORE_NAME}</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="search"
                placeholder="Buscar repuestos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Inicio
            </Link>
            <Link to="/categorias" className="text-sm font-medium transition-colors hover:text-primary">
              Categorías
            </Link>
            <Link to="/contacto" className="text-sm font-medium transition-colors hover:text-primary">
              Contacto
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
            {!isAuthenticated ? (
              <Link to="/auth" className="text-sm font-medium transition-colors hover:text-primary">
                Login
              </Link>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            )}
            <ThemeSwitcher />
            <CartDrawer onCheckout={handleCartCheckout} />
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeSwitcher />
            <CartDrawer onCheckout={handleCartCheckout} />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Buscar repuestos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-2">
                <Link 
                  to="/" 
                  className="text-sm font-medium py-2 transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link 
                  to="/categorias" 
                  className="text-sm font-medium py-2 transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Categorías
                </Link>
                <Link 
                  to="/contacto" 
                  className="text-sm font-medium py-2 transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contacto
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-sm font-medium py-2 transition-colors hover:text-primary flex items-center gap-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                )}
                {!isAuthenticated ? (
                  <Link 
                    to="/auth" 
                    className="text-sm font-medium py-2 transition-colors hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium transition-colors hover:text-primary justify-start p-0"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>

      <OrderForm isOpen={isOrderFormOpen} onClose={() => setIsOrderFormOpen(false)} />
    </>
  );
};

export default Header;
