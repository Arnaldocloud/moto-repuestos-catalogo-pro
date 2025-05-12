import React, { useState, useEffect } from "react";
import { Search, Menu, X, Shield, LogIn, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "./ThemeSwitcher";
import { STORE_NAME } from "@/config/contact";
import { Link, useNavigate } from "react-router-dom";
import { useAdminRole } from "@/hooks/useAdminRole";
import { supabase, cleanupAuthState } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<any> = ({
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin, loading } = useAdminRole();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  const handleLogout = async () => {
    try {
      // Limpiar estado de autenticación
      cleanupAuthState();
      
      // Cerrar sesión globalmente
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.error("Error al cerrar sesión global:", err);
      }
      
      toast.success("Has cerrado sesión correctamente");
      
      // Forzar recarga completa para asegurar estado limpio
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden relative p-2" 
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            <span className="sr-only">{isMenuOpen ? "Cerrar menú" : "Abrir menú"}</span>
          </Button>
          
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center font-bold text-xl">
              {STORE_NAME}
            </Link>
          </div>
        </div>

        <form onSubmit={handleSearch} className="hidden md:flex items-center w-1/3 relative">
          <Input 
            type="search" 
            placeholder="Buscar repuestos..." 
            className="w-full" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            aria-label="Buscar repuestos"
          />
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute right-0" 
            type="submit"
            aria-label="Buscar"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Buscar</span>
          </Button>
        </form>

        <div className="flex items-center gap-2">
          {loading ? (
            <span className="text-sm text-muted-foreground animate-pulse">Cargando...</span>
          ) : isAuthenticated ? (
            <>
              {isAdmin && (
                <Button variant="outline" size="sm" asChild className="hidden md:flex">
                  <Link to="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    Administración
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden md:flex">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </Button>
            </>
          ) : (
            <Button variant="default" size="sm" asChild className="hidden md:flex">
              <Link to="/auth">
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar sesión
              </Link>
            </Button>
          )}
          <ThemeSwitcher />
        </div>
      </div>

      {/* Mobile Menu - Improved for better UX */}
      {isMenuOpen && (
        <div 
          id="mobile-menu"
          className="fixed inset-0 top-16 z-30 bg-background/95 backdrop-blur-sm animate-in slide-in-from-top-5 md:hidden"
        >
          <div className="container flex flex-col gap-6 p-6">
            <form onSubmit={handleSearch} className="flex items-center w-full">
              <Input 
                type="search" 
                placeholder="Buscar repuestos..." 
                className="w-full" 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                aria-label="Buscar repuestos"
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className="ml-2" 
                type="submit"
                aria-label="Buscar"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Buscar</span>
              </Button>
            </form>
            
            <nav className="flex flex-col gap-4">
              <Link to="/" className="flex items-center py-2 text-lg font-medium border-b border-border">
                Inicio
              </Link>
              <Link to="/categorias" className="flex items-center py-2 text-lg font-medium border-b border-border">
                Categorías
              </Link>
              <Link to="/contacto" className="flex items-center py-2 text-lg font-medium border-b border-border">
                Contacto
              </Link>
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" className="flex items-center py-2 text-lg font-medium border-b border-border">
                      <Shield className="mr-2 h-5 w-5" />
                      Administración
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="flex items-center py-2 text-lg font-medium border-b border-border"
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link to="/auth" className="flex items-center py-2 text-lg font-medium border-b border-border">
                  <LogIn className="mr-2 h-5 w-5" />
                  Iniciar sesión
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>;
};

export default Header;
