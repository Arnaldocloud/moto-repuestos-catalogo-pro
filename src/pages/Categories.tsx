
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { categoryNames, Category } from "@/types/product";
import { 
  Cog, 
  Zap, 
  Circle, 
  Car, 
  Droplets, 
  Filter, 
  Settings, 
  Disc,
  Wrench
} from "lucide-react";

const categoryIcons: Record<Category, React.ReactNode> = {
  motor: <Cog className="h-8 w-8" />,
  frenos: <Disc className="h-8 w-8" />,
  electricos: <Zap className="h-8 w-8" />,
  suspension: <Circle className="h-8 w-8" />,
  carroceria: <Car className="h-8 w-8" />,
  aceites: <Droplets className="h-8 w-8" />,
  filtros: <Filter className="h-8 w-8" />,
  transmision: <Settings className="h-8 w-8" />,
  llantas: <Circle className="h-8 w-8" />,
  accesorios: <Wrench className="h-8 w-8" />
};

const categoryDescriptions: Record<Category, string> = {
  motor: "Pistones, anillos, válvulas, juntas y todo para el motor",
  frenos: "Pastillas, discos, cables y sistema de frenado completo",
  electricos: "Baterías, focos, cables, bobinas y componentes eléctricos",
  suspension: "Amortiguadores, resortes y componentes de suspensión",
  carroceria: "Guardafangos, tanques, asientos y partes de carrocería",
  aceites: "Aceites de motor, transmisión y mantenimiento",
  filtros: "Filtros de aire, aceite y combustible",
  transmision: "Cadenas, piñones, embragues y transmisión",
  llantas: "Cauchos, rines y componentes de ruedas",
  accesorios: "Cascos, guantes, espejos y accesorios varios"
};

const Categories = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryClick = (category: string) => {
    navigate(`/?category=${category}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    navigate(`/?search=${query}`);
  };

  const filteredCategories = Object.entries(categoryNames).filter(([key, name]) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Categorías de Repuestos</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Encuentra fácilmente los repuestos que necesitas navegando por nuestras categorías especializadas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map(([categoryKey, categoryName]) => {
              const category = categoryKey as Category;
              return (
                <Card 
                  key={category}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                  onClick={() => handleCategoryClick(category)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {categoryIcons[category]}
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                          {categoryName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {categoryDescriptions[category]}
                        </p>
                      </div>
                      
                      <Badge variant="secondary" className="mt-4">
                        Ver productos
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Sección de ayuda */}
          <Card className="mt-12">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Nuestro equipo de expertos puede ayudarte a encontrar el repuesto exacto que necesitas. 
                  Contáctanos con la marca y modelo de tu moto.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/contact')}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Contactar Experto
                  </button>
                  <button
                    onClick={() => window.open('https://wa.me/584121234567?text=Hola! Necesito ayuda para encontrar un repuesto específico.', '_blank')}
                    className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
                  >
                    WhatsApp Directo
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Categories;
