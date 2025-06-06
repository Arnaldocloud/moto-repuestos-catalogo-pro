import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Menu, X, Settings, LogIn } from "lucide-react";
import { STORE_NAME } from "@/config/contact";
import { useCart } from "@/hooks/useCart";
import { useAdminRole } from "@/hooks/useAdminRole";
import CartDrawer from "./CartDrawer";
import ThemeSwitcher from "./ThemeSwitcher";

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartKey, setCartKey] = useState(0);
  const { items } = useCart();
  const { isAdmin, isLoading: isLoadingAdmin } = useAdminRole();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setIsMenuOpen(false);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const openCart = () => {
    setCartKey(prev => prev + 1);
    setIsCartOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-xl font-bold text-primary">{STORE_NAME}</span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Buscar repuestos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-full"
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeSwitcher />
            
            {!isLoadingAdmin && isAdmin && (
              <Button asChild variant="outline" size="sm">
                <Link to="/admin">
                  <Settings className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              </Button>
            )}
            
            <Button asChild variant="outline" size="sm">
              <Link to="/auth">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>

            <Button variant="outline" size="sm" onClick={openCart} className="relative">
              <ShoppingCart className="h-4 w-4" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeSwitcher />
            <Button variant="outline" size="sm" onClick={openCart} className="relative">
              <ShoppingCart className="h-4 w-4" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {itemCount}
                </Badge>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Buscar repuestos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 w-full"
                  />
                </div>
              </form>
              
              <div className="flex flex-col space-y-2">
                {!isLoadingAdmin && isAdmin && (
                  <Button asChild variant="outline" size="sm" onClick={() => setIsMenuOpen(false)}>
                    <Link to="/admin">
                      <Settings className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </Button>
                )}
                
                <Button asChild variant="outline" size="sm" onClick={() => setIsMenuOpen(false)}>
                  <Link to="/auth">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      <CartDrawer key={cartKey} isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
