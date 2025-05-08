import React, { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "./ThemeSwitcher";
import { STORE_NAME } from "@/config/contact";
interface HeaderProps {
  onSearch: (query: string) => void;
}
const Header: React.FC<HeaderProps> = ({
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          
          <div className="flex items-center gap-2">
            
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
          <ThemeSwitcher />
        </div>
      </div>

      {/* Mobile Search */}
      {isMenuOpen && <div className="p-4 border-t md:hidden">
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
              <Search className="h-4 w-4" />
              <span className="sr-only">Buscar</span>
            </Button>
          </form>
        </div>}
    </header>;
};
export default Header;